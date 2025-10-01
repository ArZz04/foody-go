"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { Category, Store } from "../data";
import { StoreGrid } from "./StoreGrid";

const TAG_OPTIONS = [
  { value: "vegano", label: "Vegano" },
  { value: "promo", label: "Promoción" },
  { value: "popular", label: "Popular" },
] as const;

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevancia" },
  { value: "price-asc", label: "Precio ↑" },
  { value: "price-desc", label: "Precio ↓" },
  { value: "rating-desc", label: "Mejor valorado" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

function parsePrice(value: string): number | null {
  const match = value.replace(/,/g, ".").match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

type StoreExplorerProps = {
  stores: Store[];
  categories: Category[];
  defaultCategory?: string;
  lockedCategory?: boolean;
};

export function StoreExplorer({
  stores,
  categories,
  defaultCategory = "",
  lockedCategory = false,
}: StoreExplorerProps) {
  const initialCategory = defaultCategory;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [category, setCategory] = useState(() =>
    lockedCategory
      ? initialCategory
      : searchParams.get("category") ?? initialCategory,
  );
  const [minPrice, setMinPrice] = useState(() => searchParams.get("min") ?? "");
  const [maxPrice, setMaxPrice] = useState(() => searchParams.get("max") ?? "");
  const [sortBy, setSortBy] = useState<SortValue>(() => {
    const initial = searchParams.get("sort") as SortValue | null;
    return initial && SORT_OPTIONS.some((option) => option.value === initial)
      ? initial
      : "relevance";
  });
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const value = searchParams.get("tags");
    return value ? value.split(",").filter(Boolean) : [];
  });

  useEffect(() => {
    const nextQuery = searchParams.get("q") ?? "";
    const nextMin = searchParams.get("min") ?? "";
    const nextMax = searchParams.get("max") ?? "";
    const nextSort = (searchParams.get("sort") as SortValue | null) ?? "relevance";
    const nextTags = searchParams.get("tags");
    const nextCategory = searchParams.get("category") ?? initialCategory;

    setQuery((prev) => (prev !== nextQuery ? nextQuery : prev));
    setMinPrice((prev) => (prev !== nextMin ? nextMin : prev));
    setMaxPrice((prev) => (prev !== nextMax ? nextMax : prev));
    if (!lockedCategory) {
      setCategory((prev) => (prev !== nextCategory ? nextCategory : prev));
    }
    setSortBy((prev) => (prev !== nextSort ? nextSort : prev));
    setSelectedTags((prev) => {
      const tagsArray = nextTags ? nextTags.split(",").filter(Boolean) : [];
      const sameLength = prev.length === tagsArray.length;
      const sameItems = sameLength && prev.every((tag) => tagsArray.includes(tag));
      return sameItems ? prev : tagsArray;
    });
  }, [searchParams, initialCategory, lockedCategory]);

  const updateUrl = useCallback(
    (
      nextState: {
        q: string;
        category: string;
        min: string;
        max: string;
        sort: SortValue;
        tags: string[];
      },
    ) => {
      const params = new URLSearchParams();

      if (nextState.q.trim()) {
        params.set("q", nextState.q.trim());
      }

      if (!lockedCategory && nextState.category) {
        params.set("category", nextState.category);
      }

      if (nextState.min) {
        params.set("min", nextState.min);
      }

      if (nextState.max) {
        params.set("max", nextState.max);
      }

      if (nextState.sort !== "relevance") {
        params.set("sort", nextState.sort);
      }

      if (nextState.tags.length > 0) {
        params.set("tags", nextState.tags.sort().join(","));
      }

      const queryString = params.toString();
      const current = searchParams.toString();
      if (queryString === current) {
        return;
      }

      const url = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(url, { scroll: false });
    },
    [lockedCategory, pathname, router, searchParams],
  );

  useEffect(() => {
    updateUrl({ q: query, category, min: minPrice, max: maxPrice, sort: sortBy, tags: selectedTags });
  }, [updateUrl, query, category, minPrice, maxPrice, sortBy, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((item) => item !== tag)
        : [...prev, tag],
    );
  };

  const activeCategory = lockedCategory ? initialCategory : category;
  const activeCategoryName = useMemo(() => {
    const selected = categories.find((item) => item.slug === activeCategory);
    return selected?.name;
  }, [categories, activeCategory]);

  const minValue = minPrice ? Number(minPrice) : null;
  const maxValue = maxPrice ? Number(maxPrice) : null;

  const filteredStores = useMemo(() => {
    const terms = query
      .toLowerCase()
      .split(/\s+/)
      .map((term) => term.trim())
      .filter(Boolean);

    const needsTags = selectedTags.length > 0;

    return stores
      .map((store, index) => {
        const priceValue = parsePrice(store.price);
        const normalizedName = store.name.toLowerCase();
        const normalizedCategory = store.category.toLowerCase();
        const normalizedBlurb = store.blurb.toLowerCase();
        const normalizedTags = store.tags.map((tag) => tag.toLowerCase());
        const normalizedLabels = store.labels.map((label) => label.toLowerCase());

        if (activeCategory && !store.tags.includes(activeCategory)) {
          return null;
        }

        if (needsTags) {
          const hasAllTags = selectedTags.every((tag) =>
            normalizedLabels.includes(tag.toLowerCase()),
          );

          if (!hasAllTags) {
            return null;
          }
        }

        if (minValue !== null) {
          if (priceValue === null || priceValue < minValue) {
            return null;
          }
        }

        if (maxValue !== null) {
          if (priceValue === null || priceValue > maxValue) {
            return null;
          }
        }

        if (terms.length > 0) {
          const haystack = [
            normalizedName,
            normalizedCategory,
            normalizedBlurb,
            ...normalizedTags,
            ...normalizedLabels,
          ];

          const matches = terms.every((term) =>
            haystack.some((value) => value.includes(term)),
          );

          if (!matches) {
            return null;
          }
        }

        let relevance = stores.length - index;

        if (terms.length > 0) {
          terms.forEach((term) => {
            if (normalizedName.startsWith(term)) {
              relevance += 100;
            } else if (normalizedName.includes(term)) {
              relevance += 60;
            }

            if (normalizedBlurb.includes(term)) {
              relevance += 15;
            }

            if (normalizedCategory.includes(term)) {
              relevance += 20;
            }
          });
        }

        if (store.labels.includes("popular")) {
          relevance += 10;
        }

        if (store.promo) {
          relevance += 5;
        }

        return {
          store,
          relevance,
          priceValue,
        };
      })
      .filter((item): item is { store: Store; relevance: number; priceValue: number | null } =>
        item !== null,
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "price-asc": {
            const aPrice = a.priceValue ?? Number.POSITIVE_INFINITY;
            const bPrice = b.priceValue ?? Number.POSITIVE_INFINITY;
            return aPrice - bPrice;
          }
          case "price-desc": {
            const aPrice = a.priceValue ?? -1;
            const bPrice = b.priceValue ?? -1;
            return bPrice - aPrice;
          }
          case "rating-desc": {
            return b.store.rating - a.store.rating;
          }
          default:
            return b.relevance - a.relevance;
        }
      })
      .map((item) => item.store);
  }, [
    stores,
    query,
    selectedTags,
    activeCategory,
    minValue,
    maxValue,
    sortBy,
  ]);

  const activeFilters =
    query.trim().length > 0 ||
    (!!activeCategory && !lockedCategory && activeCategory !== "") ||
    !!minValue ||
    !!maxValue ||
    selectedTags.length > 0 ||
    sortBy !== "relevance";

  const resetFilters = () => {
    setQuery("");
    if (!lockedCategory) {
      setCategory("");
    }
    setMinPrice("");
    setMaxPrice("");
    setSortBy("relevance");
    setSelectedTags([]);
  };

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <div className="rounded-3xl border border-emerald-100 bg-white/95 p-6 shadow-lg backdrop-blur-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground" htmlFor="store-search">
                Buscar tiendas o platillos
              </label>
            <div className="mt-1 flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2">
              <span className="text-lg" aria-hidden>
                🔍
              </span>
              <input
                id="store-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="pizza, smoothies, postres veganos..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
              />
            </div>
          </div>
          <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {!lockedCategory ? (
              <div>
                <label className="text-sm font-medium text-muted-foreground" htmlFor="store-category">
                  Categoría
                </label>
                <select
                  id="store-category"
                  value={category ?? ""}
                  onChange={(event) => setCategory(event.target.value)}
                  className="mt-1 w-full rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm text-emerald-900 outline-none focus:border-emerald-400 focus:ring-0"
                >
                  <option value="">Todas</option>
                  {categories.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            <div>
              <label className="text-sm font-medium text-muted-foreground" htmlFor="price-min">
                Precio mínimo
              </label>
              <input
                id="price-min"
                type="number"
                min="0"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
                placeholder="0"
                className="mt-1 w-full rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm text-emerald-900 outline-none focus:border-emerald-400 focus:ring-0"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground" htmlFor="price-max">
                Precio máximo
              </label>
              <input
                id="price-max"
                type="number"
                min="0"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                placeholder="350"
                className="mt-1 w-full rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm text-emerald-900 outline-none focus:border-emerald-400 focus:ring-0"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground" htmlFor="sort-by">
                Ordenar por
              </label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortValue)}
                className="mt-1 w-full rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm text-emerald-900 outline-none focus:border-emerald-400 focus:ring-0"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {TAG_OPTIONS.map((tag) => {
            const isActive = selectedTags.includes(tag.value);
            return (
              <button
                key={tag.value}
                type="button"
                onClick={() => toggleTag(tag.value)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700"
                    : "border-emerald-200 bg-white text-emerald-800 hover:border-emerald-300 hover:bg-emerald-50"
                }`}
              >
                {tag.label}
              </button>
            );
          })}

          {activeFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-emerald-700 underline-offset-4 hover:underline"
            >
              Limpiar filtros
            </button>
          ) : null}

          {lockedCategory && activeCategoryName ? (
            <span className="ml-auto text-xs text-muted-foreground">
              Categoría: {activeCategoryName}
            </span>
          ) : null}
        </div>
        </div>
        <div className="flex items-center justify-between rounded-full border border-emerald-100 bg-white/90 px-5 py-3 text-sm text-muted-foreground shadow">
          <p>
            {filteredStores.length} {filteredStores.length === 1 ? "tienda" : "tiendas"} encontradas
            {query ? ` para "${query.trim()}"` : ""}
            {activeCategoryName && !lockedCategory ? ` en ${activeCategoryName.toLowerCase()}` : ""}
          </p>
        </div>
      </div>

      {filteredStores.length > 0 ? (
        <StoreGrid stores={filteredStores} categoryLabel={activeCategoryName} />
      ) : (
        <div className="rounded-3xl border border-emerald-100 bg-white/80 p-12 text-center text-emerald-800">
          <h3 className="text-xl font-semibold">No encontramos coincidencias</h3>
          <p className="mt-2 text-sm text-emerald-900/80">
            Ajusta los filtros o prueba con otra búsqueda para descubrir nuevas opciones.
          </p>
        </div>
      )}
    </section>
  );
}

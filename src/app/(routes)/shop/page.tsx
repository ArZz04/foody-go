"use client";

import {
  Bike,
  ChevronRight,
  Coffee,
  Flame,
  Flower2,
  IceCreamBowl,
  MapPin,
  Pizza,
  Search,
  Sparkles,
  Store,
  Tag,
  Utensils,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import BusinessCard from "./components/BusinessCard";

type Business = {
  id: number | string;
  name: string;
  city?: string;
  category?: string;
};

type ApiBusiness = {
  id: number | string;
  name?: string;
  nombre?: string;
  city?: string;
  ciudad?: string;
  category?: string;
  category_name?: string;
  giro?: string;
  business_category_name?: string;
};

const PLACEHOLDER_IDS = Array.from(
  { length: 10 },
  (_, i) => `placeholder-${i}`,
);

const STATIC_FILTERS = [
  { label: "Popular", icon: Flame, color: "bg-red-500" },
  { label: "Ofertas", icon: Tag, color: "bg-emerald-400" },
  { label: "Rápido", icon: Bike, color: "bg-blue-400" },
  { label: "Restaurante", icon: Utensils, color: "bg-orange-400" },
  { label: "Cantina", icon: Coffee, color: "bg-amber-400" },
  { label: "Postres", icon: IceCreamBowl, color: "bg-pink-400" },
  { label: "Flores", icon: Flower2, color: "bg-purple-400" },
  { label: "Pizza", icon: Pizza, color: "bg-yellow-400" },
];

const CARD_IMAGES = [5, 6, 7, 8, 9, 10];

function stableNumber(value: string | number, offset = 0) {
  const source = String(value);
  return (
    source.split("").reduce((total, char) => total + char.charCodeAt(0), 0) +
    offset
  );
}

function getRating(id: string | number, index: number) {
  return 4.5 + (stableNumber(id, index) % 5) / 10;
}

function getEta(index: number) {
  return 14 + ((index * 5) % 22);
}

function getDeliveryFee(index: number) {
  return index % 4 === 0 ? 0 : 18 + (index % 3) * 7;
}

function getPriceTier(index: number) {
  return "$".repeat(1 + (index % 3));
}

export default function ShopPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/shop/business");
        const data = await res.json();

        const parsedBusinesses: Business[] = (data.negocios ?? []).map(
          (business: ApiBusiness) => ({
            id: business.id,
            name: business.name ?? business.nombre ?? "Negocio local",
            city: business.city ?? business.ciudad,
            category:
              business.category ??
              business.category_name ??
              business.giro ??
              business.business_category_name ??
              "Restaurante",
          }),
        );

        setBusinesses(parsedBusinesses);
      } catch (err) {
        console.error("Error al obtener negocios:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const categoryFilters = useMemo(() => {
    const categories = Array.from(
      new Set(
        businesses
          .map((business) => business.category)
          .filter((category): category is string => Boolean(category)),
      ),
    );

    return [
      "Todos",
      ...STATIC_FILTERS.map((filter) => filter.label),
      ...categories,
    ];
  }, [businesses]);

  const filteredBusinesses = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return businesses.filter((business) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        business.name.toLowerCase().includes(normalizedSearch) ||
        business.city?.toLowerCase().includes(normalizedSearch) ||
        business.category?.toLowerCase().includes(normalizedSearch);

      const matchesFilter =
        selectedFilter === "Todos" ||
        STATIC_FILTERS.some((filter) => filter.label === selectedFilter) ||
        business.category === selectedFilter;

      return matchesSearch && matchesFilter;
    });
  }, [businesses, searchQuery, selectedFilter]);

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-slate-950">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-7 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-lg shadow-orange-600/20">
              <Store className="h-7 w-7" />
            </span>
            <button
              type="button"
              className="rounded-2xl px-3 py-2 text-left transition hover:bg-white"
            >
              <p className="text-sm font-black text-slate-400">Entregar en</p>
              <span className="inline-flex items-center gap-2 text-xl font-black">
                Ciudad Óptica
                <ChevronRight className="h-5 w-5 rotate-90" />
              </span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative inline-flex size-11 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-slate-950"
              aria-label="Notificaciones"
            >
              <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-red-500" />
              <Sparkles className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-slate-950"
              aria-label="Perfil"
            >
              <MapPin className="h-5 w-5" />
            </button>
          </div>
        </header>

        <section>
          <label className="relative block">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Buscar restaurantes, comidas..."
              className="h-16 w-full rounded-2xl border border-slate-200 bg-white pl-16 pr-5 text-lg font-semibold text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
            />
          </label>
        </section>

        <section className="flex gap-8 overflow-x-auto border-b border-slate-200 pb-7">
          {categoryFilters.slice(1, 9).map((item) => {
            const isActive = selectedFilter === item;
            const staticFilter = STATIC_FILTERS.find(
              (filter) => filter.label === item,
            );
            const Icon = staticFilter?.icon ?? Store;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setSelectedFilter(item)}
                className="group flex shrink-0 flex-col items-center gap-3"
              >
                <span
                  className={`inline-flex size-20 items-center justify-center rounded-full text-white shadow-lg transition group-hover:-translate-y-1 ${
                    staticFilter?.color ?? "bg-orange-500"
                  } ${isActive ? "ring-4 ring-orange-100" : ""}`}
                >
                  <Icon className="h-9 w-9" />
                </span>
                <span
                  className={`text-base font-black ${
                    isActive ? "text-slate-950" : "text-slate-500"
                  }`}
                >
                  {item}
                </span>
              </button>
            );
          })}
        </section>

        <section className="overflow-hidden rounded-[24px] bg-gradient-to-r from-orange-600 to-red-500 px-8 py-8 text-white shadow-xl shadow-orange-900/10">
          <p className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.12em]">
            <Sparkles className="h-5 w-5" />
            Oferta especial
          </p>
          <h1 className="mt-5 text-4xl font-black tracking-tight">
            Descuentos de hasta 30%
          </h1>
          <p className="mt-4 text-lg font-semibold text-white/90">
            En restaurantes seleccionados. Válido hoy.
          </p>
          <button
            type="button"
            onClick={() => setSelectedFilter("Ofertas")}
            className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 text-base font-black text-orange-600 shadow-lg transition hover:bg-orange-50"
          >
            Ver ofertas
          </button>
        </section>

        <section className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Más populares
              </h1>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 text-base font-black text-orange-600 transition hover:text-orange-700"
            >
              {filteredBusinesses.length} aliados
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {loading ? (
            <div className="grid animate-pulse grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {PLACEHOLDER_IDS.map((placeholder) => (
                <div
                  key={placeholder}
                  className="h-52 rounded-[18px] bg-white shadow-sm"
                />
              ))}
            </div>
          ) : filteredBusinesses.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {filteredBusinesses.map((business, index) => (
                <BusinessCard
                  key={`${business.id ?? "business"}-${index}`}
                  id={CARD_IMAGES[index % CARD_IMAGES.length]}
                  name={business.name}
                  city={business.city}
                  category={business.category}
                  rating={getRating(business.id, index)}
                  etaMinutes={getEta(index)}
                  deliveryFee={getDeliveryFee(index)}
                  priceTier={getPriceTier(index)}
                  badge={
                    index % 3 === 0
                      ? "Popular"
                      : index % 3 === 1
                        ? "Más vendido"
                        : "Nuevo"
                  }
                  discount={
                    index % 4 === 0
                      ? "20% OFF"
                      : index % 4 === 2
                        ? "15% OFF"
                        : undefined
                  }
                  href={`/shop/${business.id ?? index}`}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <Store className="mx-auto h-10 w-10 text-slate-300" />
              <h2 className="mt-4 text-xl font-black text-slate-900">
                No encontramos aliados
              </h2>
              <p className="mt-2 font-semibold text-slate-500">
                Prueba con otra búsqueda o cambia el filtro seleccionado.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { IMAGE_BLUR_DATA_URL, type Store } from "../data";

const INITIAL_COUNT = 8;
const LOAD_MORE_STEP = 4;

type StoreGridProps = {
  stores: Store[];
  categoryLabel?: string;
};

export function StoreGrid({ stores, categoryLabel }: StoreGridProps) {
  const [visibleCount, setVisibleCount] = useState(
    Math.min(INITIAL_COUNT, stores.length),
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setVisibleCount(Math.min(INITIAL_COUNT, stores.length));
    setIsLoading(false);
  }, [stores]);

  const visibleStores = useMemo(
    () => stores.slice(0, visibleCount),
    [stores, visibleCount],
  );

  const remainingItems = Math.max(stores.length - visibleCount, 0);
  const canLoadMore = remainingItems > 0;

  const handleLoadMore = () => {
    if (!canLoadMore) {
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((count) =>
        Math.min(count + LOAD_MORE_STEP, stores.length),
      );
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleStores.map((store) => (
          <article
            key={store.name}
            className="group rounded-3xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="overflow-hidden rounded-t-3xl">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={store.image}
                  alt={`${store.name} - ${store.category}`}
                  fill
                  sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 40vw, 90vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                />
              </div>
            </div>
            <div className="space-y-3 px-5 py-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {store.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {store.category}
                  </p>
                  <p className="text-sm text-muted-foreground/80 line-clamp-2">
                    {store.blurb}
                  </p>
                  {categoryLabel ? (
                    <p className="mt-2 inline-flex rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      {categoryLabel}
                    </p>
                  ) : null}
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  ★ {store.rating}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{store.eta}</span>
                <span>•</span>
                <span>{store.price}</span>
              </div>
              {store.promo ? (
                <span className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                  {store.promo}
                </span>
              ) : null}
            </div>
          </article>
        ))}
        {isLoading
          ? Array.from({
              length: Math.min(LOAD_MORE_STEP, remainingItems),
            }).map((_, index) => <StoreSkeleton key={`skeleton-${index}`} />)
          : null}
      </div>
      {canLoadMore ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
          >
            {isLoading ? "Cargando opciones…" : `Ver más (${remainingItems})`}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function StoreSkeleton() {
  return (
    <div className="animate-pulse rounded-3xl border border-black/5 bg-white shadow-sm">
      <div className="shimmer relative aspect-[4/3] w-full overflow-hidden rounded-t-3xl bg-emerald-100/60" />
      <div className="space-y-3 px-5 py-4">
        <div className="shimmer h-4 w-2/3 rounded-full bg-emerald-100" />
        <div className="shimmer h-3 w-1/2 rounded-full bg-emerald-50" />
        <div className="shimmer h-3 w-full rounded-full bg-emerald-50" />
        <div className="shimmer h-3 w-3/4 rounded-full bg-emerald-50" />
        <div className="shimmer h-3 w-1/3 rounded-full bg-emerald-100/80" />
      </div>
    </div>
  );
}

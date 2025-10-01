import Image from "next/image";
import Link from "next/link";

import { StoreExplorer } from "./components/StoreExplorer";
import { IMAGE_BLUR_DATA_URL, categories, promotions, stores } from "./data";

export default function TiendasPage() {
  return (
    <div className="min-h-screen bg-white/80 text-foreground">
      <header className="border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="container mx-auto flex flex-col gap-2 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Entrega a
            </p>
            <h1 className="text-3xl font-bold text-foreground">
              Todas las tiendas
            </h1>
          </div>
          <div className="hidden" aria-hidden />
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 space-y-12">
        <section>
          <StoreExplorer stores={stores} categories={categories} />
        </section>

        <section className="space-y-4">
          <header className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              ¿Qué necesitas hoy?
            </h2>
            <button className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
              Ver todo
            </button>
          </header>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/tiendas/${category.slug}`}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-white/80 px-4 py-5 text-center text-sm font-medium text-emerald-800 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
                aria-label={`Ver tiendas de ${category.name}`}
              >
                <span className="text-2xl">{category.emoji}</span>
                <span>{category.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <header className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Promociones destacadas
            </h2>
            <button className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
              Ver promociones
            </button>
          </header>
          <div className="grid gap-4 md:grid-cols-3">
            {promotions.map((promo, index) => (
              <article
                key={promo.title}
                className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-600/90 to-emerald-700 text-white shadow-lg"
              >
                <div className="absolute inset-0 opacity-40">
                  <div className="relative h-full w-full">
                    <Image
                      src={promo.image}
                      alt={promo.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, 90vw"
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR_DATA_URL}
                      priority={index === 0}
                    />
                  </div>
                </div>
                <div className="relative space-y-3 p-6">
                  <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    {promo.tag}
                  </span>
                  <h3 className="text-2xl font-semibold leading-tight drop-shadow-sm">
                    {promo.title}
                  </h3>
                  <p className="text-sm text-white/80 drop-shadow-sm">
                    {promo.description}
                  </p>
                  <button className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-white">
                    {promo.cta}
                    <span aria-hidden>→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

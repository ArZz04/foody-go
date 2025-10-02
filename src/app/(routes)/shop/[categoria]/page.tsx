import Link from "next/link";
import { notFound } from "next/navigation";

import { StoreExplorer } from "../components/StoreExplorer";
import { categories, stores } from "../data";

export function generateStaticParams() {
  return categories.map((category) => ({ categoria: category.slug }));
}

export default function CategoryPage({
  params,
}: { params: { categoria: string } }) {
  const category = categories.find((item) => item.slug === params.categoria);

  if (!category) {
    notFound();
  }

  const otherCategories = categories.filter(
    (item) => item.slug !== category.slug,
  );

  return (
    <div className="min-h-screen bg-white/80 text-foreground">
      <header className="border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="container mx-auto flex flex-col gap-6 px-4 py-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Estás explorando
            </p>
            <div className="flex items-center gap-3 text-3xl font-bold">
              <span className="text-4xl">{category.emoji}</span>
              <h1>{category.name}</h1>
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">
              {category.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/tiendas"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-800 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              ← Todas las tiendas
            </Link>
            <nav className="flex flex-wrap gap-2">
              {otherCategories.map((item) => (
                <Link
                  key={item.slug}
                  href={`/tiendas/${item.slug}`}
                  className="rounded-full border border-transparent bg-emerald-100/70 px-3 py-1 text-sm text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-50"
                >
                  {item.emoji} {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <StoreExplorer
          key={category.slug}
          stores={stores}
          categories={categories}
          defaultCategory={category.slug}
          lockedCategory
        />
      </main>
    </div>
  );
}

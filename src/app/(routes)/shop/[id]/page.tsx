"use client";

import { ArrowLeft, MapPin, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";

type Business = {
  id: number | string;
  name: string;
  city?: string;
  category?: string;
  category_name?: string;
};

type Product = {
  id: number;
  business_id: number;
  sku: string;
  barcode: string | null;
  name: string;
  description_long: string | null;
  description_short: string | null;
  product_category_id: number;
  product_subcategory_id: number | null;
  price: number;
  discount_price: number | null;
  currency: string;
  sale_format: string | null;
  price_per_unit: number | null;
  tax_included: boolean;
  tax_rate: number | null;
  commission_rate: number | null;
  is_stock_available: boolean;
  max_per_order: number | null;
  min_per_order: number | null;
  promotion_id: number | null;
  thumbnail_url: string | null;
  stock_average: number;
  stock_danger: number;
  created_at: string | Date;
  updated_at: string | Date;
  expires_at: string | Date | null;
  status_id: number;
  
  // Campos opcionales que pueden venir del JOIN
  category_name?: string;
  business_name?: string;
  category_id?: number;
};

const NAV_TABS = [
  { key: "promos", label: "Promociones" },
  { key: "favoritos", label: "Favoritos" },
  { key: "recomendados", label: "Recomendados" },
] as const;

// Número de productos por página
const ITEMS_PER_PAGE = 12;

export default function BusinessDetailPage() {
  const params = useParams<{ id: string }>();
  const businessId = Number(params?.id ?? NaN);
  const [business, setBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<(typeof NAV_TABS)[number]["key"]>("promos");
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmed, setConfirmed] = useState<Record<number, boolean>>({});


  const addToCart = (productId: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: prev[productId] ? prev[productId] + 1 : 1
    }));
  };

  const decrement = (productId: number) => {
    setQuantities(prev => {
      const current = prev[productId] || 1;
      if (current <= 1) return prev;
      return { ...prev, [productId]: current - 1 };
    });
  };

  const increment = (productId: number) => {
    
    setQuantities(prev => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1
    }));
  };

  const confirmQuantity = (productId: number) => {
  setConfirmed(prev => ({ ...prev, [productId]: true }));
  // Aquí después puedes disparar:
  //  enviar al carrito real
  //  abrir modal
  //  llamar API
};



  // Extraer categorías únicas de los productos
  const categories = useMemo(() => {
    const unique = [
      { id: "all", name: "Todos los productos", count: products.length }
    ];

    const categoryMap = new Map<number, { name: string, count: number }>();

    products.forEach(product => {
      const categoryId = product.product_category_id;
      const categoryName = product.category_name ?? "Sin categoría";

      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, { name: categoryName, count: 1 });
      } else {
        categoryMap.get(categoryId)!.count += 1;
      }
    });

    categoryMap.forEach((value, key) => {
      unique.push({
        id: key.toString(),
        name: value.name,
        count: value.count
      });
    });

    return unique;
  }, [products]);

  // Filtrar productos por categoría y búsqueda
  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    
    // Filtrar por categoría
    if (activeCategory !== "all") {
      filtered = filtered.filter(
        product => product.product_category_id.toString() === activeCategory
      );
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description_short?.toLowerCase().includes(query) ||
        product.category_name?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [products, activeCategory, searchQuery]);

  // Calcular paginación
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  // Resetear página cuando cambia categoría o búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  const fetchBusinessData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/shop/business/${businessId}`, {
        cache: "no-store"
      });
      if (!res.ok) throw new Error("No pudimos cargar el negocio.");
      const data = await res.json();

      setBusiness(data.business ?? null);
      setProducts(data.products ?? []);

    } catch (error) {
      console.error("Error en shop page:", error);

      const stack =
        typeof error === "object" &&
        error !== null &&
        "stack" in error
          ? (error as any).stack
          : null;

      if (stack) console.error(stack);
      setError("No pudimos cargar el menú del negocio.");
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    if (Number.isNaN(businessId)) {
      setError("Negocio no válido.");
      setLoading(false);
      return;
    }

    fetchBusinessData();
  }, [businessId, fetchBusinessData]);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const skeletonCards = Array.from({ length: 8 });

  return (
    <div className="relative min-h-screen bg-[linear-gradient(135deg,#f97316_0%,#fb923c_48%,#fff7ed_100%)] text-white">
      <div className="absolute inset-0 bg-white/10" />
      <div className="absolute inset-0 bg-gradient-to-b from-orange-950/35 via-orange-900/20 to-white/25" />

      <div className="relative z-10">
        <header className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-full border border-white/30 bg-orange-700/30 px-5 py-3 text-sm font-semibold backdrop-blur-lg">
          <Link href="/" className="flex items-center gap-2">
            <span className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white/70 bg-white shadow-md">
              <Image
                src="/LOGO-NEW2.jpg"
                alt="GOGI Eats"
                fill
                className="scale-[1.65] object-contain"
                priority
              />
            </span>
            <span className="hidden sm:inline text-white/90">Gogi Eats</span>
          </Link>
          <span className="text-white/80">Inicio</span>
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-white hover:bg-white/20">Iniciar Sesión</Link>
            <Link href="/auth/register" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-orange-700 shadow-lg hover:shadow-xl">Registrarse</Link>
          </div>
        </header>

        <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-16 pt-8">
          <Link
            href="/shop"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur-md hover:bg-white/15"
          >
            <ArrowLeft className="h-4 w-4" />
            Regresar a tiendas
          </Link>

          {loading ? (
            <>
              <section className="relative overflow-hidden rounded-[32px] border border-white/25 bg-white/5 p-8 shadow-2xl">
                <div className="h-10 w-40 animate-pulse rounded-full bg-white/20" />
                <div className="mt-6 h-14 w-3/4 animate-pulse rounded-2xl bg-white/20" />
                <div className="mt-4 h-6 w-2/3 animate-pulse rounded-full bg-white/15" />
                <div className="mt-6 flex gap-3">
                  <div className="h-12 w-32 animate-pulse rounded-full bg-white/25" />
                  <div className="h-12 w-32 animate-pulse rounded-full bg-white/15" />
                </div>
              </section>

              <section className="rounded-[28px] border border-white/15 bg-white/10 p-6 shadow-lg backdrop-blur-xl">
                <div className="h-12 w-full animate-pulse rounded-2xl bg-white/15" />
              </section>

              <section className="rounded-[28px] border border-white/15 bg-white/10 p-6 shadow-lg backdrop-blur-xl">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {skeletonCards.map((_, i) => (
                    <div key={i} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                      <div className="h-32 w-full animate-pulse rounded-xl bg-white/15" />
                      <div className="h-4 w-3/4 animate-pulse rounded bg-white/15" />
                      <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
                      <div className="h-9 w-full animate-pulse rounded-full bg-white/15" />
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : error ? (
            <div className="flex flex-col gap-4 rounded-[28px] border border-red-200/60 bg-red-900/30 p-6 text-sm text-red-100 shadow-lg">
              <span className="font-semibold">{error}</span>
              <button
                type="button"
                onClick={fetchBusinessData}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-red-700 shadow hover:bg-white"
              >
                Reintentar
              </button>
            </div>
          ) : business ? (
            <>
              <section className="relative overflow-hidden rounded-[38px] border border-white/15 bg-black/25 px-6 py-12 text-center shadow-2xl backdrop-blur-2xl sm:px-10">
                <div className="mx-auto flex max-w-4xl flex-col items-center gap-6">
                  <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white/80 bg-white shadow-xl ring-4 ring-white/40">
                    <Image
                      src="/LOGO-NEW2.jpg"
                      alt="GOGI Eats"
                      fill
                      className="scale-[3.55] object-cover object-[42%_49%]"
                      priority
                    />
                  </div>
                  <div className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white px-4 py-2 text-[11px] font-semibold tracking-[0.18em] text-orange-800">
                    APOYANDO ALIADOS LOCALES
                  </div>
                  <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-6xl">
                    Tu comida favorita,
                    <br className="hidden sm:block" /> al instante
                  </h1>
                  <p className="max-w-2xl text-base text-white/85 sm:text-lg">
                    Apoyando a los primeros aliados de zonas rurales y rancherías cercanas. Sabores hechos en casa, entregados con calidez de comunidad y puntualidad moderna.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link href="#menu" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-orange-800 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
                      Ordenar ahora
                    </Link>
                    <Link href="/shop" className="rounded-full bg-orange-800 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-700">
                      Ver tiendas →
                    </Link>
                  </div>
                </div>
              </section>

              <section id="menu" className="rounded-[28px] border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[260px]">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
                    <input
                      type="search"
                      placeholder="Buscar productos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-2xl border border-white/20 bg-white/15 py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/60 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                </div>
              </section>

              {categories.length > 1 && (
                <section className="rounded-[28px] border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur-2xl">
                  <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setActiveCategory(category.id)}
                        className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                          activeCategory === category.id
                            ? "bg-white text-orange-700 shadow-lg"
                            : "border border-white/30 bg-white/10 text-white/80 hover:bg-white/20"
                        }`}
                      >
                        {category.name}
                        <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] ${
                          activeCategory === category.id ? "bg-orange-100 text-orange-700" : "bg-white/20 text-white"
                        }`}>
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <section className="rounded-[28px] border border-white/15 bg-white/90 p-6 text-sm text-slate-600 shadow-2xl backdrop-blur-xl">
                {products.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 rounded-[28px] border border-orange-100 bg-orange-50/90 p-8 text-center text-orange-800">
                    <div className="text-lg font-semibold">Aún no hay productos publicados.</div>
                    <p className="text-sm">Cuando el negocio añada productos, los verás aquí.</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 rounded-[28px] border border-yellow-200 bg-yellow-50/90 p-8 text-center text-yellow-800">
                    <div className="text-lg font-medium">
                      {searchQuery ? "No se encontraron productos con esa búsqueda." : "No hay productos disponibles en esta categoría."}
                    </div>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-200"
                      >
                        Limpiar búsqueda
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                      {paginatedProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                        >
                          <div className="relative w-full overflow-hidden rounded-xl bg-slate-100">
                            <div className="relative aspect-[4/3] w-full">
                              <Image
                                src={product.thumbnail_url || "/items/thumbnails/generic-item.png"}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-300 hover:scale-105"
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              />
                              {product.discount_price && (
                                <div className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold text-white">
                                  OFERTA
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex w-full flex-col gap-1.5 text-center">
                            <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 sm:text-base">{product.name}</h3>
                            {product.category_name && (
                              <span className="self-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] text-slate-600">{product.category_name}</span>
                            )}
                            <div className="flex items-center justify-center gap-2 text-sm sm:text-lg">
                              {product.discount_price ? (
                                <>
                                  <span className="font-bold text-orange-600">${product.discount_price.toFixed(2)}</span>
                                  <span className="text-xs text-slate-400 line-through sm:text-sm">${product.price.toFixed(2)}</span>
                                </>
                              ) : (
                                <span className="font-bold text-slate-900">${product.price.toFixed(2)}</span>
                              )}
                            </div>
                            <div
                              className={`inline-flex self-center rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-semibold sm:px-2.5 sm:text-xs ${
                                product.is_stock_available
                                  ? product.stock_average > product.stock_danger
                                    ? "text-orange-600"
                                    : "text-amber-600"
                                  : "text-red-600"
                              }`}
                            >
                              {product.is_stock_available
                                ? `Disponible: ${product.stock_average} unidades`
                                : "Agotado"}
                            </div>

                            <div className="mt-2 flex w-full justify-between gap-2">
                              {quantities[product.id] ? (
                                <div className="flex flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">
                                  <button
                                    type="button"
                                    onClick={() => decrement(product.id)}
                                    className="rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold hover:bg-slate-300"
                                  >
                                    -
                                  </button>
                                  <span className="w-6 text-center text-xs font-semibold">{quantities[product.id]}</span>
                                  <button
                                    type="button"
                                    onClick={() => increment(product.id)}
                                    className="rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold hover:bg-slate-300"
                                  >
                                    +
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => confirmQuantity(product.id)}
                                    className={`ml-1 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow ${confirmed[product.id] ? "bg-orange-600" : "bg-orange-500 hover:bg-orange-600"}`}
                                  >
                                    ✓
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => addToCart(product.id)}
                                  disabled={!product.is_stock_available || product.stock_average <= 0}
                                  className="ml-auto flex h-9 items-center justify-center rounded-full bg-orange-500 px-4 text-sm font-semibold text-white shadow transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                                >
                                  {product.is_stock_available && product.stock_average > 0 ? "Agregar" : "Agotado"}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div className="text-sm text-slate-500">
                          Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} de {filteredProducts.length} productos
                        </div>
                        <div className="flex w-full items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 md:h-auto md:w-auto md:gap-1 md:rounded-lg md:px-4 md:py-2"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="hidden md:inline">Anterior</span>
                          </button>
                          <div className="flex max-w-[200px] items-center gap-1 overflow-x-auto px-1 md:max-w-none">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }

                              return (
                                <button
                                  key={pageNum}
                                  type="button"
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`h-10 w-10 flex-shrink-0 rounded-lg text-sm font-medium transition ${currentPage === pageNum ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                                >
                                  {pageNum}
                                </button>
                              );
                            })}
                          </div>
                          <button
                            type="button"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 md:h-auto md:w-auto md:gap-1 md:rounded-lg md:px-4 md:py-2"
                          >
                            <span className="hidden md:inline">Siguiente</span>
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </section>
            </>
          ) : (
            <div className="rounded-[28px] border border-yellow-200 bg-yellow-100/80 p-6 text-sm text-yellow-900 shadow-lg">
              No encontramos el negocio solicitado.
            </div>
          )}

          <section className="flex flex-col gap-5 rounded-[28px] bg-orange-600 px-6 py-7 text-white shadow-2xl shadow-orange-900/20 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
            <div>
              <h2 className="text-2xl font-extrabold leading-tight">
                ¿Necesitas ayuda?
              </h2>
              <p className="mt-2 text-base text-white/85">
                Nuestro equipo está listo para asistirte
              </p>
            </div>
            <Link
              href="mailto:soporte@gogieats.com"
              className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-extrabold text-orange-600 shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-50 sm:w-auto sm:min-w-64"
            >
              Contactar soporte
              <ChevronRight className="h-5 w-5" />
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
}

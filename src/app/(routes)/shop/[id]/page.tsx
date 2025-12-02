"use client";

import { ArrowLeft, Loader2, MapPin, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

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

  useEffect(() => {
    if (Number.isNaN(businessId)) {
      setError("Negocio no válido.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/shop/business/${businessId}`);
        if (!res.ok) throw new Error("No pudimos cargar el negocio.");
        const data = await res.json();

        setBusiness(data.business ?? null);
        setProducts(data.products ?? []);

      } catch (err) {
        console.error(err);
        setError("No pudimos cargar el menú del negocio.");
      } finally {
        setLoading(false);
      }
    })();
  }, [businessId]);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="min-h-screen bg-[url('/fondo-bosque.jpg')] bg-cover bg-center bg-fixed">
      <div className="min-h-screen bg-gradient-to-b from-[#0b1d12]/45 via-[#0b1d12]/25 to-transparent backdrop-blur-[1px]">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Regresar
          </Link>

          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-[28px] border border-white/70 bg-white/90 p-6 text-slate-400 shadow-lg">
              <Loader2 className="h-6 w-6 animate-spin" />
              Cargando menú…
            </div>
          ) : error ? (
            <div className="rounded-[28px] border border-red-100 bg-red-50/70 p-6 text-sm text-red-600 shadow-md">
              {error}
            </div>
          ) : business ? (
            <>
              {/* Header con imagen y detalles del negocio */}
              <section className="relative h-64 overflow-hidden rounded-[32px] border border-white/60 shadow-2xl sm:h-80">
                <Image
                  src={`/thumbnails/shop/${business.id}.png` || '/fondo-bosque.jpg'}
                  alt={business.name}
                  fill
                  className="object-cover"
                  priority
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center sm:p-8">
                  <div className="w-full max-w-2xl">
                    <div className="mb-6 rounded-xl bg-black/40 p-4 backdrop-blur-sm">
                      <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
                        {business.name}
                      </h1>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-4 py-2 font-semibold text-white/95 backdrop-blur-sm">
                        <MapPin className="h-4 w-4" />
                        {business.city ?? "Ubicación no disponible"}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-black/50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/95 backdrop-blur-sm">
                        {business?.category_name ?? "Especialidad"}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Barra de búsqueda y pestañas */}
              <section className="rounded-[28px] border border-white/70 bg-white/95 p-6 shadow-lg">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[250px]">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
                    <input
                      type="search"
                      placeholder="Buscar productos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                </div>
                {/* <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                  {NAV_TABS.map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                        activeTab === tab.key
                          ? "bg-gradient-to-r from-[#dce6d4] to-[#c8d6bf] text-[#2f5b38] shadow-sm ring-1 ring-[#bfd0b4]"
                          : "bg-slate-50 text-slate-500"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div> */}
              </section>

              {/* Pestañas de categorías */}
              {categories.length > 1 && (
                <section className="rounded-[28px] border border-white/70 bg-white/95 p-4 shadow-lg">
                  <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setActiveCategory(category.id)}
                        className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                          activeCategory === category.id
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {category.name}
                        <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                          activeCategory === category.id
                            ? "bg-white/20"
                            : "bg-slate-300"
                        }`}>
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Contenido principal - Productos */}
              <section className="rounded-[28px] border border-white/70 bg-white/95 p-6 text-sm text-slate-500 shadow-lg">
                {paginatedProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 rounded-[28px] border border-yellow-100 bg-yellow-50/70 p-8 text-center">
                    <div className="text-lg font-medium text-yellow-700">
                      {searchQuery ? "No se encontraron productos con esa búsqueda." : "No hay productos disponibles en esta categoría."}
                    </div>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-200"
                      >
                        Limpiar búsqueda
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Grid de productos */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {paginatedProducts.map((product) => (
                        <div 
                          key={product.id} 
                          className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
                        >
                          {/* Imagen del producto */}
                          <div className="relative h-40 w-full overflow-hidden rounded-xl bg-slate-100">
                            <Image
                              src={product.thumbnail_url || "/items/thumbnails/generic-item.png"}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                            {product.discount_price && (
                              <div className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                                OFERTA
                              </div>
                            )}
                          </div>
                          
                          {/* Información del producto */}
                          <div className="flex w-full flex-col gap-2">
                            <h3 className="text-center text-sm font-semibold text-slate-800 line-clamp-2">
                              {product.name}
                            </h3>
                            
                            {product.category_name && (
                              <span className="self-center rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                                {product.category_name}
                              </span>
                            )}
                            
                            {/* Precio */}
                            <div className="flex items-center justify-center gap-2">
                              {product.discount_price ? (
                                <>
                                  <span className="text-lg font-bold text-emerald-600">
                                    ${product.discount_price.toFixed(2)}
                                  </span>
                                  <span className="text-sm text-slate-400 line-through">
                                    ${product.price.toFixed(2)}
                                  </span>
                                </>
                              ) : (
                                <span className="text-lg font-bold text-slate-800">
                                  ${product.price.toFixed(2)}
                                </span>
                              )}
                            </div>
                            
                            {/* Stock */}
                            <div className={`text-xs font-medium ${
                              product.is_stock_available 
                                ? product.stock_average > product.stock_danger 
                                  ? "text-emerald-600" 
                                  : "text-amber-600"
                                : "text-red-600"
                            }`}>
                              {product.is_stock_available 
                                ? `Disponible: ${product.stock_average} unidades`
                                : "Agotado"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Paginación */}
                    {totalPages > 1 && (
                      <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div className="text-sm text-slate-500">
                          Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} de {filteredProducts.length} productos
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Anterior
                          </button>
                          
                          <div className="flex items-center gap-1">
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
                                  className={`h-10 w-10 rounded-lg text-sm font-medium transition ${
                                    currentPage === pageNum
                                      ? "bg-emerald-500 text-white"
                                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                  }`}
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
                            className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Siguiente
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
            <div className="rounded-[28px] border border-yellow-100 bg-yellow-50/70 p-6 text-sm text-yellow-700 shadow-md">
              No encontramos el negocio solicitado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
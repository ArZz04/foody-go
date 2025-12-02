"use client";

import { ArrowLeft, Loader2, MapPin, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Business = {
  id: number | string;
  name: string;
  city?: string;
  category?: string;
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
};

const NAV_TABS = [
  { key: "promos", label: "Promociones" },
  { key: "favoritos", label: "Favoritos" },
  { key: "recomendados", label: "Recomendados" },
] as const;

export default function BusinessDetailPage() {
  const params = useParams<{ id: string }>();
  const businessId = Number(params?.id ?? NaN);
  const [business, setBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<(typeof NAV_TABS)[number]["key"]>("promos");

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
                
                {/* Overlay para oscurecer la imagen inferior y mejorar legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                
                {/* Contenido sobre la imagen */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center sm:p-8">
                  <div className="w-full max-w-2xl">
                    {/* Texto con fondo semitransparente para mejor contraste */}
                    <div className="mb-4">
                      <p className="text-xs uppercase tracking-[0.4em] text-white/90">
                        {/* Aquí puedes agregar texto adicional si es necesario */}
                      </p>
                    </div>
                    
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
                        {business.category ?? "Especialidad"}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Barra de búsqueda y pestañas */}
              <section className="rounded-[28px] border border-white/70 bg-white/95 p-6 shadow-lg">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
                    <input
                      type="search"
                      placeholder="Buscar productos"
                      className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  {NAV_TABS.map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        activeTab === tab.key
                          ? "bg-gradient-to-r from-[#dce6d4] to-[#c8d6bf] text-[#2f5b38] shadow-sm ring-1 ring-[#bfd0b4]"
                          : "bg-slate-50 text-slate-500"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </section>

              {/* Contenido principal */}
              <section className="rounded-[28px] border border-white/70 bg-white/95 p-6 text-sm text-slate-500 shadow-lg">
                {products.length === 0 ? (
                  <div className="rounded-[28px] border border-yellow-100 bg-yellow-50/70 p-6 text-sm text-yellow-700 shadow-md">
                    No hay productos disponibles en este momento.
                  </div>) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {products.map((product) => (
                      <div key={product.id} className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 p-4 shadow-sm">
                        <div className="relative h-24 w-24 overflow-hidden rounded-md bg-slate-100">
                          <Image
                            src={product.thumbnail_url || "/items/thumbnails/generic-item.png"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h3 className="text-center text-sm font-medium text-slate-700">
                          {product.name}
                        </h3>
                      </div>
                    ))}
                  </div>
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
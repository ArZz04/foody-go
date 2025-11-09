"use client";

import { Store } from "lucide-react";
import { useEffect, useState } from "react";

import BusinessCard from "./components/BusinessCard";
import FilterBar from "./components/FilterBar";

type Negocio = {
  id: number | string;
  nombre: string;
  ciudad?: string;
  giro?: string;
};

type Producto = {
  id: number | string;
  categoria?: string;
  giro?: string;
};

type NegociosResponse = {
  negocios?: Negocio[];
  productos?: Producto[];
};

const isString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const uniqueStrings = (values: Array<string | undefined>) =>
  Array.from(new Set(values.filter(isString)));

const PLACEHOLDER_IDS = Array.from({ length: 8 }, (_, i) => `placeholder-${i}`);

const BADGE_POOL = ["Promo", "Top", "Nuevo", "Local"];

export default function ShopPage() {
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filtroGiro, setFiltroGiro] = useState("Todos");
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [filtered, setFiltered] = useState<Negocio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/prueba/negocios");
        const data = (await res.json()) as NegociosResponse;
        setNegocios(data.negocios ?? []);
        setProductos(data.productos ?? []);
        setFiltered(data.negocios ?? []);
      } catch (err) {
        console.error("Error al obtener datos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    let result = negocios;

    if (filtroGiro !== "Todos") {
      result = result.filter((n) => n.giro === filtroGiro);
    }

    if (filtroCategoria !== "Todos" && filtroGiro !== "Todos") {
      const prods = productos.filter(
        (p) => p.giro === filtroGiro && p.categoria === filtroCategoria,
      );
      const girosPermitidos = new Set(prods.map((p) => p.giro));
      result = result.filter((n) => girosPermitidos.has(n.giro));
    }

    setFiltered(result);
  }, [filtroGiro, filtroCategoria, negocios, productos]);

  const giros = ["Todos", ...uniqueStrings(negocios.map((n) => n.giro))];
  const categorias =
    filtroGiro === "Todos"
      ? []
      : [
          "Todos",
          ...uniqueStrings(
            productos
              .filter((p) => p.giro === filtroGiro)
              .map((p) => p.categoria),
          ),
        ];

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6">
        <section className="rounded-[40px] border border-white/50 bg-white/60 p-6 shadow-[0_25px_80px_rgba(59,47,47,0.08)] backdrop-blur-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#bca181]">
                Explora
              </p>
              <h2 className="font-['Playfair_Display'] text-3xl font-semibold text-[#3b2f2f]">
                Todos los aliados
              </h2>
              <p className="text-sm text-[#6d5b4f]">
                Productos rurales curados con cariño local.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 rounded-[30px] border border-white/70 bg-white/75 px-4 py-2 text-xs text-[#6d5b4f] shadow-inner backdrop-blur">
              {giros.slice(1, 5).map((giroName) => (
                <span
                  key={giroName}
                  className="rounded-full bg-[#f9f2e9] px-3 py-1 font-semibold"
                >
                  {giroName}
                </span>
              ))}
            </div>
          </div>
        </section>

        <FilterBar
          items={giros}
          selected={filtroGiro}
          onSelect={(g) => {
            setFiltroGiro(g);
            setFiltroCategoria("Todos");
          }}
        />

        {filtroGiro !== "Todos" ? (
          <FilterBar
            items={categorias}
            selected={filtroCategoria}
            onSelect={setFiltroCategoria}
            title="Categorías"
            icon={<Store className="h-4 w-4 text-emerald-500" />}
          />
        ) : null}

        <section className="rounded-[32px] border border-white/60 bg-white/90 p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Locales cerca
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                {filtroGiro === "Todos"
                  ? "Todos los aliados"
                  : `Giro: ${filtroGiro}`}
              </h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              {filtered.length} abiertos
            </span>
          </div>
          {loading ? (
            <div className="mt-5 grid animate-pulse grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {PLACEHOLDER_IDS.map((placeholder) => (
                <div
                  key={placeholder}
                  className="h-44 rounded-3xl bg-slate-100"
                />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {filtered.map((negocio, index) => (
                <BusinessCard
                  key={`${negocio.id ?? "negocio"}-${index}`}
                  nombre={negocio.nombre}
                  ciudad={negocio.ciudad}
                  giro={negocio.giro}
                  rating={Math.random() * 0.8 + 4.2}
                  etaMinutes={18 + ((index + 3) % 20)}
                  deliveryFee={index % 3 === 0 ? 0 : 1.9 + (index % 4)}
                  badge={BADGE_POOL[index % BADGE_POOL.length]}
                  href={`/shop/${negocio.id ?? index}`}
                />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-center text-gray-500">
              No hay negocios disponibles.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

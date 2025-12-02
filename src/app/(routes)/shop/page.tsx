"use client";

import { Store } from "lucide-react";
import { useEffect, useState } from "react";

import BusinessCard from "./components/BusinessCard";
import FilterBar from "./components/FilterBar";

type Business = {
  id: number | string;
  name: string;
  city?: string;
  category?: string; 
};

type Producto = {
  id: number | string;
  categoria?: string;
  giro?: string;
};

type BusinessResponse = {
  negocios?: Business[];
  productos?: Producto[];
};

const isString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const uniqueStrings = (values: Array<string | undefined>) =>
  Array.from(new Set(values.filter(isString)));

const PLACEHOLDER_IDS = Array.from({ length: 8 }, (_, i) => `placeholder-${i}`);

const BADGE_POOL = ["Promo", "Top", "Nuevo", "Local"];

const HERO_PHRASES = [
  "Hecho con amor local ❤️",
  "Sabores que cuentan historias 🍞",
  "Cada aliado, una historia por descubrir 🌾",
];

const CTA_LINES = [
  "Explora tu zona 🍃",
  "Apoya negocios de tu comunidad 🤝",
  "Descubre algo nuevo hoy ✨",
];

const CATEGORY_THEMES: Record<
  string,
  { emoji: string; title: string; gradient: string }
> = {
  Cafetería: {
    emoji: "☕",
    title: "Tu café de confianza",
    gradient: "from-[#f8f0e3] via-[#fbeee8] to-[#f9e7da]",
  },
  Panadería: {
    emoji: "🥐",
    title: "Pan recién salido del horno",
    gradient: "from-[#f9f1e2] via-[#f4e7d6] to-[#f1e0ce]",
  },
  Taquería: {
    emoji: "🌮",
    title: "Tortillas calientes & salsas",
    gradient: "from-[#fcefe4] via-[#f9e6d6] to-[#f5dcc8]",
  },
  default: {
    emoji: "🌾",
    title: "Rutas gourmet del campo",
    gradient: "from-[#f8f5f0] via-[#f3ece4] to-[#efe9e2]",
  },
};

export default function ShopPage() {
  const [business, setBusiness] = useState<Business[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filtroGiro, setFiltroGiro] = useState("Todos");
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [filtered, setFiltered] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [ctaIndex, setCtaIndex] = useState(0);

useEffect(() => {
  async function fetchData() {
    try {
      const res = await fetch("/api/shop/business");
      const data = await res.json();

      const businesses: Business[] = (data.negocios ?? []).map((n: any) => ({
        id: n.id,
        name: n.name ?? n.nombre,
        city: n.city ?? n.ciudad,
        category:
          n.category ??
          n.category_name ??
          n.giro ??
          n.business_category_name,
      }));

      setBusiness(businesses);
      setFiltered(businesses);

    } catch (err) {
      console.error("Error al obtener datos:", err);
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, []);

  useEffect(() => {
    let result = business;

    if (filtroGiro !== "Todos") {
      result = result.filter((n) => n.category === filtroGiro);
    }

    if (filtroCategoria !== "Todos" && filtroGiro !== "Todos") {
      const prods = productos.filter(
        (p) => p.giro === filtroGiro && p.categoria === filtroCategoria,
      );
      const girosPermitidos = new Set(prods.map((p) => p.giro));
      result = result.filter((n) => girosPermitidos.has(n.category));
    }

    setFiltered(result);
  }, [filtroGiro, filtroCategoria, business, productos]);

  useEffect(() => {
    const id = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % HERO_PHRASES.length);
      setCtaIndex((prev) => (prev + 1) % CTA_LINES.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  const giros = ["Todos", ...uniqueStrings(business.map((n) => n.category))];
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

  const openCount = filtered.length || business.length;
  const visitedProgress = Math.min(
    openCount,
    Math.max(3, Math.round(openCount / 4)),
  );
  const theme =
    CATEGORY_THEMES[filtroGiro as keyof typeof CATEGORY_THEMES] ??
    CATEGORY_THEMES.default;

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6">
        <section
          className={`rounded-[40px] border border-white/50 bg-gradient-to-br ${theme.gradient} p-6 shadow-[0_25px_80px_rgba(59,47,40,0.12)] backdrop-blur`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#bca181]">
                {theme.emoji} Aliadoss
              </p>
              <h2 className="font-serif text-4xl font-semibold text-[#3b2f28]">
                {theme.title}
              </h2>
              <p
                key={phraseIndex}
                className="font-sans text-sm text-[#57534e] transition duration-500"
              >
                {HERO_PHRASES[phraseIndex]}
              </p>
            </div>
            <div className="rounded-[30px] border border-white/70 bg-white/75 px-5 py-3 text-sm text-[#6d5b4f] shadow-inner backdrop-blur">
              {CTA_LINES[ctaIndex]}
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[26px] border border-white/60 bg-white/70 p-4 text-sm text-[#5c4c43] shadow-inner">
              <p className="text-xs uppercase tracking-[0.35em] text-[#c9a46a]">
                Comunidad
              </p>
              <p className="text-2xl font-semibold text-[#3b2f28]">
                {openCount} abiertos hoy 🌞
              </p>
              <p className="text-xs text-[#7c6a5c]">Apoya negocios cercanos</p>
            </div>
            <div className="rounded-[26px] border border-white/60 bg-white/70 p-4 shadow-inner">
              <p className="text-xs uppercase tracking-[0.35em] text-[#c9a46a]">
                Tu recorrido
              </p>
              <div className="mt-2 flex items-center justify-between text-sm text-[#5c4c43]">
                <span>
                  Has visitado {visitedProgress} de {openCount} aliados
                </span>
                <span className="text-[#6d8b74]">👣</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-[#eadfce]/70">
                <div
                  className="h-full rounded-full bg-[#6d8b74] transition"
                  style={{
                    width: `${Math.min(100, (visitedProgress / (openCount || 1)) * 100)}%`,
                  }}
                />
              </div>
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
          ) : filtered.length > 0 ?  (
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {filtered.map((business, index) => (
                <BusinessCard
                  key={`${business.id ?? "business"}-${index}`}
                  id={business.id ?? index}
                  name={business.name}
                  city={business.city}
                  category={business.category}
                  rating={Math.random() * 0.8 + 4.2}
                  etaMinutes={18 + ((index + 3) % 20)}
                  deliveryFee={index % 3 === 0 ? 0 : 1.9 + (index % 4)}
                  badge={BADGE_POOL[index % BADGE_POOL.length]}
                  href={`/shop/${business.id ?? index}`}
                />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-center text-gray-500">
              No hay negocios disponibles.
            </p>
          )}
        </section>

        <section className="rounded-[36px] border border-[#eadfce] bg-[#f8f5f0] p-6 text-center font-sans text-[#5c4c43] shadow-inner">
          <p className="text-xs uppercase tracking-[0.4em] text-[#c9a46a]">
            Comunidad Foody Go
          </p>
          <h3 className="mt-2 font-serif text-2xl text-[#3b2f28]">
            {CTA_LINES[ctaIndex]}
          </h3>
          <p className="mt-1 text-sm">
            Cada aliado es un taller de historias; haz clic en uno y descubre
            qué están cocinando hoy.
          </p>
        </section>
      </div>
    </div>
  );
}

"use client";

import {
  ArrowLeft,
  Heart,
  Loader2,
  MapPin,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Star,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Negocio = {
  id: number | string;
  nombre: string;
  ciudad?: string;
  giro?: string;
};

type Producto = {
  id: number | string;
  nombre: string;
  categoria?: string;
  precio?: number;
  giro?: string;
};

type NegociosResponse = {
  negocios?: Negocio[];
  productos?: Producto[];
};

type PromotionCard = {
  id: string;
  nombre: string;
  image: string;
  price: number;
  original?: number;
  discountLabel: string;
};

type CartItem = {
  id: string;
  nombre: string;
  extras: string[];
  quantity: number;
  total: number;
};

const PRODUCT_IMAGES: Record<string, string> = {
  Cafetería: "/coffe.png",
  Taquería: "/repartidor.jpg",
  Panadería: "/vendedor.jpg",
  Heladería: "/repartidor-2.jpg",
};

type ComplementOption = { id: string; label: string; price: number };

const COMPLEMENT_OPTIONS: Record<string, ComplementOption[]> = {
  "Bebidas Calientes": [
    { id: "extra-shot", label: "Shot extra de espresso", price: 12 },
    { id: "leche-almendra", label: "Leche de almendra", price: 10 },
    { id: "sabor-vainilla", label: "Jarabe de vainilla", price: 8 },
  ],
  "Bebidas Frías": [
    { id: "topping-crema", label: "Extra crema batida", price: 9 },
    { id: "sin-azucar", label: "Sin azúcar (+stevia)", price: 5 },
  ],
  Postres: [
    { id: "salsa-chocolate", label: "Salsa de chocolate", price: 6 },
    { id: "helado-vainilla", label: "Bola de helado", price: 15 },
  ],
};

const NAV_TABS = [
  { key: "promos", label: "Promociones" },
  { key: "favoritos", label: "Favoritos" },
  { key: "recomendados", label: "Recomendados" },
] as const;

const SALSA_OPTIONS = [
  { id: "pico", label: "Pico de gallo", heat: "Suave" },
  { id: "verde", label: "Salsa verde tatemada", heat: "Media" },
  { id: "nopal", label: "Salsa de nopal con aguacate", heat: "Fresca" },
  { id: "arbol", label: "Chile de árbol", heat: "Picante" },
  { id: "cebolla", label: "Cebolla y habanero encurtido", heat: "Fuego" },
] as const;

export default function BusinessDetailPage() {
  const params = useParams<{ id: string }>();
  const negocioId = Number(params?.id ?? NaN);
  const [negocio, setNegocio] = useState<Negocio | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<Record<string, boolean>>(
    {},
  );
  const [selectedSalsas, setSelectedSalsas] = useState<Record<string, boolean>>(
    {},
  );
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "promos" | "favoritos" | "recomendados"
  >("promos");

  useEffect(() => {
    if (Number.isNaN(negocioId)) {
      setError("Negocio no válido.");
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/prueba/negocios");
        const data = (await res.json()) as NegociosResponse;
        const found =
          data.negocios?.find((item) => Number(item.id) === negocioId) ?? null;
        setNegocio(found);
        setProductos(data.productos ?? []);
      } catch (err) {
        console.error(err);
        setError("No pudimos cargar el menú del negocio.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [negocioId]);

  const menu = useMemo(() => {
    if (!negocio) return [];
    return productos.filter((producto) => producto.giro === negocio.giro);
  }, [negocio, productos]);

  const promotions: PromotionCard[] = useMemo(() => {
    return menu.slice(0, 4).map((item, index) => {
      const discountRate = 0.15 + (index % 3) * 0.05;
      const original = item.precio ?? 0;
      const discounted = original * (1 - discountRate);
      const image =
        PRODUCT_IMAGES[item.categoria ?? item.giro ?? ""] ?? "/coffe.png";
      return {
        id: `${item.id}-promo`,
        nombre: item.nombre,
        image,
        price: Number(discounted.toFixed(2)),
        original: original || undefined,
        discountLabel: `${Math.round(discountRate * 100)}% OFF`,
      };
    });
  }, [menu]);

  const sections = useMemo(() => {
    const grouped = new Map<string, Producto[]>();
    menu.forEach((item) => {
      const key = item.categoria ?? "Especialidades";
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)?.push(item);
    });
    return Array.from(grouped.entries());
  }, [menu]);

  const openProduct = (item: Producto) => {
    setSelectedProduct(item);
    setSelectedExtras({});
    setSelectedSalsas({});
    setQuantity(1);
    setFeedback(null);
  };

  const currentComplements =
    COMPLEMENT_OPTIONS[
      selectedProduct?.categoria ?? selectedProduct?.giro ?? ""
    ] ?? [];

  const isTacoProduct =
    selectedProduct?.giro?.toLowerCase() === "taquería" ||
    (selectedProduct?.categoria?.toLowerCase().includes("taco") ?? false);

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalExtras = currentComplements
    .filter((extra) => selectedExtras[extra.id])
    .reduce((sum, extra) => sum + extra.price, 0);

  const basePrice = selectedProduct?.precio ?? 0;
  const totalPrice = (basePrice + totalExtras) * quantity;

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    const extrasChosen = currentComplements
      .filter((extra) => selectedExtras[extra.id])
      .map((extra) => extra.label);
    const salsaChosen =
      selectedProduct && isTacoProduct
        ? SALSA_OPTIONS.filter((salsa) => selectedSalsas[salsa.id]).map(
            (salsa) => `Salsa: ${salsa.label}`,
          )
        : [];

    setCart((prev) => [
      ...prev,
      {
        id: `${selectedProduct.id}-${Date.now()}`,
        nombre: selectedProduct.nombre,
        extras: [...extrasChosen, ...salsaChosen],
        quantity,
        total: totalPrice,
      },
    ]);
    setCartOpen(true);
    setFeedback("Producto agregado al carrito.");
    setTimeout(() => {
      setSelectedProduct(null);
      setFeedback(null);
    }, 1200);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);

  const addPromotionDirect = (product: Producto, promoPrice: number) => {
    setCart((prev) => [
      ...prev,
      {
        id: `${product.id}-promo-${Date.now()}`,
        nombre: `${product.nombre} (Promo)`,
        extras: [],
        quantity: 1,
        total: promoPrice,
      },
    ]);
    setCartOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-[#f5f7fb]">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Regresar
          </Link>

          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-[32px] border border-white/60 bg-white/90 p-6 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin" />
              Cargando menú…
            </div>
          ) : error ? (
            <div className="rounded-[32px] border border-red-100 bg-red-50/60 p-6 text-sm text-red-600">
              {error}
            </div>
          ) : negocio ? (
            <>
              <section className="rounded-[32px] border border-white/60 bg-white/90 p-6 shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                    <input
                      type="search"
                      placeholder="Buscar productos"
                      className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-600 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-100 p-3 text-slate-500 transition hover:border-emerald-200 hover:text-emerald-600"
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4 flex gap-2">
                  {NAV_TABS.map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        activeTab === tab.key
                          ? "bg-orange-100 text-orange-600"
                          : "bg-slate-50 text-slate-500"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                {activeTab === "promos" ? (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {promotions.map((promoRaw) => {
                      const product = menu.find(
                        (item) => item.nombre === promoRaw.nombre,
                      );
                      const promo =
                        product ??
                        ({
                          id: promoRaw.id,
                          nombre: promoRaw.nombre,
                          categoria: undefined,
                          precio: promoRaw.price,
                          giro: negocio?.giro,
                        } satisfies Producto);
                      return (
                        <div
                          key={promoRaw.id}
                          className="flex items-center gap-4 rounded-3xl border border-orange-100 bg-orange-50/60 p-4"
                        >
                          <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-white/70 bg-white">
                            <Image
                              src={promoRaw.image}
                              alt={promoRaw.nombre}
                              fill
                              sizes="96px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 text-sm text-slate-600">
                            <p className="font-semibold text-slate-900">
                              {promoRaw.nombre}
                            </p>
                            {promoRaw.original ? (
                              <p className="text-xs text-slate-400 line-through">
                                ${promoRaw.original.toFixed(2)}
                              </p>
                            ) : null}
                            <p className="text-lg font-semibold text-orange-600">
                              ${promoRaw.price.toFixed(2)}
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-orange-500">
                                {promoRaw.discountLabel}
                              </span>
                              <button
                                type="button"
                                className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-orange-600"
                                onClick={() =>
                                  addPromotionDirect(promo, promoRaw.price)
                                }
                              >
                                Agregars
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-5 text-sm text-slate-400">
                    Esta categoría se activará cuando el negocio agregue
                    productos destacados.
                  </p>
                )}
              </section>

              <header className="rounded-[32px] border border-white/60 bg-white/90 p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Menú
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                  {negocio.nombre}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-emerald-500" />
                    {negocio.ciudad ?? "Ubicación no disponible"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                    {negocio.giro ?? "Especialidad"}
                  </span>
                </div>
              </header>

              {sections.length === 0 ? (
                <p className="rounded-[32px] border border-white/60 bg-white/90 p-6 text-sm text-slate-500">
                  Aún no hay productos asociados a este giro.
                </p>
              ) : (
                sections.map(([category, items]) => (
                  <section
                    key={category}
                    className="rounded-[32px] border border-white/60 bg-white/90 p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                          Sección
                        </p>
                        <h2 className="text-xl font-semibold text-slate-900">
                          {category}
                        </h2>
                      </div>
                      <span className="text-xs text-slate-400">
                        {items.length} artículos
                      </span>
                    </div>

                    <ul className="mt-6 space-y-3">
                      {items.map((item) => {
                        const imageSrc =
                          PRODUCT_IMAGES[item.categoria ?? item.giro ?? ""] ??
                          "/coffe.png";
                        return (
                          <li key={item.id}>
                            <button
                              type="button"
                              onClick={() => openProduct(item)}
                              className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3 text-left text-sm text-slate-700 transition hover:border-emerald-200 hover:bg-white"
                            >
                              <div className="flex w-full items-center gap-4">
                                <div className="flex-1">
                                  <p className="font-semibold text-slate-900">
                                    {item.nombre}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {item.categoria ?? "General"}
                                  </p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="text-right">
                                    <span className="text-base font-semibold text-slate-900">
                                      {item.precio
                                        ? `$${item.precio.toFixed(2)}`
                                        : "—"}
                                    </span>
                                    <div className="mt-1 inline-flex items-center gap-1 text-xs text-amber-500">
                                      <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                                      Popular
                                    </div>
                                  </div>
                                  <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-slate-100">
                                    <Image
                                      src={imageSrc}
                                      alt={item.nombre}
                                      fill
                                      sizes="56px"
                                      className="object-cover"
                                    />
                                  </div>
                                </div>
                              </div>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))
              )}
            </>
          ) : (
            <div className="rounded-[32px] border border-yellow-100 bg-yellow-50/70 p-6 text-sm text-yellow-700">
              No encontramos el negocio solicitado.
            </div>
          )}
        </div>
      </div>

      {selectedProduct ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[32px] border border-white/50 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Selecciona
                </p>
                <h3 className="text-2xl font-semibold text-slate-900">
                  {selectedProduct.nombre}
                </h3>
                <p className="text-sm text-slate-500">
                  {selectedProduct.categoria ?? "Especialidad"}
                </p>
              </div>
              <button
                type="button"
                className="text-sm text-slate-500 transition hover:text-slate-900"
                onClick={() => setSelectedProduct(null)}
              >
                Cerrar ✕
              </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100">
              <Image
                src={
                  PRODUCT_IMAGES[
                    selectedProduct.categoria ?? selectedProduct.giro ?? ""
                  ] ?? "/coffe.png"
                }
                alt={selectedProduct.nombre}
                width={640}
                height={260}
                className="h-44 w-full object-cover"
              />
            </div>

            {currentComplements.length > 0 ? (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-semibold text-slate-900">
                  Complementos
                </p>
                {currentComplements.map((extra) => (
                  <label
                    key={extra.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 px-3 py-2 text-sm text-slate-600"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={Boolean(selectedExtras[extra.id])}
                        onChange={() => toggleExtra(extra.id)}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400"
                      />
                      {extra.label}
                    </div>
                    <span className="font-semibold text-slate-900">
                      +${extra.price.toFixed(2)}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                Este producto no requiere complementos especiales.
              </p>
            )}

            {isTacoProduct ? (
              <div className="mt-4 space-y-2 rounded-2xl border border-orange-100 bg-orange-50/40 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-orange-600">
                    Salsas frescas
                  </p>
                  <span className="text-xs text-orange-400">
                    Máx. 3 por pedido
                  </span>
                </div>
                {SALSA_OPTIONS.map((salsa) => (
                  <label
                    key={salsa.id}
                    className="flex items-center justify-between rounded-2xl bg-white/70 px-3 py-2 text-sm text-orange-700"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={Boolean(selectedSalsas[salsa.id])}
                        onChange={() =>
                          setSelectedSalsas((prev) => ({
                            ...prev,
                            [salsa.id]: !prev[salsa.id],
                          }))
                        }
                        className="h-4 w-4 rounded border-orange-200 text-orange-500 focus:ring-orange-300"
                      />
                      {salsa.label}
                    </div>
                    <span className="text-xs text-orange-400">
                      {salsa.heat}
                    </span>
                  </label>
                ))}
              </div>
            ) : null}

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-2">
              <span className="text-sm font-semibold text-slate-700">
                Cantidad
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="rounded-full border border-slate-200 p-2 text-slate-600 disabled:opacity-40"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity === 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-base font-semibold">{quantity}</span>
                <button
                  type="button"
                  className="rounded-full border border-slate-200 p-2 text-slate-600"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              type="button"
              className="mt-4 w-full rounded-2xl bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
              onClick={handleAddToCart}
            >
              Agregar al carrito · ${totalPrice.toFixed(2)}
            </button>
            {feedback ? (
              <p className="mt-2 text-center text-sm text-emerald-600">
                {feedback}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {cart.length > 0 ? (
        <>
          <button
            type="button"
            className="fixed bottom-6 right-6 z-30 flex items-center gap-3 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-2xl transition hover:translate-y-[-2px] sm:hidden"
            onClick={() => setCartOpen((open) => !open)}
          >
            <ShoppingBag className="h-4 w-4" />
            {cart.length} en carrito · ${cartTotal.toFixed(2)}
          </button>
          <div
            className={`fixed bottom-0 left-0 right-0 z-30 border-t border-white/60 bg-white/95 px-4 py-3 shadow-2xl transition md:hidden ${cartOpen ? "translate-y-0" : "translate-y-[calc(100%_-_48px)]"}`}
          >
            <button
              type="button"
              className="flex w-full items-center justify-between"
              onClick={() => setCartOpen((open) => !open)}
            >
              <span className="text-sm font-semibold text-slate-900">
                Carrito ({cart.length}) · ${cartTotal.toFixed(2)}
              </span>
              <ShoppingBag className="h-4 w-4 text-slate-500" />
            </button>
            {cartOpen ? (
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start justify-between rounded-2xl bg-slate-50 px-3 py-2"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {item.nombre}
                      </p>
                      {item.extras.length > 0 ? (
                        <p className="text-xs text-slate-500">
                          + {item.extras.join(", ")}
                        </p>
                      ) : null}
                      <p className="text-xs text-slate-500">
                        Cantidad {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">
                      ${item.total.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <aside
            className={`fixed right-6 top-6 hidden w-80 flex-col gap-3 rounded-3xl border border-white/70 bg-white/95 p-4 shadow-2xl md:flex ${cartOpen ? "opacity-100" : "opacity-60"}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">
                Carrito ({cart.length})
              </p>
              <button
                type="button"
                className="rounded-full border border-slate-200 p-1 text-slate-400"
                onClick={() => setCartOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="rounded-2xl bg-slate-50 px-3 py-2 shadow-inner"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900">
                      {item.nombre}
                    </p>
                    <span className="text-sm font-semibold text-slate-900">
                      ${item.total.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Cantidad {item.quantity}
                  </p>
                  {item.extras.length > 0 ? (
                    <p className="text-xs text-slate-400">
                      Extras: {item.extras.join(", ")}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="rounded-2xl bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Finalizar pedido · ${cartTotal.toFixed(2)}
            </button>
          </aside>
        </>
      ) : null}
    </>
  );
}

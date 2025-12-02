"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

type StoredCartItem = {
  id: string;
  nombre: string;
  negocio: string;
  ciudad?: string;
  image: string;
  extras: string[];
  tags?: string[];
  quantity: number;
  unitPrice?: number;
  price?: number;
};

const DEFAULT_DELIVERY_FEE = 39;
const SERVICE_FEE = 12;
const BASE_DELIVERY = 25;
const COST_PER_KM = 4.2;
const CART_STORAGE_KEY = "foody:cart";

export default function CarritoPage() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<StoredCartItem[]>([]);
  const [customerLocation, setCustomerLocation] = useState<  | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as StoredCartItem[];
        setCartItems(
          parsed.map((item) => {
            return item;
          }),
        );
      } catch (error) {
        console.error("No se pudo cargar el carrito", error);
      }
    }
  }, []);

  const persistCart = (items: StoredCartItem[]) => {
    setCartItems(items);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  };

  const handleQuantityChange = (id: string, delta: number) => {
    persistCart(
      cartItems
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemove = (id: string) => {
    persistCart(cartItems.filter((item) => item.id !== id));
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-white/90">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-20 text-center text-emerald-900">
          <div className="rounded-full bg-emerald-100/70 p-6 text-4xl">🛒</div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">Necesitas iniciar sesión</h1>
            <p className="text-sm text-emerald-800/80">
              Guarda tus pedidos favoritos y sigue tu carrito desde cualquier
              dispositivo.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              asChild
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <Link href="/auth?mode=login">Iniciar sesión</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-emerald-300 text-emerald-700"
            >
              <Link href="/auth?mode=register">Crear cuenta</Link>
            </Button>
          </div>
          <p className="text-xs text-emerald-800/60">
            ¿Buscas algo rico? Explora las{" "}
            <Link href="/shop" className="underline">
              tiendas disponibles
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-white/90">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-20 text-center text-emerald-900">
          <div className="rounded-full bg-emerald-50 p-6 text-4xl">🌾</div>
          <h1 className="text-3xl font-semibold">Tu carrito está vacío</h1>
          <p className="text-sm text-emerald-800/80">
            Explora las tiendas rurales y agrega tus antojos favoritos.
          </p>
          <Button
            asChild
            className="rounded-full bg-emerald-600 px-6 py-3 text-white hover:bg-emerald-700"
          >
            <Link href="/shop">Ver tiendas</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getItemPrice = (item: StoredCartItem) =>
    item.unitPrice ?? item.price ?? 0;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + getItemPrice(item) * item.quantity,
    0,
  );

  const deliveryFee = useMemo(() => {
    if (!customerLocation) {
      return DEFAULT_DELIVERY_FEE;
    }
    const distances = cartItems

    if (distances.length === 0) return DEFAULT_DELIVERY_FEE;
  }, [cartItems, customerLocation]);

  const total = subtotal + SERVICE_FEE;

  const handleDetectLocation = () => {
    if (!window?.navigator?.geolocation) {
      setLocationError("Tu dispositivo no permite obtener la ubicación.");
      return;
    }
    setLocating(true);
    setLocationError(null);
    window.navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
      },
      (err) => {
        setLocationError(
          err.message || "No pudimos obtener tu ubicación en este momento.",
        );
        setLocating(false);
      },
      { enableHighAccuracy: true },
    );
  };

  return (
    <div className="min-h-screen bg-white/80 text-emerald-950">
      <div className="container mx-auto grid gap-8 px-4 py-12 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-6">
          <header className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold">Tu carrito</h1>
            <p className="text-sm text-emerald-900/80">
              Revisa tu pedido antes de confirmar. Puedes ajustar cantidades o
              dejar instrucciones especiales para cada tienda.
            </p>
          </header>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-4 rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:shadow-md sm:flex-row"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:w-40">
                  <Image
                    src={item.image}
                    fill
                    alt={item.nombre}
                    className="object-cover"
                    sizes="(min-width: 1024px) 160px, (min-width: 640px) 200px, 100vw"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-emerald-950">
                        {item.nombre}
                      </h2>
                      <p className="text-sm text-emerald-900/70">
                        {item.negocio}
                      </p>
                      {item.extras.length > 0 ? (
                        <p className="text-xs text-emerald-900/60">
                          {item.extras.join(", ")}
                        </p>
                      ) : null}
                    </div>
                    <div className="text-right text-sm font-semibold text-emerald-900">
                      MX${(getItemPrice(item) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 px-3 py-1">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="text-emerald-600"
                        aria-label="Disminuir"
                      >
                        −
                      </button>
                      <span className="min-w-[2ch] text-center text-sm font-semibold text-emerald-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="text-emerald-600"
                        aria-label="Aumentar"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.tags?.map((tag) => (
                        <Badge
                          key={`${item.id}-${tag}`}
                          variant="secondary"
                          className="border border-emerald-200 bg-emerald-50 text-emerald-700"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <button
                      className="ml-auto text-xs font-semibold text-emerald-700 underline-offset-4 hover:underline"
                      onClick={() => handleRemove(item.id)}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/80 p-6">
            <h2 className="text-lg font-semibold text-emerald-900">
              Instrucciones para el repartidor
            </h2>
            <p className="mt-2 text-sm text-emerald-900/70">
              Agrega cualquier indicación adicional (por ejemplo: “dejar en
              recepción” o “tocar el timbre 2”).
            </p>
            <textarea
              placeholder="Escribe tus instrucciones..."
              className="mt-4 w-full rounded-2xl border border-emerald-200 bg-white/80 p-3 text-sm text-emerald-900 outline-none focus:border-emerald-400"
              rows={4}
            />
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-emerald-900">
              Resumen de pago
            </h2>
            <dl className="mt-4 space-y-3 text-sm text-emerald-900/80">
              <div className="flex items-center justify-between">
                <dt>Subtotal</dt>
                <dd>MX${subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Envío</dt>
                <dd>MX$200</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Servicio</dt>
                <dd>MX${SERVICE_FEE.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-dashed border-emerald-100 pt-3 text-base font-semibold text-emerald-950">
                <dt>Total</dt>
                <dd>MX${total.toFixed(2)}</dd>
              </div>
            </dl>
            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={locating}
                className="w-full rounded-2xl border border-emerald-200 bg-white py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {customerLocation
                  ? "Actualizar mi ubicación"
                  : "Calcular envío con mi ubicación"}
              </button>
              {locationError ? (
                <p className="text-xs text-rose-500">{locationError}</p>
              ) : null}
              {customerLocation ? (
                <p className="text-xs text-emerald-700">
                  Envío estimado según tu ubicación actual.
                </p>
              ) : (
                <p className="text-xs text-emerald-800/70">
                  Si compartes tu ubicación, ajustamos el costo de envío por distancia.
                </p>
              )}
            </div>
            <Button className="mt-6 w-full bg-emerald-600 text-white hover:bg-emerald-700">
              Confirmar y pagar
            </Button>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 text-sm text-emerald-900/80">
            <h3 className="text-sm font-semibold text-emerald-900">
              Beneficios de Foody Go
            </h3>
            <ul className="mt-3 space-y-2">
              <li>• Soporte 24/7 para cualquier pedido</li>
              <li>• Seguimiento en tiempo real</li>
              <li>• Pagos seguros protegidos</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

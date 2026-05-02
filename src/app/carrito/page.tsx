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

type CustomerLocation = {
  latitude: number;
  longitude: number;
};

const DEFAULT_DELIVERY_FEE = 39;
const SERVICE_FEE = 12;
const BASE_DELIVERY = 25;
const COST_PER_KM = 4.2;
const CART_STORAGE_KEY = "gogi:cart";

export default function CarritoPage() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<StoredCartItem[]>([]);
<<<<<<< Updated upstream
  const [customerLocation, setCustomerLocation] =
    useState<CustomerLocation | null>(null);
=======
  const [customerLocation, setCustomerLocation] = useState<{ lat: number; lng: number } | null>(null);
>>>>>>> Stashed changes
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [cartId, setCartId] = useState<number | null>(null);

  // Mover useMemo al principio, antes de cualquier return condicional
  const deliveryFee = useMemo(() => {
    if (!customerLocation) {
      return DEFAULT_DELIVERY_FEE;
    }
    return DEFAULT_DELIVERY_FEE;
  }, [customerLocation]);

  useEffect(() => {
    if (!user) return;

    async function loadCart() {
      if (!user) return;
      try {
        const uid = user.id;
        const res = await fetch(`/api/cart?user_id=${uid}`);
        const data = await res.json();

        if (!data.cart) {
          // Si no existe carrito, crear uno
          const createRes = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: uid })
          });

          const newCart = await createRes.json();
          setCartId(newCart.cart_id);
          setCartItems([]);
          return;
        }

        // carrito encontrado
        setCartId(data.cart.id);
        setCartItems(
          data.products.map((p: any) => ({
            id: p.product_id.toString(),
            nombre: p.name,
            image: p.thumbnail_url,
            negocio: "Negocio",
            quantity: p.quantity,
            unitPrice: p.price,
            price: p.total,
            extras: [],
          }))
        );
      } catch (err) {
        console.error("Error cargando carrito", err);
      }
    }

    loadCart();
  }, [user]);

  const persistCart = (items: StoredCartItem[]) => {
    setCartItems(items);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  };

  const handleQuantityChange = async (id: string, delta: number) => {
    if (!cartId) return;

    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const newQty = Math.max(0, item.quantity + delta);

    // Si llega a 0 → eliminar
    if (newQty === 0) {
      return handleRemove(id);
    }

    await fetch("/api/cart/add-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cart_id: cartId,
        product_id: item.id,
        quantity: newQty,
        discount: 0
      })
    });

    setCartItems(
      cartItems.map((i) =>
        i.id === id ? { ...i, quantity: newQty } : i
      )
    );
  };

  const handleRemove = async (id: string) => {
    if (!cartId) return;

    await fetch("/api/cart/remove-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cart_id: cartId,
        product_id: id
      })
    });

    setCartItems(cartItems.filter((i) => i.id !== id));
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-white/90">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-20 text-center text-orange-900">
          <div className="rounded-full bg-orange-100/70 p-6 text-4xl">🛒</div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">Necesitas iniciar sesión</h1>
            <p className="text-sm text-orange-800/80">
              Guarda tus pedidos favoritos y sigue tu carrito desde cualquier
              dispositivo.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              asChild
              className="bg-orange-600 text-white hover:bg-orange-700"
            >
              <Link href="/auth?mode=login">Iniciar sesión</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-orange-300 text-orange-700"
            >
              <Link href="/auth?mode=register">Crear cuenta</Link>
            </Button>
          </div>
          <p className="text-xs text-orange-800/60">
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
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-20 text-center text-orange-900">
          <div className="rounded-full bg-orange-50 p-6 text-4xl">🌾</div>
          <h1 className="text-3xl font-semibold">Tu carrito está vacío</h1>
          <p className="text-sm text-orange-800/80">
            Explora las tiendas rurales y agrega tus antojos favoritos.
          </p>
          <Button
            asChild
            className="rounded-full bg-orange-600 px-6 py-3 text-white hover:bg-orange-700"
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

<<<<<<< Updated upstream
  const deliveryFee = useMemo(() => {
    if (!customerLocation) {
      return DEFAULT_DELIVERY_FEE;
    }

    return BASE_DELIVERY + cartItems.length * COST_PER_KM;
  }, [cartItems, customerLocation]);

  const total = subtotal + SERVICE_FEE + deliveryFee;
=======
  // Nota: deliveryFee ya está definido arriba con useMemo
  const total = subtotal + SERVICE_FEE + deliveryFee; // Agregar deliveryFee al total
>>>>>>> Stashed changes

  const handleDetectLocation = () => {
    if (!window?.navigator?.geolocation) {
      setLocationError("Tu dispositivo no permite obtener la ubicación.");
      return;
    }
    setLocating(true);
    setLocationError(null);
    window.navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCustomerLocation({
<<<<<<< Updated upstream
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
=======
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
>>>>>>> Stashed changes
        });
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
    <div className="min-h-screen bg-white/80 text-orange-950">
      <div className="container mx-auto grid gap-8 px-4 py-12 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-6">
          <header className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold">Tu carrito</h1>
            <p className="text-sm text-orange-900/80">
              Revisa tu pedido antes de confirmar. Puedes ajustar cantidades o
              dejar instrucciones especiales para cada tienda.
            </p>
          </header>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-4 rounded-3xl border border-orange-100 bg-white p-4 shadow-sm transition hover:border-orange-200 hover:shadow-md sm:flex-row"
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
                      <h2 className="text-lg font-semibold text-orange-950">
                        {item.nombre}
                      </h2>
                      <p className="text-sm text-orange-900/70">
                        {item.negocio}
                      </p>
                      {item.extras.length > 0 ? (
                        <p className="text-xs text-orange-900/60">
                          {item.extras.join(", ")}
                        </p>
                      ) : null}
                    </div>
                    <div className="text-right text-sm font-semibold text-orange-900">
                      MX${(getItemPrice(item) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 px-3 py-1">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="text-orange-600"
                        aria-label="Disminuir"
                      >
                        −
                      </button>
                      <span className="min-w-[2ch] text-center text-sm font-semibold text-orange-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="text-orange-600"
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
                          className="border border-orange-200 bg-orange-50 text-orange-700"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <button
                      className="ml-auto text-xs font-semibold text-orange-700 underline-offset-4 hover:underline"
                      onClick={() => handleRemove(item.id)}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="rounded-3xl border border-dashed border-orange-200 bg-orange-50/80 p-6">
            <h2 className="text-lg font-semibold text-orange-900">
              Instrucciones para el repartidor
            </h2>
<<<<<<< Updated upstream
            <p className="mt-2 text-sm text-orange-900/70">
              Agrega cualquier indicación adicional (por ejemplo: “dejar en
              recepción” o “tocar el timbre 2”).
=======
            <p className="mt-2 text-sm text-emerald-900/70">
              Agrega cualquier indicación adicional (por ejemplo: "dejar en
              recepción" o "tocar el timbre 2").
>>>>>>> Stashed changes
            </p>
            <textarea
              placeholder="Escribe tus instrucciones..."
              className="mt-4 w-full rounded-2xl border border-orange-200 bg-white/80 p-3 text-sm text-orange-900 outline-none focus:border-orange-400"
              rows={4}
            />
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-orange-900">
              Resumen de pago
            </h2>
            <dl className="mt-4 space-y-3 text-sm text-orange-900/80">
              <div className="flex items-center justify-between">
                <dt>Subtotal</dt>
                <dd>MX${subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Envío</dt>
                <dd>MX${deliveryFee.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Servicio</dt>
                <dd>MX${SERVICE_FEE.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-dashed border-orange-100 pt-3 text-base font-semibold text-orange-950">
                <dt>Total</dt>
                <dd>MX${total.toFixed(2)}</dd>
              </div>
            </dl>
            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={locating}
                className="w-full rounded-2xl border border-orange-200 bg-white py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {customerLocation
                  ? "Actualizar mi ubicación"
                  : "Calcular envío con mi ubicación"}
              </button>
              {locationError ? (
                <p className="text-xs text-rose-500">{locationError}</p>
              ) : null}
              {customerLocation ? (
                <p className="text-xs text-orange-700">
                  Envío estimado según tu ubicación actual.
                </p>
              ) : (
                <p className="text-xs text-orange-800/70">
                  Si compartes tu ubicación, ajustamos el costo de envío por distancia.
                </p>
              )}
            </div>
            <Button className="mt-6 w-full bg-orange-600 text-white hover:bg-orange-700">
              Confirmar y pagar
            </Button>
          </div>

          <div className="rounded-3xl border border-orange-100 bg-white/90 p-6 text-sm text-orange-900/80">
            <h3 className="text-sm font-semibold text-orange-900">
              Beneficios de Gogi Eats
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
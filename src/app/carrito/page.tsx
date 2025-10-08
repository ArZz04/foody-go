"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrdersContext";

const cartItems = [
  {
    id: "postres-01",
    name: "Caja sorpresa de postres",
    store: "Postres y Antojitos",
    notes: "Incluye 6 mini cheesecakes y brownies",
    price: 210,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    tags: ["Dulce", "Popular"],
  },
  {
    id: "bebidas-01",
    name: "Smoothie energético",
    store: "Smoothie Lab",
    notes: "Smoothie de frutos rojos con proteína vegana",
    price: 95,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1527169402691-feff5539e52c?auto=format&fit=crop&w=800&q=80",
    tags: ["Vegano", "Promo"],
  },
];

const deliveryFee = 39;
const serviceFee = 12;

export default function CarritoPage() {
  const { user } = useAuth();
  const { addOrder } = useOrders();
  const [instructions, setInstructions] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryReference, setDeliveryReference] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"Tarjeta" | "Efectivo">(
    "Tarjeta",
  );
  const [feedback, setFeedback] = useState<string | null>(null);

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
            <Link href="/tiendas" className="underline">
              tiendas disponibles
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const total = subtotal + deliveryFee + serviceFee;

  const handleConfirmOrder = () => {
    if (!contactPhone.trim() || !deliveryAddress.trim()) {
      setFeedback(
        "Completa teléfono y dirección para enviar el pedido al repartidor.",
      );
      return;
    }

    const now = new Date();
    const orderId = `ORD-${now.getFullYear().toString().slice(-2)}${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}-${now
      .getTime()
      .toString()
      .slice(-4)}`;

    addOrder({
      id: orderId,
      customer: {
        name: user?.name ?? "Cliente Foody",
        phone: contactPhone,
      },
      pickup: {
        name:
          cartItems.length > 1
            ? "Múltiples comercios"
            : (cartItems[0]?.store ?? "Pendiente"),
        address:
          cartItems.length > 1
            ? "Coordinar por cada tienda"
            : `${cartItems[0]?.store ?? "Pendiente"} — sucursal central`,
      },
      dropoff: {
        address: deliveryAddress,
        neighborhood: deliveryReference,
      },
      status: "Asignar repartidor",
      eta: "Pendiente",
      items: cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
      })),
      total,
      payment:
        paymentMethod === "Efectivo"
          ? {
              method: "Efectivo",
              status: "Pendiente de cobro",
              amountToCollect: total,
            }
          : {
              method: "Tarjeta",
              status: "Pagado",
              amountToCollect: 0,
            },
      instructions,
      updatedAt: now.toISOString(),
      createdAt: now.toISOString(),
    });

    setFeedback("Pedido enviado al repartidor. ¡Gracias!");
    setInstructions("");
    setDeliveryReference("");
    setDeliveryAddress("");
    setContactPhone("");
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
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 160px"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-emerald-950">
                        {item.name}
                      </h2>
                      <p className="text-sm text-emerald-900/70">
                        {item.store}
                      </p>
                      <p className="text-xs text-emerald-900/60">
                        {item.notes}
                      </p>
                    </div>
                    <div className="text-right text-sm font-semibold text-emerald-900">
                      MX${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 px-3 py-1">
                      <button
                        className="text-emerald-600"
                        aria-label="Disminuir"
                      >
                        −
                      </button>
                      <span className="min-w-[2ch] text-center text-sm font-semibold text-emerald-900">
                        {item.quantity}
                      </span>
                      <button
                        className="text-emerald-600"
                        aria-label="Aumentar"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <Badge
                          key={`${item.id}-${tag}`}
                          variant="secondary"
                          className="border border-emerald-200 bg-emerald-50 text-emerald-700"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <button className="ml-auto text-xs font-semibold text-emerald-700 underline-offset-4 hover:underline">
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
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="contact-phone">Teléfono de contacto</Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  placeholder="Ej. +52 55 1234 5678"
                  value={contactPhone}
                  onChange={(event) => {
                    setContactPhone(event.target.value);
                    setFeedback(null);
                  }}
                  className="border-emerald-200 bg-white/80 text-sm text-emerald-900"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="payment-method">Método de pago</Label>
                <select
                  id="payment-method"
                  value={paymentMethod}
                  onChange={(event) => {
                    setPaymentMethod(
                      event.target.value as "Tarjeta" | "Efectivo",
                    );
                    setFeedback(null);
                  }}
                  className="w-full rounded-2xl border border-emerald-200 bg-white/80 p-3 text-sm text-emerald-900 outline-none focus:border-emerald-400"
                >
                  <option value="Tarjeta">Tarjeta (pagado ahora)</option>
                  <option value="Efectivo">
                    Efectivo (cobraré al entregar)
                  </option>
                </select>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor="delivery-address">Dirección de entrega</Label>
                <Input
                  id="delivery-address"
                  placeholder="Calle, número y referencias principales"
                  value={deliveryAddress}
                  onChange={(event) => {
                    setDeliveryAddress(event.target.value);
                    setFeedback(null);
                  }}
                  className="border-emerald-200 bg-white/80 text-sm text-emerald-900"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor="delivery-reference">
                  Colonia / Punto de referencia
                </Label>
                <Input
                  id="delivery-reference"
                  placeholder="Ej. Colonia Roma Norte, edificio Gris"
                  value={deliveryReference}
                  onChange={(event) => {
                    setDeliveryReference(event.target.value);
                    setFeedback(null);
                  }}
                  className="border-emerald-200 bg-white/80 text-sm text-emerald-900"
                />
              </div>
            </div>
            <textarea
              placeholder="Escribe tus instrucciones..."
              className="mt-4 w-full rounded-2xl border border-emerald-200 bg-white/80 p-3 text-sm text-emerald-900 outline-none focus:border-emerald-400"
              rows={4}
              value={instructions}
              onChange={(event) => {
                setInstructions(event.target.value);
                setFeedback(null);
              }}
            />
            {feedback ? (
              <p
                className={`mt-3 text-sm ${feedback.startsWith("Completa") ? "text-amber-600" : "text-emerald-700"}`}
              >
                {feedback}
              </p>
            ) : null}
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
                <dd>MX${deliveryFee.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Servicio</dt>
                <dd>MX${serviceFee.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-dashed border-emerald-100 pt-3 text-base font-semibold text-emerald-950">
                <dt>Total</dt>
                <dd>MX${total.toFixed(2)}</dd>
              </div>
            </dl>
            <Button
              className="mt-6 w-full bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={handleConfirmOrder}
            >
              Confirmar pedido
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

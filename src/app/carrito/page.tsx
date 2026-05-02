"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useEffect, useState } from "react";

import AddressRequiredDialog, {
  type SavedAddress,
} from "@/components/address/AddressRequiredDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import type { ShippingByAddressResult } from "@/lib/shipping";

type StoredCartItem = {
  id: string;
  productId?: number;
  nombre: string;
  negocio: string;
  ciudad?: string;
  image: string;
  extras: string[];
  tags?: string[];
  quantity: number;
  unitPrice?: number;
  price?: number;
  notes?: string;
  customizations?: {
    selectedOptions?: Array<{
      groupName?: string;
      optionName?: string;
      extraPrice?: number;
    }>;
    extrasTotal?: number;
    totalPrice?: number;
  };
};

const SERVICE_FEE = 12;
const TERMINAL_FEE_RATE = 0.035;
const CART_STORAGE_KEY = "gogi:cart";
const CART_UPDATED_EVENT = "gogi-cart-updated";
const DEFAULT_SHIPPING_STATE: ShippingByAddressResult = {
  zoneName: null,
  shippingCost: null,
  requiresConfirmation: true,
  message: "Agrega tu dirección para calcular el costo de envío.",
  distanceKm: null,
};
const PAYMENT_METHOD_OPTIONS = [
  {
    id: "efectivo",
    label: "Efectivo al recibir",
    description: "Paga en efectivo cuando llegue tu pedido.",
  },
  {
    id: "transferencia",
    label: "Transferencia",
    description: "Realiza una transferencia antes de la entrega.",
  },
  {
    id: "terminal",
    label: "Pago con terminal al recibir",
    description: "Paga con tarjeta usando terminal al momento de recibir.",
  },
] as const;

type PaymentMethodOption = (typeof PAYMENT_METHOD_OPTIONS)[number]["id"];

type CheckoutItemPayload = {
  product_id: number;
  quantity: number;
  unit_price: number;
  customizations: string;
  notes: string;
  total_price: number;
};

type CreatedOrderSummary = {
  id: number;
  totalAmount: number;
};

type CreateOrderOptions = {
  status?: string;
  paymentMethod?: PaymentMethodOption;
  transferReceiptUrl?: string;
  transferReceiptName?: string;
};

const TRANSFER_ACCOUNT = {
  bank: "BBVA",
  holder: "Gogi Eats",
  clabe: "012345678901234567",
  accountNumber: "0123456789",
};

export default function CarritoPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<StoredCartItem[]>([]);
<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
=======
  const [savedAddress, setSavedAddress] = useState<SavedAddress | null>(
    user?.address ?? null,
  );
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodOption>("efectivo");
  const [transferReceiptName, setTransferReceiptName] = useState("");
  const [transferReceiptUrl, setTransferReceiptUrl] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [shipping, setShipping] = useState<ShippingByAddressResult>(
    DEFAULT_SHIPPING_STATE,
  );
>>>>>>> Stashed changes

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
      window.dispatchEvent(new Event(CART_UPDATED_EVENT));
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

  const clearCart = () => {
    persistCart([]);
  };

  const getItemPrice = (item: StoredCartItem) =>
    item.unitPrice ?? item.price ?? 0;

  const getVisibleExtras = (item: StoredCartItem) => {
    const selectedOptions = item.customizations?.selectedOptions ?? [];

    if (selectedOptions.length > 0) {
      return selectedOptions
        .map((option) => String(option.optionName ?? "").trim())
        .filter(Boolean);
    }

    return item.extras
      .map((extra) => String(extra).trim())
      .filter(
        (extra) =>
          extra.length > 0 &&
          !extra.toLowerCase().includes(": false") &&
          extra.toLowerCase() !== "false",
      )
      .map((extra) => extra.replace(/^.+:\s*/, "").trim());
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + getItemPrice(item) * item.quantity,
    0,
  );

  const terminalFee =
    selectedPaymentMethod === "terminal"
      ? Number((subtotal * TERMINAL_FEE_RATE).toFixed(2))
      : 0;
  const deliveryFee = shipping.shippingCost ?? 0;
  const total = subtotal + terminalFee + SERVICE_FEE + deliveryFee;

  useEffect(() => {
    setSavedAddress(user?.address ?? null);
  }, [user]);

  useEffect(() => {
    if (!user?.id || user.address) return;

    const loadAddress = async () => {
      const token = window.localStorage.getItem("token");

      if (!token) return;

      try {
        const response = await fetch("/api/account/address", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) return;

        const data = await response.json();
        setSavedAddress((data.address as SavedAddress | null) ?? null);
      } catch (error) {
        console.error("No se pudo cargar la dirección guardada", error);
      }
    };

    loadAddress();
  }, [user]);

  useEffect(() => {
    const loadShipping = async () => {
      if (!savedAddress?.fullAddress) {
        setShipping(DEFAULT_SHIPPING_STATE);
        return;
      }

      try {
        const response = await fetch("/api/shipping/quote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: savedAddress.fullAddress,
            neighborhood: savedAddress.neighborhood,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data?.error || "No pudimos calcular el envío.");
        }

        setShipping(
          (data.shipping as ShippingByAddressResult) ?? DEFAULT_SHIPPING_STATE,
        );
      } catch (error) {
        console.error(error);
        setShipping({
          ...DEFAULT_SHIPPING_STATE,
          message: "No pudimos calcular el envío en este momento.",
        });
      }
    };

    loadShipping();
  }, [savedAddress]);

  const buildCheckoutItems = (): CheckoutItemPayload[] =>
    cartItems.map((item) => ({
      product_id: Number(item.productId),
      quantity: item.quantity,
      unit_price: getItemPrice(item),
      customizations:
        item.customizations?.selectedOptions
          ?.map((option) =>
            option.groupName
              ? `${option.groupName}: ${option.optionName ?? ""}`.trim()
              : String(option.optionName ?? "").trim(),
          )
          .filter(Boolean)
          .join(", ") ?? "",
      notes: item.notes ?? "",
      total_price: Number((getItemPrice(item) * item.quantity).toFixed(2)),
    }));

  const validateCheckout = () => {
    const token = window.localStorage.getItem("token");

    if (!user?.id || !token) {
      window.alert("Debes iniciar sesión para continuar.");
      return null;
    }

    if (cartItems.length === 0) {
      window.alert("Tu carrito está vacío.");
      return null;
    }

    if (!savedAddress?.id || !savedAddress.fullAddress) {
      window.alert("Necesitas guardar una dirección de entrega.");
      setAddressDialogOpen(true);
      return null;
    }

    if (
      shipping.requiresConfirmation ||
      shipping.shippingCost == null ||
      !shipping.zoneName
    ) {
      window.alert("Primero necesitamos calcular el costo de envío.");
      return null;
    }

    if (!(subtotal > 0) || !(SERVICE_FEE >= 0) || !(total > 0)) {
      window.alert("No pudimos validar los montos del pedido.");
      return null;
    }

    const items = buildCheckoutItems();

    if (
      items.some((item) => !item.product_id || Number.isNaN(item.product_id))
    ) {
      window.alert("Uno o más productos del carrito no son válidos.");
      return null;
    }

    return { token, items };
  };

  const handleCheckout = () => {
    const checkoutData = validateCheckout();

    if (!checkoutData) return;

    setPaymentDialogOpen(true);
  };

  const handleTransferReceiptChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    setTransferReceiptName(file?.name ?? "");

    if (!file) {
      setTransferReceiptUrl("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setTransferReceiptUrl(String(reader.result ?? ""));
    };
    reader.onerror = () => {
      console.error("No se pudo leer el comprobante de transferencia.");
      setTransferReceiptUrl("");
    };
    reader.readAsDataURL(file);
  };

  const createOrder = async ({
    status = "pendiente",
    paymentMethod = selectedPaymentMethod,
    transferReceiptUrl: proofUrl = "",
    transferReceiptName: proofName = "",
  }: CreateOrderOptions = {}) => {
    const checkoutData = validateCheckout();

    if (!checkoutData) return null;

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${checkoutData.token}`,
      },
      body: JSON.stringify({
        user_id: user.id,
        address_id: savedAddress.id,
        subtotal: Number(subtotal.toFixed(2)),
        terminal_fee: Number(terminalFee.toFixed(2)),
        shipping_cost: Number(deliveryFee.toFixed(2)),
        service_fee: Number(SERVICE_FEE.toFixed(2)),
        total: Number(total.toFixed(2)),
        delivery_instructions: deliveryInstructions.trim(),
        payment_method: paymentMethod,
        status,
        comprobante_pago_url:
          paymentMethod === "transferencia" ? proofUrl || null : null,
        transfer_receipt_note:
          paymentMethod === "transferencia" && proofName
            ? `Comprobante adjunto: ${proofName}`
            : null,
        items: checkoutData.items,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "No pudimos crear el pedido.");
    }

    const createdOrderId = Number(data.order?.id);

    return {
      id: createdOrderId,
      totalAmount: Number(data.order?.total_amount ?? total.toFixed(2)),
    } satisfies CreatedOrderSummary;
  };

  const handleConfirmOrder = async () => {
    if (selectedPaymentMethod === "transferencia") {
      const checkoutData = validateCheckout();

      if (!checkoutData) return;

      setPaymentDialogOpen(false);
      setTransferDialogOpen(true);
      return;
    }

    try {
      setSubmittingOrder(true);

      const createdOrder = await createOrder({ status: "pendiente" });

      if (!createdOrder) {
        return;
      }

      setPaymentDialogOpen(false);
      clearCart();
      router.push(`/pedidos/${createdOrder.id}`);
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error ? error.message : "No pudimos crear el pedido.",
      );
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handleTransferConfirmed = async () => {
    try {
      setSubmittingOrder(true);
      const createdOrder = await createOrder({
        status: "por_validar_pago",
        paymentMethod: "transferencia",
        transferReceiptUrl,
        transferReceiptName,
      });

      if (!createdOrder) {
        return;
      }

      setTransferDialogOpen(false);
      setTransferReceiptName("");
      setTransferReceiptUrl("");
      clearCart();
      router.push(`/pedidos/${createdOrder.id}`);
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error
          ? error.message
          : "No pudimos confirmar la transferencia.",
      );
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handleTransferPending = () => {
    setTransferDialogOpen(false);
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

<<<<<<< Updated upstream
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

    return BASE_DELIVERY + cartItems.length * COST_PER_KM;
  }, [cartItems, customerLocation]);

  const total = subtotal + SERVICE_FEE + deliveryFee;

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
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
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

=======
>>>>>>> Stashed changes
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
            {cartItems.map((item) => {
              const visibleExtras = getVisibleExtras(item);

              return (
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
                        {visibleExtras.length > 0 ? (
                          <p className="text-xs text-orange-900/60">
                            {visibleExtras.join(", ")}
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
                          type="button"
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
                          type="button"
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
                        type="button"
                        className="ml-auto text-xs font-semibold text-orange-700 underline-offset-4 hover:underline"
                        onClick={() => handleRemove(item.id)}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="rounded-3xl border border-dashed border-orange-200 bg-orange-50/80 p-6">
            <h2 className="text-lg font-semibold text-orange-900">
              Instrucciones para el repartidor
            </h2>
            <p className="mt-2 text-sm text-orange-900/70">
              Agrega cualquier indicación adicional (por ejemplo: “dejar en
              recepción” o “tocar el timbre 2”).
            </p>
            <textarea
              value={deliveryInstructions}
              onChange={(event) => setDeliveryInstructions(event.target.value)}
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
                <dt>
                  {shipping.zoneName ? `Envío a ${shipping.zoneName}` : "Envío"}
                </dt>
                <dd>
                  {shipping.requiresConfirmation
                    ? "Por confirmar"
                    : `MX$${deliveryFee.toFixed(2)}`}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Servicio</dt>
                <dd>MX${SERVICE_FEE.toFixed(2)}</dd>
              </div>
              {selectedPaymentMethod === "terminal" ? (
                <div className="flex items-center justify-between">
                  <dt>Cargo por terminal (3.5%)</dt>
                  <dd>MX${terminalFee.toFixed(2)}</dd>
                </div>
              ) : null}
              <div className="flex items-center justify-between border-t border-dashed border-orange-100 pt-3 text-base font-semibold text-orange-950">
                <dt>Total</dt>
                <dd>
                  {shipping.requiresConfirmation
                    ? "Por confirmar"
                    : `MX$${total.toFixed(2)}`}
                </dd>
              </div>
            </dl>
            <div className="mt-4 space-y-2">
              <div className="rounded-2xl border border-orange-200 bg-orange-50/70 px-4 py-3">
                <p className="text-xs font-semibold text-orange-900">
                  Dirección de entrega
                </p>
                {savedAddress ? (
                  <>
                    <p className="mt-2 text-sm font-medium text-orange-950">
                      {savedAddress.placeName || savedAddress.placeType}
                    </p>
                    <p className="mt-1 text-sm text-orange-900/80">
                      {savedAddress.fullAddress}
                    </p>
                    <p className="mt-1 text-xs text-orange-900/70">
                      Teléfono: {savedAddress.phone}
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-orange-900/80">
                    Necesitas registrar tu dirección antes de finalizar el
                    pedido.
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setAddressDialogOpen(true)}
                className="w-full rounded-2xl border border-orange-200 bg-white py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-50"
              >
                {savedAddress ? "Actualizar dirección" : "Agregar dirección"}
              </button>
              <p
                className={`text-xs ${
                  shipping.requiresConfirmation
                    ? "text-amber-600"
                    : "text-orange-800/70"
                }`}
              >
                {shipping.requiresConfirmation && savedAddress?.fullAddress
                  ? "Tu zona requiere confirmación del envío antes de finalizar el pedido."
                  : shipping.message}
              </p>
            </div>
            <Button
              type="button"
              onClick={handleCheckout}
              disabled={submittingOrder}
              className="mt-6 w-full bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-60"
            >
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

      <AddressRequiredDialog
        open={addressDialogOpen}
        onOpenChange={setAddressDialogOpen}
        onSaved={(address) => setSavedAddress(address)}
      />

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="max-w-lg rounded-3xl border-orange-100 bg-white p-0 shadow-xl">
          <DialogHeader className="border-b border-orange-100 px-6 py-5">
            <DialogTitle className="text-orange-950">
              Elige tu método de pago
            </DialogTitle>
            <DialogDescription className="text-orange-900/70">
              Selecciona cómo quieres pagar antes de confirmar tu pedido.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 px-6 py-5">
            {PAYMENT_METHOD_OPTIONS.map((option) => {
              const isSelected = selectedPaymentMethod === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedPaymentMethod(option.id)}
                  className={`flex w-full flex-col rounded-2xl border px-4 py-4 text-left transition ${
                    isSelected
                      ? "border-orange-400 bg-orange-50"
                      : "border-orange-100 bg-white hover:bg-orange-50/60"
                  }`}
                >
                  <span className="text-sm font-semibold text-orange-950">
                    {option.label}
                  </span>
                  <span className="mt-1 text-sm text-orange-900/70">
                    {option.description}
                  </span>
                  {option.id === "terminal" && isSelected ? (
                    <span className="mt-2 text-xs text-orange-700">
                      Este método incluye un cargo adicional del 3.5% por uso de
                      terminal.
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <DialogFooter className="border-t border-orange-100 bg-white px-6 py-4 sm:justify-end">
            <button
              type="button"
              onClick={() => setPaymentDialogOpen(false)}
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmOrder}
              disabled={submittingOrder}
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-orange-500 px-5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
            >
              {submittingOrder ? "Confirmando..." : "Confirmar pedido"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
        <DialogContent className="max-w-lg rounded-3xl border-orange-100 bg-white p-0 shadow-xl">
          <DialogHeader className="border-b border-orange-100 px-6 py-5">
            <DialogTitle className="text-orange-950">
              Datos para tu transferencia
            </DialogTitle>
            <DialogDescription className="text-orange-900/70">
              Usa estos datos de prueba para completar el pago de tu pedido.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-6 py-5 text-sm text-orange-950">
            <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
              <p>
                <span className="font-semibold">Banco:</span>{" "}
                {TRANSFER_ACCOUNT.bank}
              </p>
              <p className="mt-2">
                <span className="font-semibold">Nombre del titular:</span>{" "}
                {TRANSFER_ACCOUNT.holder}
              </p>
              <p className="mt-2">
                <span className="font-semibold">CLABE:</span>{" "}
                {TRANSFER_ACCOUNT.clabe}
              </p>
              <p className="mt-2">
                <span className="font-semibold">Número de cuenta:</span>{" "}
                {TRANSFER_ACCOUNT.accountNumber}
              </p>
              <p className="mt-2">
                <span className="font-semibold">Concepto:</span>{" "}
                {user?.name
                  ? `Pedido temporal - ${user.name}`
                  : "Pedido temporal"}
              </p>
              <p className="mt-2">
                <span className="font-semibold">Total a pagar:</span> MX$
                {Number(total.toFixed(2)).toFixed(2)}
              </p>
            </div>

            <label className="block space-y-2">
              <span className="font-semibold text-orange-950">
                Subir comprobante
              </span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleTransferReceiptChange}
                className="block w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm text-orange-900 file:mr-3 file:rounded-xl file:border-0 file:bg-orange-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-orange-700"
              />
              <p className="text-xs text-orange-900/65">
                {transferReceiptName
                  ? `Comprobante seleccionado: ${transferReceiptName}`
                  : "Puedes adjuntar un comprobante ahora o dejar el pedido pendiente."}
              </p>
            </label>
          </div>

          <DialogFooter className="border-t border-orange-100 bg-white px-6 py-4 sm:justify-end">
            <button
              type="button"
              onClick={handleTransferPending}
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Dejar pendiente
            </button>
            <button
              type="button"
              onClick={handleTransferConfirmed}
              disabled={submittingOrder}
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-orange-500 px-5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
            >
              {submittingOrder
                ? "Confirmando..."
                : "Ya realicé la transferencia"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
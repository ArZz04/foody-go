"use client";

import { type FormEvent, type ReactNode, useState } from "react";

const CURRENT_BUSINESS = {
  name: "Carnicería Country",
  category: "Carnicería premium",
  location: "Guadalajara, Jalisco",
  owner: "Ana López",
  phone: "33 4455 6677",
  email: "contacto@carniceriacountry.mx",
  hours: "L-D 8:00 a 21:00 h",
};

const METRICS = [
  { label: "Pedidos hoy", value: "24", delta: "+8%", tone: "emerald" },
  { label: "Pedidos pendientes", value: "5", delta: "En preparación", tone: "amber" },
  { label: "Ingreso estimado", value: "$12,360", delta: "Semana actual", tone: "sky" },
  { label: "Productos agotados", value: "2 cortes", delta: "Reponer inventario", tone: "rose" },
] as const;

type OrderTicket = {
  id: string;
  negocio: string;
  total: string;
  estado: string;
  hora: string;
  cliente: string;
  metodoPago: string;
  direccion: string;
  notas?: string;
  items: Array<{ nombre: string; cantidad: number; precio: string; extras?: string }>;
  deliveryRequested?: boolean;
};

const INITIAL_ORDERS: OrderTicket[] = [
  {
    id: "FO-1342",
    negocio: "Carnicería Country",
    total: "$982",
    estado: "Preparando",
    hora: "11:06",
    cliente: "Gabriela Zamora",
    metodoPago: "Tarjeta •••• 1234",
    direccion: "Av. Chapultepec 345, Piso 4, Guadalajara",
    notas: "Empaquetar al alto vacío por separado.",
    items: [
      { nombre: "Rib Eye Prime 350g", cantidad: 4, precio: "$760", extras: "Alto vacío individual" },
      { nombre: "Chorizo artesanal 1kg", cantidad: 1, precio: "$122", extras: "Picar en piezas pequeñas" },
      { nombre: "Costillas BBQ marinado 1.5kg", cantidad: 1, precio: "$100", extras: "Añadir salsa extra" },
    ],
  },
  {
    id: "FO-1341",
    negocio: "Carnicería Country",
    total: "$648",
    estado: "Listo para entregar",
    hora: "10:52",
    cliente: "Luis Aguilar",
    metodoPago: "Efectivo exacto",
    direccion: "Calle Hidalgo 120, Col. Centro, Zapopan",
    notas: "Enviar hielera para los cortes premium.",
    items: [
      { nombre: "Tomahawk 1.2kg", cantidad: 1, precio: "$460", extras: "Seleccionar con buena infiltración" },
      { nombre: "Arrachera marinada 1kg", cantidad: 1, precio: "$188" },
    ],
  },
  {
    id: "FO-1339",
    negocio: "Carnicería Country",
    total: "$742",
    estado: "Enviado",
    hora: "10:18",
    cliente: "Claudia Ríos",
    metodoPago: "PayPal",
    direccion: "Circuito Madrigal 234, Col. Puerta de Hierro",
    items: [
      { nombre: "Filete Angus Choice 250g", cantidad: 4, precio: "$568" },
      { nombre: "Hamburguesas gourmet 150g", cantidad: 6, precio: "$174", extras: "Agregar tocino ahumado" },
    ],
  },
  {
    id: "FO-1338",
    negocio: "Carnicería Country",
    total: "$386",
    estado: "Pagado",
    hora: "09:44",
    cliente: "Ricardo Márquez",
    metodoPago: "Transferencia SPEI",
    direccion: "Priv. Revolución 45, Tlaquepaque",
    notas: "Sin picante en las salsas.",
    items: [
      { nombre: "Carne molida premium 1kg", cantidad: 2, precio: "$218" },
      { nombre: "Pechuga de pollo orgánica 1kg", cantidad: 1, precio: "$168" },
    ],
  },
];

type SellerRecord = {
  id: number;
  nombre: string;
  telefono: string;
  pedidos: number;
  estado: "Activo" | "En capacitación" | "Inactivo";
  correo?: string;
  sucursal?: string;
};

const INITIAL_SELLERS: SellerRecord[] = [
  { id: 1, nombre: "Laura Méndez", telefono: "33 1234 5678", pedidos: 128, estado: "Activo" },
  { id: 2, nombre: "Óscar Ramírez", telefono: "33 2109 8785", pedidos: 94, estado: "En capacitación" },
  { id: 3, nombre: "María Torres", telefono: "33 4456 6677", pedidos: 173, estado: "Activo" },
  { id: 4, nombre: "Hugo Salas", telefono: "33 9900 1234", pedidos: 41, estado: "Inactivo" },
];

export default function ManagerPage() {
  const [orders, setOrders] = useState<OrderTicket[]>(INITIAL_ORDERS);
  const [openOrderId, setOpenOrderId] = useState<string | null>(INITIAL_ORDERS[0]?.id ?? null);
  const [sellers, setSellers] = useState<SellerRecord[]>(INITIAL_SELLERS);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const quickActions = [
    {
      title: "Registrar nuevo vendedor",
      description: "Agrega datos básicos y asigna credenciales temporales.",
      onClick: () => setShowRegisterModal(true),
    },
    {
      title: "Programar capacitación",
      description: "Coordina sesiones virtuales o presenciales para tu equipo.",
    },
    {
      title: "Actualizar catálogo de cortes",
      description: "Sincroniza precios, combos parrilleros y disponibilidad de productos.",
    },
  ];

  const handleCreateSeller = (data: {
    nombre: string;
    telefono: string;
    correo?: string;
    sucursal?: string;
    estado: SellerRecord["estado"];
  }) => {
    const newSeller: SellerRecord = {
      id: Date.now(),
      nombre: data.nombre,
      telefono: data.telefono,
      correo: data.correo,
      sucursal: data.sucursal,
      estado: data.estado,
      pedidos: 0,
    };

    setSellers((prev) => [newSeller, ...prev]);
    setShowRegisterModal(false);
  };

  const handleRequestCourier = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              estado: "Repartidor solicitado",
              deliveryRequested: true,
            }
          : order,
      ),
    );
    console.log(`[Logística] Pedido ${orderId} enviado al repartidor.`);
  };

  const handleOrderReady = (orderId: string) => {
    if (orders.length === 0) return;
    handleRequestCourier(orderId);

    const currentIndex = orders.findIndex((order) => order.id === orderId);
    const nextOrder = orders[(currentIndex + 1) % orders.length];
    setOpenOrderId(nextOrder?.id ?? null);
  };

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(24,78,119,0.08),transparent_55%)]">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/fondo-bosque.jpg')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-900/45 to-white" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-10 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <header className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-800 via-teal-700 to-emerald-600 p-6 text-white shadow-[0_32px_120px_-46px_rgba(13,148,136,0.6)] ring-1 ring-white/20 sm:p-10">
          <div className="absolute -left-20 top-[-80px] size-64 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute bottom-[-120px] right-[-40px] size-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_55%)]" />
          <div className="relative z-10 space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/75">
              Panel de vendedor • {CURRENT_BUSINESS.name}
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                Gestión de pedidos para {CURRENT_BUSINESS.category.toLowerCase()}
              </h1>
              <p className="max-w-3xl text-sm text-white/85 sm:text-base">
                Supervisa pedidos entrantes, coordina vendedores y controla inventario de cortes premium.
                Conecta este panel a tu API para contar con información sincronizada por sucursal.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-white/70">
                <span className="rounded-full border border-white/30 px-3 py-1">
                  {CURRENT_BUSINESS.location}
                </span>
                <span className="rounded-full border border-white/30 px-3 py-1">
                  Responsable: {CURRENT_BUSINESS.owner}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <HeroBadge>Pedidos en vivo</HeroBadge>
              <HeroBadge tone="white">Última sincronización: hace 5 min</HeroBadge>
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {METRICS.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-5 rounded-[28px] border border-white/40 bg-white/70 p-6 shadow-lg ring-1 ring-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-8">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-xl font-semibold text-emerald-700 sm:text-2xl">Pedidos del negocio</h2>
                <p className="text-sm text-zinc-500">
                  Monitorea la preparación, marca pedidos listos y solicita repartidores desde aquí.
                </p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600 transition hover:bg-white/60">
                Ver historial completo
              </button>
            </div>
            <ul className="grid gap-3 text-sm">
              {orders.map((order) => {
                const isOpen = openOrderId === order.id;
                return (
                  <li
                    key={order.id}
                    className="rounded-2xl border border-white/40 bg-white/85 p-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenOrderId(isOpen ? null : order.id)}
                      className="flex w-full flex-wrap items-center justify-between gap-3 text-left"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">{order.id}</p>
                        <p className="text-base font-semibold text-zinc-700">{order.negocio}</p>
                        <p className="text-xs text-zinc-400">Actualizado a las {order.hora} h</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm font-semibold text-emerald-600">
                        <span>{order.total}</span>
                        <span className="rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-600">
                          {order.estado}
                        </span>
                      </div>
                    </button>
                    {isOpen ? (
                      <div className="mt-3 grid gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 text-xs text-zinc-600 sm:grid-cols-[1.2fr_1fr] sm:text-sm">
                        <div className="space-y-3">
                          <div className="grid gap-1">
                            <span className="font-semibold text-emerald-700">Cliente</span>
                            <span>{order.cliente}</span>
                            <span className="text-zinc-400">Método de pago: {order.metodoPago}</span>
                          </div>
                          <div className="grid gap-1">
                            <span className="font-semibold text-emerald-700">Entrega</span>
                            <span>{order.direccion}</span>
                            {order.notas ? (
                              <span className="text-zinc-400">Notas: {order.notas}</span>
                            ) : null}
                          </div>
                        </div>
                        <div className="space-y-2 rounded-2xl border border-white/60 bg-white/80 p-3 shadow-sm">
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
                            Ticket del pedido
                          </p>
                          <ul className="space-y-2">
                            {order.items.map((item, index) => (
                              <li key={`${order.id}-${index}`} className="flex justify-between gap-3 text-xs sm:text-sm">
                                <div>
                                  <span className="font-semibold text-zinc-700">
                                    {item.cantidad}× {item.nombre}
                                  </span>
                                  {item.extras ? (
                                    <p className="text-[11px] text-zinc-400 sm:text-xs">• {item.extras}</p>
                                  ) : null}
                                </div>
                                <span className="font-semibold text-zinc-600">{item.precio}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="flex items-center justify-between border-t border-emerald-200/60 pt-2 text-sm font-semibold text-emerald-700">
                            <span>Total</span>
                            <span>{order.total}</span>
                          </div>
                          <div className="mt-2 text-xs text-emerald-500">
                            {order.deliveryRequested ? "Repartidor asignado y en camino." : "Sin repartidor asignado todavía."}
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-emerald-700 sm:flex-none disabled:cursor-not-allowed disabled:bg-emerald-400/60"
                              onClick={() => handleOrderReady(order.id)}
                              disabled={order.deliveryRequested}
                            >
                              Pedido listo
                            </button>
                            <button
                              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-200/80 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600 transition hover:bg-emerald-50 sm:flex-none disabled:cursor-not-allowed disabled:border-emerald-100/60 disabled:text-emerald-400"
                              onClick={() => handleRequestCourier(order.id)}
                              disabled={order.deliveryRequested}
                            >
                              Solicitar repartidor
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>

          <aside className="space-y-5 rounded-[28px] border border-white/30 bg-white/60 p-6 shadow-lg ring-1 ring-white/50 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-8">
            <div>
              <h2 className="text-xl font-semibold text-emerald-700">Acciones rápidas</h2>
              <p className="text-sm text-zinc-500">
                Optimiza la respuesta a los pedidos y coordina a tu equipo.
              </p>
            </div>
            <div className="grid gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  type="button"
                  onClick={action.onClick}
                  className="w-full rounded-2xl border border-white/50 bg-white/80 px-4 py-3 text-left text-sm font-semibold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white/90"
                >
                  <span className="block">{action.title}</span>
                  <span className="mt-1 block text-xs font-normal text-zinc-500">
                    {action.description}
                  </span>
                </button>
              ))}
            </div>
            <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/60 px-4 py-4 text-sm text-emerald-800">
              Próximamente: integra tu POS para sincronizar disponibilidad en tiempo real.
            </div>
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
          <div className="rounded-[28px] border border-white/40 bg-white/75 p-6 shadow-lg ring-1 ring-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-emerald-700 sm:text-2xl">Equipo de vendedores</h2>
                <p className="text-sm text-zinc-500">
                  Controla el estatus de tus vendedores y su desempeño acumulado.
                </p>
              </div>
              <button className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600 transition hover:bg-white/80">
                Exportar reporte
              </button>
            </div>
            <div className="mt-5 overflow-hidden rounded-[22px] border border-white/45 bg-white/80 shadow-sm ring-1 ring-white/60 dark:border-white/10 dark:bg-white/5">
              <table className="min-w-full divide-y divide-white/50 text-sm dark:divide-white/10">
                <thead className="bg-gradient-to-r from-emerald-50/80 via-white/80 to-lime-50/80 text-left text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-600 dark:from-white/10 dark:via-white/5 dark:to-white/10">
                  <tr>
                    <th className="px-5 py-3">Vendedor</th>
                    <th className="px-5 py-3">Contacto</th>
                    <th className="px-5 py-3">Pedidos</th>
                    <th className="px-5 py-3">Estado</th>
                    <th className="px-5 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/40 bg-white/85 text-zinc-700 dark:divide-white/10 dark:bg-white/5 dark:text-zinc-200">
              {sellers.map((seller) => (
                <tr key={seller.id} className="transition hover:bg-emerald-50/50 dark:hover:bg-white/10">
                  <td className="px-5 py-3 font-medium">{seller.nombre}</td>
                  <td className="px-5 py-3 text-sm text-zinc-500">{seller.telefono}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-emerald-600">{seller.pedidos}</td>
                  <td className="px-5 py-3">
                        <SellerBadge estado={seller.estado} />
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="rounded-xl border border-emerald-200/70 px-3 py-1 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50">
                            Ver perfil
                          </button>
                          <button className="rounded-xl border border-white/60 px-3 py-1 text-xs font-semibold text-zinc-500 transition hover:bg-white/80">
                            Editar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[28px] border border-white/40 bg-white/75 p-6 shadow-lg ring-1 ring-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-8">
              <h2 className="text-xl font-semibold text-emerald-700">Información de contacto</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Mantenla actualizada para que los clientes y repartidores te localicen fácilmente.
              </p>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/85 px-4 py-3">
                  <dt className="font-semibold text-zinc-600">Correo principal</dt>
                  <dd className="text-zinc-500">{CURRENT_BUSINESS.email}</dd>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/85 px-4 py-3">
                  <dt className="font-semibold text-zinc-600">Teléfono</dt>
                  <dd className="text-zinc-500">{CURRENT_BUSINESS.phone}</dd>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/85 px-4 py-3">
                  <dt className="font-semibold text-zinc-600">Horario de atención</dt>
                  <dd className="text-zinc-500">{CURRENT_BUSINESS.hours}</dd>
                </div>
              </dl>
              <button className="mt-4 w-full rounded-2xl border border-emerald-200/70 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-100">
                Actualizar información
              </button>
            </div>

            <div className="rounded-[28px] border border-white/30 bg-emerald-500/20 p-6 text-sm text-emerald-900 shadow-lg ring-1 ring-white/40 backdrop-blur-xl sm:p-8">
              <h3 className="text-base font-semibold">Sugerencia de mejora</h3>
              <p className="mt-2">
                Activa alertas en WhatsApp para pedidos VIP y reduce el tiempo de confirmación en horas de
                mayor demanda.
              </p>
              <button className="mt-4 rounded-full border border-emerald-300/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600 transition hover:bg-white">
                Configurar alertas
              </button>
            </div>
          </div>
        </section>
      </div>
      </main>
      <RegisterSellerModal
        open={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSubmit={handleCreateSeller}
      />
    </>
  );
}

function HeroBadge({
  children,
  tone = "emerald",
}: {
  children: ReactNode;
  tone?: "emerald" | "white";
}) {
  const styles =
    tone === "white"
      ? "border-white/60 bg-white/15 text-white/80"
      : "border-emerald-100/70 bg-white/10 text-white";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${styles}`}>
      {children}
    </span>
  );
}

function MetricCard({
  label,
  value,
  delta,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  tone: "emerald" | "amber" | "sky" | "rose";
}) {
  const palette =
    tone === "emerald"
      ? "from-emerald-200/80 via-emerald-300/60 to-emerald-400/40 text-emerald-700"
      : tone === "amber"
        ? "from-amber-200/80 via-amber-300/60 to-amber-400/40 text-amber-700"
        : tone === "sky"
          ? "from-sky-200/80 via-sky-300/60 to-sky-400/40 text-sky-700"
          : "from-rose-200/80 via-rose-300/60 to-rose-400/40 text-rose-700";

  return (
    <div className={`overflow-hidden rounded-[22px] bg-gradient-to-br ${palette} p-[1px]`}>
      <div className="relative h-full rounded-[20px] bg-white/95 p-5 shadow-sm ring-1 ring-white/70 backdrop-blur">
        <div className="pointer-events-none absolute -top-12 right-0 size-24 rounded-full bg-white/40 blur-3xl" />
        <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">{label}</p>
        <h3 className="mt-3 text-3xl font-semibold text-zinc-800">{value}</h3>
        <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          {delta}
        </span>
      </div>
    </div>
  );
}

function SellerBadge({ estado }: { estado: string }) {
  const normalized = estado.toLowerCase();
  const theme =
    normalized === "activo"
      ? "bg-emerald-100/70 text-emerald-700"
      : normalized === "en capacitación"
        ? "bg-amber-100/70 text-amber-700"
        : "bg-zinc-200/70 text-zinc-600";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border border-white/50 px-3 py-1 text-xs font-semibold backdrop-blur ${theme}`}>
      <span className="size-2 rounded-full bg-current" />
      {estado}
    </span>
  );
}

function RegisterSellerModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    nombre: string;
    telefono: string;
    correo?: string;
    sucursal?: string;
    estado: SellerRecord["estado"];
  }) => void;
}) {
  const initialForm = {
    nombre: "",
    telefono: "",
    correo: "",
    sucursal: "",
    estado: "En capacitación" as SellerRecord["estado"],
  };

  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState(false);

  const resetForm = () => {
    setForm(initialForm);
    setTouched(false);
  };

  if (!open) {
    return null;
  }

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    if (!form.nombre.trim() || !form.telefono.trim()) {
      return;
    }
    onSubmit({
      nombre: form.nombre.trim(),
      telefono: form.telefono.trim(),
      correo: form.correo?.trim() || undefined,
      sucursal: form.sucursal?.trim() || undefined,
      estado: form.estado,
    });
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-[28px] border border-white/40 bg-white/95 shadow-2xl ring-1 ring-white/70">
        <div className="flex items-center justify-between bg-emerald-600/10 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-emerald-800">Registrar nuevo vendedor</h2>
            <p className="text-xs text-zinc-500">
              Completa la información para otorgar acceso al panel de pedidos.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="inline-flex size-8 items-center justify-center rounded-full border border-emerald-200/70 text-emerald-700 transition hover:bg-emerald-50"
            aria-label="Cerrar registro de vendedor"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 px-6 py-6 text-sm">
          <label className="grid gap-1">
            <span className="font-semibold text-zinc-600">Nombre completo *</span>
            <input
              type="text"
              value={form.nombre}
              onChange={(event) => handleChange("nombre", event.target.value)}
              className="rounded-xl border border-emerald-200/70 bg-white px-3 py-2 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="Ej. Karla Hernández"
              required
            />
            {touched && !form.nombre.trim() ? (
              <span className="text-xs text-rose-500">El nombre es obligatorio.</span>
            ) : null}
          </label>

          <label className="grid gap-1">
            <span className="font-semibold text-zinc-600">Teléfono de contacto *</span>
            <input
              type="tel"
              value={form.telefono}
              onChange={(event) => handleChange("telefono", event.target.value)}
              className="rounded-xl border border-emerald-200/70 bg-white px-3 py-2 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="Ej. 33 1234 5678"
              required
            />
            {touched && !form.telefono.trim() ? (
              <span className="text-xs text-rose-500">El teléfono es obligatorio.</span>
            ) : null}
          </label>

          <label className="grid gap-1">
            <span className="font-semibold text-zinc-600">Correo electrónico</span>
            <input
              type="email"
              value={form.correo}
              onChange={(event) => handleChange("correo", event.target.value)}
              className="rounded-xl border border-emerald-200/50 bg-white px-3 py-2 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="Ej. vendedor@carniceriacountry.mx"
            />
          </label>
          <label className="grid gap-1">
            <span className="font-semibold text-zinc-600">Sucursal / Zona</span>
            <input
              type="text"
              value={form.sucursal}
              onChange={(event) => handleChange("sucursal", event.target.value)}
              className="rounded-xl border border-emerald-200/50 bg-white px-3 py-2 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="Ej. Zona centro"
            />
          </label>

          <label className="grid gap-1">
            <span className="font-semibold text-zinc-600">Estado inicial</span>
            <select
              value={form.estado}
              onChange={(event) =>
                handleChange("estado", event.target.value as SellerRecord["estado"])
              }
              className="rounded-xl border border-emerald-200/70 bg-white px-3 py-2 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option value="Activo">Activo</option>
              <option value="En capacitación">En capacitación</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </label>

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="rounded-xl border border-emerald-200/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600 transition hover:bg-emerald-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-emerald-700"
            >
              Guardar vendedor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

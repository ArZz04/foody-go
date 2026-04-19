"use client";

import {
  BarChart3,
  ClipboardList,
  Eye,
  FileText,
  Filter,
  PackagePlus,
  Pencil,
  Plus,
  Search,
  Store,
  UsersRound,
  X,
} from "lucide-react";
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
  { label: "Pedidos hoy", value: "24", delta: "+8%", tone: "orange" },
  {
    label: "En preparación",
    value: "5",
    delta: "En preparación",
    tone: "amber",
  },
  { label: "Ingresos", value: "$12,360", delta: "Semana actual", tone: "sky" },
  {
    label: "Cortes",
    value: "2 cortes",
    delta: "Resumen inventario",
    tone: "rose",
  },
] as const;

const ACTION_STYLES = [
  {
    icon: Plus,
    className: "bg-orange-600 text-white hover:bg-orange-700",
  },
  {
    icon: PackagePlus,
    className: "bg-blue-500 text-white hover:bg-blue-600",
  },
  {
    icon: ClipboardList,
    className: "bg-amber-400 text-white hover:bg-amber-500",
  },
  {
    icon: FileText,
    className: "bg-emerald-500 text-white hover:bg-emerald-600",
  },
  {
    icon: BarChart3,
    className: "bg-violet-500 text-white hover:bg-violet-600",
  },
  {
    icon: BarChart3,
    className: "bg-rose-500 text-white hover:bg-rose-600",
  },
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
  items: Array<{
    nombre: string;
    cantidad: number;
    precio: string;
    extras?: string;
  }>;
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
      {
        nombre: "Rib Eye Prime 350g",
        cantidad: 4,
        precio: "$760",
        extras: "Alto vacío individual",
      },
      {
        nombre: "Chorizo artesanal 1kg",
        cantidad: 1,
        precio: "$122",
        extras: "Picar en piezas pequeñas",
      },
      {
        nombre: "Costillas BBQ marinado 1.5kg",
        cantidad: 1,
        precio: "$100",
        extras: "Añadir salsa extra",
      },
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
      {
        nombre: "Tomahawk 1.2kg",
        cantidad: 1,
        precio: "$460",
        extras: "Seleccionar con buena infiltración",
      },
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
      {
        nombre: "Hamburguesas gourmet 150g",
        cantidad: 6,
        precio: "$174",
        extras: "Agregar tocino ahumado",
      },
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

type ManagerSection = "dashboard" | "orders" | "team";

type NewOrderData = {
  cliente: string;
  direccion: string;
  metodoPago: string;
  itemNombre: string;
  cantidad: number;
  precio: number;
  notas?: string;
};

const INITIAL_SELLERS: SellerRecord[] = [
  {
    id: 1,
    nombre: "Laura Méndez",
    telefono: "33 1234 5678",
    pedidos: 128,
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Óscar Ramírez",
    telefono: "33 2109 8785",
    pedidos: 94,
    estado: "En capacitación",
  },
  {
    id: 3,
    nombre: "María Torres",
    telefono: "33 4456 6677",
    pedidos: 173,
    estado: "Activo",
  },
  {
    id: 4,
    nombre: "Hugo Salas",
    telefono: "33 9900 1234",
    pedidos: 41,
    estado: "Inactivo",
  },
];

export default function ManagerPage() {
  const [orders, setOrders] = useState<OrderTicket[]>(INITIAL_ORDERS);
  const [openOrderId, setOpenOrderId] = useState<string | null>(
    INITIAL_ORDERS[0]?.id ?? null,
  );
  const [sellers, setSellers] = useState<SellerRecord[]>(INITIAL_SELLERS);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<OrderTicket | null>(null);
  const [editingOrder, setEditingOrder] = useState<OrderTicket | null>(null);
  const [activeSection, setActiveSection] =
    useState<ManagerSection>("dashboard");

  const quickActions = [
    {
      title: "Registrar nuevo vendedor",
      description: "Agrega datos básicos y asigna credenciales temporales.",
      onClick: () => setShowRegisterModal(true),
    },
    {
      title: "Agregar nuevo menú integrado temporalmente",
      description:
        "Carga productos temporales para activar ventas de inmediato.",
    },
    {
      title: "Programar capacitación",
      description: "Coordina sesiones virtuales o presenciales para tu equipo.",
    },
    {
      title: "Generar reporte de ventas",
      description:
        "Descarga un resumen de ingresos, pedidos y cortes vendidos.",
    },
    {
      title: "Actualizar catálogo de cortes",
      description:
        "Sincroniza precios, combos parrilleros y disponibilidad de productos.",
    },
    {
      title:
        "Promocionar integra tu POS para sincronizar disponibilidad en tiempo real",
      description:
        "Conecta inventario y disponibilidad entre sucursal y Gogi Eats.",
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

  const handleOpenNewOrder = () => {
    setActiveSection("orders");
    setShowOrderModal(true);
  };

  const handleManageStore = () => {
    setActiveSection("team");
  };

  const handleCreateOrder = (data: NewOrderData) => {
    const now = new Date();
    const idNumber = Math.floor(1000 + Math.random() * 9000);
    const newOrder: OrderTicket = {
      id: `FO-${idNumber}`,
      negocio: CURRENT_BUSINESS.name,
      total: `$${data.precio * data.cantidad}`,
      estado: "Preparando",
      hora: now.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      cliente: data.cliente,
      metodoPago: data.metodoPago,
      direccion: data.direccion,
      notas: data.notas,
      items: [
        {
          nombre: data.itemNombre,
          cantidad: data.cantidad,
          precio: `$${data.precio * data.cantidad}`,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setOpenOrderId(newOrder.id);
    setActiveSection("dashboard");
    setShowOrderModal(false);
  };

  const getEditableOrderData = (order: OrderTicket): NewOrderData => {
    const firstItem = order.items[0];
    const lineTotal =
      Number(firstItem?.precio.replace(/[^\d.]/g, "")) ||
      Number(order.total.replace(/[^\d.]/g, "")) ||
      0;
    const quantity = firstItem?.cantidad ?? 1;

    return {
      cliente: order.cliente,
      direccion: order.direccion,
      metodoPago: order.metodoPago,
      itemNombre: firstItem?.nombre ?? "",
      cantidad: quantity,
      precio: lineTotal / quantity,
      notas: order.notas,
    };
  };

  const handleUpdateOrder = (data: NewOrderData) => {
    if (!editingOrder) return;

    const total = data.precio * data.cantidad;
    setOrders((prev) =>
      prev.map((order) =>
        order.id === editingOrder.id
          ? {
              ...order,
              total: `$${total}`,
              cliente: data.cliente,
              metodoPago: data.metodoPago,
              direccion: data.direccion,
              notas: data.notas,
              items: [
                {
                  nombre: data.itemNombre,
                  cantidad: data.cantidad,
                  precio: `$${total}`,
                },
              ],
            }
          : order,
      ),
    );
    setEditingOrder(null);
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
      <main className="min-h-screen bg-[#f5f6f5] text-slate-950">
        <section className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400 text-white shadow-xl shadow-orange-900/15">
          <div className="mx-auto max-w-7xl px-4 pb-28 pt-12 sm:px-6 lg:px-8">
            <div className="max-w-5xl space-y-6">
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-white/85">
                Panel de vendedor - {CURRENT_BUSINESS.name}
              </p>
              <div className="space-y-4">
                <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-5xl">
                  Gestión de pedidos para carnicería premium
                </h1>
                <p className="max-w-4xl text-lg font-semibold leading-8 text-white/90">
                  Supervisa pedidos existentes, coordina vendedores y controla
                  tu inventario de cortes premium. Consulta entregas por día,
                  API para carne con información balanceada por sucursal.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleOpenNewOrder}
                  className="inline-flex items-center gap-3 rounded-2xl bg-white px-7 py-4 text-sm font-extrabold text-orange-600 shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-50"
                >
                  <Plus className="h-5 w-5" />
                  Agregar pedido
                </button>
                <button
                  type="button"
                  onClick={handleManageStore}
                  className="inline-flex items-center gap-3 rounded-2xl bg-orange-800/35 px-7 py-4 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-900/35"
                >
                  <ClipboardList className="h-5 w-5" />
                  Administrar tienda
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                <HeroBadge>Producto en vivo</HeroBadge>
                <HeroBadge tone="white">
                  Última sincronización: hace 5 min
                </HeroBadge>
              </div>
            </div>
          </div>
        </section>

        <div
          id="dashboard"
          className="mx-auto -mt-16 flex max-w-7xl flex-col gap-8 px-4 pb-16 sm:px-6 lg:px-8"
        >
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {METRICS.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </section>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveSection("dashboard")}
              className={`inline-flex items-center gap-3 rounded-2xl px-6 py-4 text-sm font-extrabold shadow-sm transition hover:bg-orange-50 ${
                activeSection === "dashboard"
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-900/15 hover:bg-orange-600"
                  : "bg-white text-slate-700"
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("orders")}
              className={`inline-flex items-center gap-3 rounded-2xl px-6 py-4 text-sm font-extrabold shadow-sm transition hover:bg-orange-50 ${
                activeSection === "orders"
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-900/15 hover:bg-orange-600"
                  : "bg-white text-slate-700"
              }`}
            >
              <Store className="h-5 w-5" />
              Pedidos
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("team")}
              className={`inline-flex items-center gap-3 rounded-2xl px-6 py-4 text-sm font-extrabold shadow-sm transition hover:bg-orange-50 ${
                activeSection === "team"
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-900/15 hover:bg-orange-600"
                  : "bg-white text-slate-700"
              }`}
            >
              <UsersRound className="h-5 w-5" />
              Equipo
            </button>
          </div>

          {activeSection === "dashboard" ? (
            <section className="grid gap-6 lg:grid-cols-[1.05fr,1fr]">
              <div className="rounded-[24px] bg-white p-5 shadow-2xl shadow-slate-900/10 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-black">Pedidos del negocio</h2>
                    <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
                      Monitorea tu progreso, cierra pedidos listos y visualiza
                      lo ordenado.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveSection("orders")}
                    className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-orange-600"
                  >
                    Ver historial
                    <span aria-hidden>›</span>
                  </button>
                </div>

                <ul className="mt-6 grid gap-3 text-sm">
                  {orders.map((order) => {
                    const isOpen = openOrderId === order.id;
                    return (
                      <li
                        key={order.id}
                        className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-orange-200 hover:shadow-md"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setOpenOrderId(isOpen ? null : order.id)
                          }
                          className="flex w-full flex-wrap items-start justify-between gap-4 text-left"
                        >
                          <div>
                            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">
                              Pedido
                            </p>
                            <p className="mt-2 text-lg font-black text-slate-950">
                              {order.negocio}
                            </p>
                            <p className="text-xs font-semibold text-slate-400">
                              Actualizado a las {order.hora} h
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-base font-black text-orange-600">
                              #{order.id.replace("FO-", "")}
                            </p>
                            <OrderStatusBadge status={order.estado} />
                          </div>
                        </button>
                        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                          <span className="text-sm font-semibold text-slate-500">
                            Total
                          </span>
                          <span className="text-xl font-black text-slate-950">
                            {order.total}
                          </span>
                        </div>
                        {isOpen ? (
                          <div className="mt-4 grid gap-4 rounded-2xl bg-orange-50 p-4 text-sm text-slate-600 sm:grid-cols-[1.1fr,0.9fr]">
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-orange-600">
                                  Cliente
                                </p>
                                <p className="mt-1 font-bold text-slate-800">
                                  {order.cliente}
                                </p>
                                <p className="text-slate-500">
                                  {order.metodoPago}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-orange-600">
                                  Entrega
                                </p>
                                <p className="mt-1 text-slate-600">
                                  {order.direccion}
                                </p>
                                {order.notas ? (
                                  <p className="mt-1 text-slate-500">
                                    Notas: {order.notas}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                            <div className="rounded-2xl bg-white p-4 shadow-sm">
                              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-orange-600">
                                Ticket del pedido
                              </p>
                              <ul className="mt-3 space-y-2">
                                {order.items.map((item, index) => (
                                  <li
                                    key={`${order.id}-${index}`}
                                    className="flex justify-between gap-3"
                                  >
                                    <span className="font-semibold">
                                      {item.cantidad}x {item.nombre}
                                    </span>
                                    <span className="font-bold">
                                      {item.precio}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                              <div className="mt-3 flex flex-wrap gap-2 border-t border-orange-100 pt-3">
                                <button
                                  type="button"
                                  className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-orange-300"
                                  onClick={() => handleOrderReady(order.id)}
                                  disabled={order.deliveryRequested}
                                >
                                  Pedido listo
                                </button>
                                <button
                                  type="button"
                                  className="rounded-xl bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-orange-600 ring-1 ring-orange-200 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:text-orange-300"
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

              <aside className="rounded-[24px] bg-white p-5 shadow-2xl shadow-slate-900/10 sm:p-6">
                <h2 className="text-2xl font-black">Acciones rápidas</h2>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
                  Completa tu respuesta a los pedidos y coordina la logística.
                </p>
                <div className="mt-6 grid gap-4">
                  {quickActions.map((action, index) => {
                    const style =
                      ACTION_STYLES[index % ACTION_STYLES.length] ??
                      ACTION_STYLES[0];
                    const Icon = style.icon;
                    return (
                      <button
                        key={action.title}
                        type="button"
                        onClick={action.onClick}
                        title={action.description}
                        className={`inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl px-5 py-4 text-center text-sm font-extrabold shadow-lg transition hover:-translate-y-0.5 ${style.className}`}
                      >
                        <Icon className="h-5 w-5 flex-none" />
                        {action.title}
                      </button>
                    );
                  })}
                </div>
              </aside>
            </section>
          ) : null}

          {activeSection === "orders" ? (
            <section className="rounded-[22px] border border-orange-100 bg-orange-50/60 p-4 shadow-xl shadow-orange-900/10 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-black">Todos los pedidos</h2>
                <button
                  type="button"
                  onClick={handleOpenNewOrder}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 text-sm font-extrabold text-white shadow-lg shadow-orange-900/15 transition hover:bg-orange-700"
                >
                  <Plus className="h-4 w-4" />
                  Nuevo pedido
                </button>
              </div>

              <div className="mt-4 grid gap-2 lg:grid-cols-[1fr,10rem]">
                <label className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    placeholder="Buscar pedidos..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  />
                </label>
                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-800 transition hover:bg-orange-50"
                >
                  <Filter className="h-4 w-4" />
                  Filtros
                </button>
              </div>

              <ul className="mt-5 grid gap-2.5">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="grid items-center gap-3 rounded-xl border border-orange-200/80 bg-white px-4 py-3 shadow-sm ring-1 ring-white transition hover:border-orange-400 hover:shadow-md sm:grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_auto]"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-black text-slate-950">
                          #{order.id.replace("FO-", "")}
                        </p>
                        <OrderStatusBadge status={order.estado} />
                      </div>
                      <p className="mt-0.5 truncate text-sm font-extrabold text-slate-700">
                        {order.negocio}
                      </p>
                      <p className="truncate text-xs font-semibold text-slate-500">
                        {order.cliente} · {order.hora} h
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-950 px-4 py-2 text-left text-white sm:text-right">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-white/65">
                        Total
                      </p>
                      <p className="text-xl font-black leading-none">
                        {order.total}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 sm:justify-end">
                      <button
                        type="button"
                        onClick={() => setViewingOrder(order)}
                        aria-label={`Ver pedido ${order.id}`}
                        className="inline-flex size-9 items-center justify-center rounded-full bg-orange-100 text-orange-700 transition hover:bg-orange-200"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingOrder(order)}
                        aria-label={`Editar pedido ${order.id}`}
                        className="inline-flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {activeSection === "team" ? (
            <section id="equipo" className="grid gap-6">
              <div className="rounded-[24px] bg-white p-5 shadow-2xl shadow-slate-900/10 sm:p-6 lg:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-slate-950">
                      Equipo de vendedores
                    </h2>
                    <p className="mt-4 text-lg font-semibold leading-7 text-slate-500">
                      Controla tu catálogo de tus vendedores y su desempeño
                      acumulado.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-2xl bg-orange-600 px-7 py-4 text-sm font-extrabold uppercase tracking-wide text-white shadow-lg shadow-orange-900/15 transition hover:bg-orange-700"
                  >
                    Exportar reporte
                  </button>
                </div>
                <div className="mt-8 overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="text-left text-xs font-extrabold uppercase tracking-[0.14em] text-orange-600">
                      <tr>
                        <th className="px-5 py-4">Vendedor</th>
                        <th className="px-5 py-4">Contacto</th>
                        <th className="px-5 py-4">Pedidos</th>
                        <th className="px-5 py-4">Estado</th>
                        <th className="px-5 py-4">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {sellers.map((seller) => (
                        <tr
                          key={seller.id}
                          className="transition hover:bg-orange-50/40"
                        >
                          <td className="px-5 py-5 text-base font-black text-slate-950">
                            {seller.nombre}
                          </td>
                          <td className="px-5 py-5 text-base font-semibold text-slate-500">
                            {seller.telefono}
                          </td>
                          <td className="px-5 py-5 text-xl font-black text-orange-600">
                            {seller.pedidos}
                          </td>
                          <td className="px-5 py-5">
                            <SellerBadge estado={seller.estado} />
                          </td>
                          <td className="px-5 py-5">
                            <div className="flex gap-3">
                              <button
                                type="button"
                                className="text-sm font-extrabold text-orange-600 transition hover:text-orange-700"
                              >
                                Ver perfil
                              </button>
                              <button
                                type="button"
                                className="text-sm font-extrabold text-slate-500 transition hover:text-slate-700"
                              >
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

              <div className="rounded-[24px] border border-orange-200 bg-orange-50/80 p-5 shadow-sm sm:p-6 lg:p-8">
                <h2 className="text-2xl font-black text-orange-950">
                  Información de contacto
                </h2>
                <p className="mt-4 text-base font-semibold leading-7 text-orange-900/80">
                  Manténla actualizada para que los clientes y repartidores te
                  localicen fácilmente.
                </p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/85 px-4 py-3">
                    <dt className="font-semibold text-zinc-600">
                      Correo principal
                    </dt>
                    <dd className="text-zinc-500">{CURRENT_BUSINESS.email}</dd>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/85 px-4 py-3">
                    <dt className="font-semibold text-zinc-600">Teléfono</dt>
                    <dd className="text-zinc-500">{CURRENT_BUSINESS.phone}</dd>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/85 px-4 py-3">
                    <dt className="font-semibold text-zinc-600">
                      Horario de atención
                    </dt>
                    <dd className="text-zinc-500">{CURRENT_BUSINESS.hours}</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  className="mt-4 w-full rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-orange-600 shadow-sm transition hover:bg-orange-100"
                >
                  Actualizar información
                </button>
                <div className="mt-5 rounded-2xl border border-orange-200/70 bg-white/70 p-5 text-sm text-orange-900">
                  <h3 className="text-base font-semibold">
                    Sugerencia de mejora
                  </h3>
                  <p className="mt-2">
                    Activa alertas en WhatsApp para pedidos VIP y reduce el
                    tiempo de confirmación en horas de mayor demanda.
                  </p>
                  <button
                    type="button"
                    className="mt-4 rounded-full border border-orange-300/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-orange-600 transition hover:bg-white"
                  >
                    Configurar alertas
                  </button>
                </div>
              </div>
            </section>
          ) : null}
        </div>
      </main>
      <RegisterSellerModal
        open={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSubmit={handleCreateSeller}
      />
      <NewOrderModal
        open={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        onSubmit={handleCreateOrder}
      />
      <OrderDetailModal
        order={viewingOrder}
        onClose={() => setViewingOrder(null)}
        onEdit={(order) => {
          setViewingOrder(null);
          setEditingOrder(order);
        }}
      />
      <NewOrderModal
        key={editingOrder?.id ?? "edit-order"}
        open={Boolean(editingOrder)}
        onClose={() => setEditingOrder(null)}
        onSubmit={handleUpdateOrder}
        initialData={editingOrder ? getEditableOrderData(editingOrder) : null}
        title="Editar pedido"
        description="Actualiza los datos principales del pedido seleccionado."
        submitLabel="Guardar cambios"
      />
    </>
  );
}

function HeroBadge({
  children,
  tone = "orange",
}: {
  children: ReactNode;
  tone?: "orange" | "white";
}) {
  const styles =
    tone === "white"
      ? "border-white/60 bg-white/15 text-white/80"
      : "border-orange-100/70 bg-white/10 text-white";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${styles}`}
    >
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
  tone: "orange" | "amber" | "sky" | "rose";
}) {
  const palette =
    tone === "orange"
      ? "from-orange-200/80 via-orange-300/60 to-orange-400/40 text-orange-700"
      : tone === "amber"
        ? "from-amber-200/80 via-amber-300/60 to-amber-400/40 text-amber-700"
        : tone === "sky"
          ? "from-sky-200/80 via-sky-300/60 to-sky-400/40 text-sky-700"
          : "from-rose-200/80 via-rose-300/60 to-rose-400/40 text-rose-700";

  return (
    <div
      className={`overflow-hidden rounded-[22px] bg-gradient-to-br ${palette} p-[1px]`}
    >
      <div className="relative h-full rounded-[20px] bg-white/95 p-5 shadow-sm ring-1 ring-white/70 backdrop-blur">
        <div className="pointer-events-none absolute -top-12 right-0 size-24 rounded-full bg-white/40 blur-3xl" />
        <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">
          {label}
        </p>
        <h3 className="mt-3 text-3xl font-semibold text-zinc-800">{value}</h3>
        <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          {delta}
        </span>
      </div>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const theme = normalized.includes("listo")
    ? "bg-rose-50 text-rose-600"
    : normalized.includes("enviado")
      ? "bg-amber-50 text-amber-600"
      : normalized.includes("pagado")
        ? "bg-emerald-50 text-emerald-600"
        : "bg-orange-50 text-orange-600";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide ${theme}`}
    >
      {status}
    </span>
  );
}

function SellerBadge({ estado }: { estado: string }) {
  const normalized = estado.toLowerCase();
  const theme =
    normalized === "activo"
      ? "bg-orange-100/70 text-orange-700"
      : normalized === "en capacitación"
        ? "bg-amber-100/70 text-amber-700"
        : "bg-zinc-200/70 text-zinc-600";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-white/50 px-3 py-1 text-xs font-semibold backdrop-blur ${theme}`}
    >
      <span className="size-2 rounded-full bg-current" />
      {estado}
    </span>
  );
}

function NewOrderModal({
  open,
  onClose,
  onSubmit,
  initialData,
  title = "Agregar pedido",
  description = "Registra un pedido manual para prepararlo y pedir repartidor.",
  submitLabel = "Crear pedido",
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: NewOrderData) => void;
  initialData?: NewOrderData | null;
  title?: string;
  description?: string;
  submitLabel?: string;
}) {
  const initialForm = {
    cliente: initialData?.cliente ?? "",
    direccion: initialData?.direccion ?? "",
    metodoPago: initialData?.metodoPago ?? "Efectivo",
    itemNombre: initialData?.itemNombre ?? "",
    cantidad: String(initialData?.cantidad ?? 1),
    precio: initialData?.precio ? String(initialData.precio) : "",
    notas: initialData?.notas ?? "",
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

  const quantity = Number(form.cantidad);
  const price = Number(form.precio);
  const isValid =
    form.cliente.trim() &&
    form.direccion.trim() &&
    form.itemNombre.trim() &&
    Number.isFinite(quantity) &&
    quantity > 0 &&
    Number.isFinite(price) &&
    price > 0;

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    if (!isValid) {
      return;
    }

    onSubmit({
      cliente: form.cliente.trim(),
      direccion: form.direccion.trim(),
      metodoPago: form.metodoPago,
      itemNombre: form.itemNombre.trim(),
      cantidad: quantity,
      precio: price,
      notas: form.notas.trim() || undefined,
    });
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/40 bg-white/95 shadow-2xl ring-1 ring-white/70">
        <div className="flex items-center justify-between bg-orange-600/10 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-orange-800">{title}</h2>
            <p className="text-xs text-zinc-500">{description}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex size-8 items-center justify-center rounded-full border border-orange-200/70 text-orange-700 transition hover:bg-orange-50"
            aria-label="Cerrar nuevo pedido"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 px-6 py-6 text-sm sm:grid-cols-2"
        >
          <label className="grid gap-1">
            <span className="font-semibold text-zinc-600">Cliente *</span>
            <input
              type="text"
              value={form.cliente}
              onChange={(event) => handleChange("cliente", event.target.value)}
              className="rounded-xl border border-orange-200/70 bg-white px-3 py-2 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="Ej. Fernanda Ruiz"
              required
            />
            {touched && !form.cliente.trim() ? (
              <span className="text-xs text-rose-500">
                El cliente es obligatorio.
              </span>
            ) : null}
          </label>

          <label className="grid gap-1">
            <span className="font-semibold text-zinc-600">Método de pago</span>
            <select
              value={form.metodoPago}
              onChange={(event) =>
                handleChange("metodoPago", event.target.value)
              }
              className="rounded-xl border border-orange-200/70 bg-white px-3 py-2 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia SPEI">Transferencia SPEI</option>
              <option value="PayPal">PayPal</option>
            </select>
          </label>

          <label className="grid gap-1 sm:col-span-2">
            <span className="font-semibold text-zinc-600">
              Dirección de entrega *
            </span>
            <input
              type="text"
              value={form.direccion}
              onChange={(event) =>
                handleChange("direccion", event.target.value)
              }
              className="rounded-xl border border-orange-200/70 bg-white px-3 py-2 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="Calle, colonia, municipio"
              required
            />
            {touched && !form.direccion.trim() ? (
              <span className="text-xs text-rose-500">
                La dirección es obligatoria.
              </span>
            ) : null}
          </label>

          <label className="grid gap-1 sm:col-span-2">
            <span className="font-semibold text-zinc-600">Producto *</span>
            <input
              type="text"
              value={form.itemNombre}
              onChange={(event) =>
                handleChange("itemNombre", event.target.value)
              }
              className="rounded-xl border border-orange-200/70 bg-white px-3 py-2 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="Ej. Rib Eye Prime 350g"
              required
            />
            {touched && !form.itemNombre.trim() ? (
              <span className="text-xs text-rose-500">
                El producto es obligatorio.
              </span>
            ) : null}
          </label>

          <label className="grid gap-1">
            <span className="font-semibold text-zinc-600">Cantidad *</span>
            <input
              type="number"
              min="1"
              step="1"
              value={form.cantidad}
              onChange={(event) => handleChange("cantidad", event.target.value)}
              className="rounded-xl border border-orange-200/70 bg-white px-3 py-2 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
              required
            />
            {touched && (!Number.isFinite(quantity) || quantity <= 0) ? (
              <span className="text-xs text-rose-500">
                Ingresa una cantidad válida.
              </span>
            ) : null}
          </label>

          <label className="grid gap-1">
            <span className="font-semibold text-zinc-600">
              Precio unitario *
            </span>
            <input
              type="number"
              min="1"
              step="0.01"
              value={form.precio}
              onChange={(event) => handleChange("precio", event.target.value)}
              className="rounded-xl border border-orange-200/70 bg-white px-3 py-2 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="0.00"
              required
            />
            {touched && (!Number.isFinite(price) || price <= 0) ? (
              <span className="text-xs text-rose-500">
                Ingresa un precio válido.
              </span>
            ) : null}
          </label>

          <label className="grid gap-1 sm:col-span-2">
            <span className="font-semibold text-zinc-600">Notas</span>
            <textarea
              value={form.notas}
              onChange={(event) => handleChange("notas", event.target.value)}
              className="min-h-24 rounded-xl border border-orange-200/70 bg-white px-3 py-2 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="Indicaciones de empaque o entrega"
            />
          </label>

          <div className="mt-2 flex justify-end gap-2 sm:col-span-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-orange-200/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-orange-600 transition hover:bg-orange-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-orange-700"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function OrderDetailModal({
  order,
  onClose,
  onEdit,
}: {
  order: OrderTicket | null;
  onClose: () => void;
  onEdit: (order: OrderTicket) => void;
}) {
  if (!order) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-[28px] border border-white/40 bg-white shadow-2xl ring-1 ring-white/70">
        <div className="flex items-center justify-between bg-orange-600/10 px-6 py-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-600">
              Pedido {order.id}
            </p>
            <h2 className="mt-1 text-xl font-black text-slate-950">
              {order.cliente}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-full border border-orange-200/70 text-orange-700 transition hover:bg-orange-50"
            aria-label="Cerrar detalle de pedido"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-5 px-6 py-6 text-sm text-slate-600">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-950 px-5 py-4 text-white">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-white/60">
                Estado
              </p>
              <p className="text-base font-black">{order.estado}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs font-bold uppercase tracking-wide text-white/60">
                Total
              </p>
              <p className="text-3xl font-black">{order.total}</p>
            </div>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
              <dt className="text-xs font-extrabold uppercase tracking-wide text-orange-600">
                Negocio
              </dt>
              <dd className="mt-1 font-bold text-slate-800">{order.negocio}</dd>
            </div>
            <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
              <dt className="text-xs font-extrabold uppercase tracking-wide text-orange-600">
                Pago
              </dt>
              <dd className="mt-1 font-bold text-slate-800">
                {order.metodoPago}
              </dd>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:col-span-2">
              <dt className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Entrega
              </dt>
              <dd className="mt-1 font-semibold text-slate-700">
                {order.direccion}
              </dd>
            </div>
          </dl>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Ticket
            </p>
            <ul className="mt-3 grid gap-2">
              {order.items.map((item, index) => (
                <li
                  key={`${order.id}-detail-${index}`}
                  className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2"
                >
                  <div>
                    <p className="font-bold text-slate-800">
                      {item.cantidad}x {item.nombre}
                    </p>
                    {item.extras ? (
                      <p className="text-xs text-slate-500">{item.extras}</p>
                    ) : null}
                  </div>
                  <span className="font-black text-slate-950">
                    {item.precio}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {order.notas ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-extrabold uppercase tracking-wide text-amber-700">
                Notas
              </p>
              <p className="mt-1 font-semibold text-amber-900">{order.notas}</p>
            </div>
          ) : null}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-orange-200/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-orange-600 transition hover:bg-orange-50"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={() => onEdit(order)}
              className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-orange-700"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
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
        <div className="flex items-center justify-between bg-orange-600/10 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-orange-800">
              Registrar nuevo vendedor
            </h2>
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
            className="inline-flex size-8 items-center justify-center rounded-full border border-orange-200/70 text-orange-700 transition hover:bg-orange-50"
            aria-label="Cerrar registro de vendedor"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 px-6 py-6 text-sm">
          <label className="grid gap-1">
            <span className="font-semibold text-zinc-600">
              Nombre completo *
            </span>
            <input
              type="text"
              value={form.nombre}
              onChange={(event) => handleChange("nombre", event.target.value)}
              className="rounded-xl border border-orange-200/70 bg-white px-3 py-2 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="Ej. Karla Hernández"
              required
            />
            {touched && !form.nombre.trim() ? (
              <span className="text-xs text-rose-500">
                El nombre es obligatorio.
              </span>
            ) : null}
          </label>

          <label className="grid gap-1">
            <span className="font-semibold text-zinc-600">
              Teléfono de contacto *
            </span>
            <input
              type="tel"
              value={form.telefono}
              onChange={(event) => handleChange("telefono", event.target.value)}
              className="rounded-xl border border-orange-200/70 bg-white px-3 py-2 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="Ej. 33 1234 5678"
              required
            />
            {touched && !form.telefono.trim() ? (
              <span className="text-xs text-rose-500">
                El teléfono es obligatorio.
              </span>
            ) : null}
          </label>

          <label className="grid gap-1">
            <span className="font-semibold text-zinc-600">
              Correo electrónico
            </span>
            <input
              type="email"
              value={form.correo}
              onChange={(event) => handleChange("correo", event.target.value)}
              className="rounded-xl border border-orange-200/50 bg-white px-3 py-2 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="Ej. vendedor@carniceriacountry.mx"
            />
          </label>
          <label className="grid gap-1">
            <span className="font-semibold text-zinc-600">Sucursal / Zona</span>
            <input
              type="text"
              value={form.sucursal}
              onChange={(event) => handleChange("sucursal", event.target.value)}
              className="rounded-xl border border-orange-200/50 bg-white px-3 py-2 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="Ej. Zona centro"
            />
          </label>

          <label className="grid gap-1">
            <span className="font-semibold text-zinc-600">Estado inicial</span>
            <select
              value={form.estado}
              onChange={(event) =>
                handleChange(
                  "estado",
                  event.target.value as SellerRecord["estado"],
                )
              }
              className="rounded-xl border border-orange-200/70 bg-white px-3 py-2 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
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
              className="rounded-xl border border-orange-200/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-orange-600 transition hover:bg-orange-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-orange-700"
            >
              Guardar vendedor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

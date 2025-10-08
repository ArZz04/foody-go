"use client";

import { useMemo } from "react";

import { useOrders } from "@/context/OrdersContext";
import { useState } from "react";

const statusStyles: Record<string, string> = {
  "En camino": "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/30",
  "Listo para recoger":
    "bg-amber-500/10 text-amber-300 ring-1 ring-amber-400/30",
  "Asignar repartidor":
    "bg-slate-500/10 text-slate-200 ring-1 ring-slate-400/30",
  Completado: "bg-slate-500/10 text-slate-200 ring-1 ring-slate-400/30",
};

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function DeliveryPage() {
  const { orders } = useOrders();
  const [isAvailable, setIsAvailable] = useState(true);

  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [orders],
  );

  const metrics = useMemo(() => {
    const activeOrders = sortedOrders.filter(
      (order) => order.status !== "Completado",
    );
    const unassigned = sortedOrders.filter(
      (order) => order.status === "Asignar repartidor",
    );
    const cashToCollect = sortedOrders
      .filter((order) => order.payment.status === "Pendiente de cobro")
      .reduce((acc, order) => acc + order.payment.amountToCollect, 0);

    return [
      {
        label: "Pedidos activos",
        value: activeOrders.length,
        trend: activeOrders.length
          ? "Actualizado en vivo"
          : "Sin pedidos activos",
      },
      {
        label: "Pendientes por asignar",
        value: unassigned.length,
        trend: unassigned.length
          ? "Prioriza los más antiguos"
          : "Todos asignados",
      },
      {
        label: "Cobro en efectivo",
        value: `MX$${cashToCollect.toFixed(2)}`,
        trend: cashToCollect
          ? "Verifica cambio disponible"
          : "Sin cobros pendientes",
      },
    ];
  }, [sortedOrders]);

  const lastUpdateLabel = sortedOrders[0]
    ? new Date(sortedOrders[0].updatedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Foody Go / Repartidor
            </p>
            <h1 className="mt-2 text-4xl font-semibold text-white">
              Panel del Repartidor
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Aquí puedes revisar tus pedidos activos, confirmar recolecciones y
              entregas, y verificar si necesitas cobrar al momento. Cada nuevo
              pedido que confirme el cliente aparecerá automáticamente.
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-3 self-start text-sm sm:flex-row sm:items-center sm:gap-4">
            <button
              type="button"
              onClick={() => setIsAvailable((prev) => !prev)}
              className={classNames(
                "flex items-center gap-2 rounded-lg border px-3 py-2 font-medium transition",
                isAvailable
                  ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
                  : "border-rose-400/40 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20",
              )}
            >
              <span className="inline-block h-2 w-2 rounded-full bg-current" />
              {isAvailable ? "En servicio" : "Fuera de servicio"}
            </button>
            <button
              type="button"
              className="rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/20"
            >
              Despachar pedido
            </button>
            <button
              type="button"
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-900"
            >
              Ver historial
            </button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg shadow-black/30"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {metric.label}
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">
                {metric.value}
              </p>
              <p className="mt-1 text-xs text-slate-500">{metric.trend}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-black/30">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Pedidos activos
                </h2>
                <p className="text-sm text-slate-500">
                  Última actualización {lastUpdateLabel} hrs
                </p>
              </div>
              <div className="flex gap-2 text-xs text-slate-400">
                <span className="rounded-md border border-emerald-400/40 bg-emerald-500/10 px-2 py-1 text-emerald-200">
                  En camino
                </span>
                <span className="rounded-md border border-amber-400/40 bg-amber-500/10 px-2 py-1 text-amber-200">
                  Listo
                </span>
                <span className="rounded-md border border-slate-400/20 bg-slate-500/10 px-2 py-1 text-slate-200">
                  Sin asignar
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col divide-y divide-slate-800">
              {sortedOrders.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-500">
                  Todavía no hay pedidos confirmados. Cuando un cliente realice
                  un pedido desde Foody Go aparecerá aquí al instante.
                </div>
              ) : (
                sortedOrders.map((order) => (
                  <article
                    key={order.id}
                    className="flex flex-col gap-5 py-5 md:flex-row md:items-start md:justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                          {order.id}
                        </span>
                        <span
                          className={classNames(
                            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
                            statusStyles[order.status] ??
                              "bg-slate-500/20 text-slate-200",
                          )}
                        >
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                          {order.status}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(order.updatedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                            Recolectar en
                          </p>
                          <p className="text-sm font-semibold text-white">
                            {order.pickup.name ?? "Pendiente"}
                          </p>
                          <p className="text-sm text-slate-400">
                            {order.pickup.address}
                            {order.pickup.neighborhood
                              ? ` · ${order.pickup.neighborhood}`
                              : ""}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                            Entregar en
                          </p>
                          <p className="text-sm font-semibold text-white">
                            {order.customer.name}
                          </p>
                          <p className="text-sm text-slate-400">
                            {order.dropoff.address}
                            {order.dropoff.neighborhood
                              ? ` · ${order.dropoff.neighborhood}`
                              : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-400">
                        <span className="font-medium text-slate-300">
                          {order.customer.phone}
                        </span>
                        <span>ETA: {order.eta}</span>
                        <span>
                          Artículos:{" "}
                          {order.items
                            .map((item) => `${item.name} x${item.quantity}`)
                            .join(" · ")}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="rounded-full border border-slate-700 px-3 py-1 text-slate-200">
                          {order.payment.method}
                        </span>
                        <span
                          className={classNames(
                            "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]",
                            order.payment.status === "Pagado"
                              ? "bg-emerald-500/10 text-emerald-200 border border-emerald-400/40"
                              : "bg-amber-500/10 text-amber-200 border border-amber-400/40",
                          )}
                        >
                          {order.payment.status}
                        </span>
                        {order.payment.amountToCollect > 0 ? (
                          <span className="text-sm font-semibold text-amber-200">
                            Cobrar: MX$
                            {order.payment.amountToCollect.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">
                            Total: MX${order.total.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {order.instructions ? (
                        <p className="text-sm text-slate-500">
                          Nota: {order.instructions}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex w-full flex-col gap-2 md:max-w-[220px]">
                      <button
                        type="button"
                        className="w-full rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/20"
                      >
                        Marcar como entregado
                      </button>
                      <button
                        type="button"
                        className="w-full rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-900"
                      >
                        Contactar cliente
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          <aside className="flex h-full flex-col gap-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg shadow-black/30">
              <h2 className="text-lg font-semibold text-white">
                Asignaciones recientes
              </h2>
              <ul className="mt-4 space-y-4 text-sm text-slate-400">
                <li className="flex items-center justify-between">
                  <span>ORD-4829 → Alex P.</span>
                  <span className="text-xs text-slate-500">hace 2 min</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>ORD-4832 → Brenda L.</span>
                  <span className="text-xs text-slate-500">hace 6 min</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>ORD-4824 → Daniel G.</span>
                  <span className="text-xs text-slate-500">hace 12 min</span>
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg shadow-black/30">
              <h2 className="text-lg font-semibold text-white">Alertas</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-lg border border-amber-400/40 bg-amber-500/10 p-3 text-amber-200">
                  Revisa pedidos sin asignar para evitar retrasos.
                </div>
                <div className="rounded-lg border border-rose-400/40 bg-rose-500/10 p-3 text-rose-200">
                  Confirma cobros pendientes antes de entregar.
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
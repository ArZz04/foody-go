import { MapPin, Navigation, Package, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { DeliveryOrder } from "./types";

interface CurrentDeliveriesCardProps {
  orders: DeliveryOrder[];
}

const statusBadgeClass: Record<DeliveryOrder["status"], string> = {
  "En camino":
    "border border-orange-200/60 bg-orange-50/70 text-orange-700 backdrop-blur",
  "Listo para recoger":
    "border border-amber-200/60 bg-amber-50/70 text-amber-700 backdrop-blur",
  Pendiente:
    "border border-slate-200/60 bg-white/70 text-orange-800/70 backdrop-blur",
  Completado:
    "border border-slate-200/50 bg-white/60 text-orange-800/50 backdrop-blur",
};

const amountFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 2,
});

export function CurrentDeliveriesCard({ orders }: CurrentDeliveriesCardProps) {
  return (
    <Card className="overflow-hidden rounded-[24px] border border-slate-200 bg-white text-[#17231d] shadow-xl shadow-slate-900/5">
      <CardHeader className="border-b border-orange-200 bg-orange-50/80 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <Package className="h-5 w-5" />
            </span>
            <div>
              <CardTitle className="text-xl font-extrabold text-orange-900">
                Entregas actuales
              </CardTitle>
              <CardDescription className="text-sm text-orange-800/75">
                Pedidos asignados hoy y próximos pasos de ruta.
              </CardDescription>
            </div>
          </div>
          <div className="rounded-2xl bg-white px-5 py-3 text-center shadow-sm">
            <p className="text-3xl font-extrabold text-orange-600">
              {orders.length}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              entregas
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-5">
        {orders.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600">
            No tienes entregas asignadas en este momento.
          </p>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm font-bold text-slate-700">Ruta de hoy</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  className="h-9 rounded-full bg-orange-500 px-4 text-xs font-bold text-white hover:bg-orange-600"
                >
                  Pausar 30 min
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="h-9 rounded-full bg-slate-100 px-4 text-xs font-bold text-slate-700 hover:bg-slate-200"
                >
                  Ver detalle
                </Button>
              </div>
            </div>
            <ul className="space-y-3">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-orange-200 hover:shadow-md"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                        Resumen #{order.id}
                      </p>
                      <p className="mt-1 text-lg font-extrabold text-slate-950">
                        {amountFormatter.format(order.amount)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Badge
                        variant="outline"
                        className={statusBadgeClass[order.status]}
                      >
                        {order.status}
                      </Badge>
                      <span className="text-xs text-orange-800/70">
                        ETA {order.eta}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-[1fr,0.85fr]">
                    <div className="space-y-2">
                      <p className="text-base font-extrabold text-slate-950">
                        {order.contact.name}
                      </p>
                      <p className="text-sm font-semibold text-slate-500">
                        {order.contact.phone}
                      </p>
                      <p className="flex items-start gap-2 text-sm font-semibold text-slate-700">
                        <MapPin className="mt-0.5 h-4 w-4 flex-none text-orange-500" />
                        <span>
                          {order.address.street}
                          <br />
                          <span className="font-medium text-slate-500">
                            {order.address.neighborhood}, {order.address.city}
                          </span>
                        </span>
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                        Pago
                      </p>
                      <p className="mt-1 text-sm font-bold text-slate-700">
                        {order.paymentMethod}
                      </p>
                      {order.notes ? (
                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          {order.notes}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3">
                    <Button
                      type="button"
                      className="h-9 rounded-full bg-emerald-600 px-4 text-xs font-bold text-white hover:bg-emerald-700"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      Navegar
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-9 rounded-full bg-slate-100 px-4 text-xs font-bold text-slate-700 hover:bg-slate-200"
                    >
                      <PhoneCall className="h-3.5 w-3.5" />
                      Llamar
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="ml-auto h-9 rounded-full bg-orange-50 px-4 text-xs font-bold text-orange-700 hover:bg-orange-100"
                    >
                      Ver resumen
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

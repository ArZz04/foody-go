import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package } from "lucide-react";

import type { DeliveryOrder } from "./types";

interface CurrentDeliveriesCardProps {
  orders: DeliveryOrder[];
}

const statusBadgeClass: Record<DeliveryOrder["status"], string> = {
  "En camino":
    "border border-emerald-200/60 bg-emerald-50/70 text-emerald-700 backdrop-blur",
  "Listo para recoger":
    "border border-amber-200/60 bg-amber-50/70 text-amber-700 backdrop-blur",
  Pendiente:
    "border border-slate-200/60 bg-white/70 text-emerald-800/70 backdrop-blur",
  Completado:
    "border border-slate-200/50 bg-white/60 text-emerald-800/50 backdrop-blur",
};

const amountFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 2,
});

export function CurrentDeliveriesCard({ orders }: CurrentDeliveriesCardProps) {
  return (
    <Card className="overflow-hidden rounded-[26px] border border-white/20 bg-white/10 text-[#1f2d27] shadow-xl backdrop-blur-lg">
      <CardHeader className="border-b border-white/10 bg-gradient-to-r from-emerald-400/30 via-emerald-600/20 to-emerald-900/30 pb-6 text-white">
        <div className="flex items-start gap-3">
          <span className="mt-1 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-emerald-100 shadow-inner">
            <Package className="h-5 w-5" />
          </span>
          <div>
            <CardTitle className="text-lg font-semibold">
              Entregas actuales
            </CardTitle>
            <CardDescription className="text-sm text-white/80">
              Número de entregas asignadas hoy:
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        <p className="text-4xl font-semibold text-emerald-700">
          {orders.length}
        </p>
        <Button
          type="button"
          className="w-full rounded-xl border border-emerald-500/60 bg-emerald-500/80 text-sm font-semibold text-white shadow-lg backdrop-blur hover:bg-emerald-500"
        >
          Ver detalles
        </Button>
        {orders.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/30 bg-white/20 p-6 text-center text-sm text-emerald-900/80">
            No tienes entregas asignadas en este momento.
          </p>
        ) : (
          <div className="space-y-4 rounded-2xl border border-white/20 bg-white/40 p-4 shadow-inner">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-900/60">
              Resumen rápido
            </p>
            <ul className="space-y-3">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="rounded-xl border border-white/40 bg-white/70 p-4 shadow-lg backdrop-blur"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={statusBadgeClass[order.status]}
                      >
                        {order.status}
                      </Badge>
                      <span className="text-xs text-emerald-800/70">
                        ETA {order.eta}
                      </span>
                    </div>
                    <span className="text-xs font-medium uppercase tracking-[0.3em] text-emerald-900/40">
                      #{order.id}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1">
                    <p className="text-sm font-medium text-emerald-900">
                      {order.address.street}
                    </p>
                    <p className="text-xs text-emerald-800/70">
                      {order.address.neighborhood}, {order.address.city}
                    </p>
                    <p className="text-xs text-emerald-800/70">
                      Referencias: {order.address.references}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-emerald-800/70">
                    <div>
                      <p className="font-medium text-emerald-900">
                        {order.contact.name}
                      </p>
                      <p className="text-xs text-emerald-800/70">
                        {order.contact.phone}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-emerald-900">
                        {order.paymentMethod}
                      </p>
                      <p className="text-xs text-emerald-600">
                        {amountFormatter.format(order.amount)}
                      </p>
                    </div>
                  </div>

                  {order.notes ? (
                    <p className="mt-4 rounded-lg border border-dashed border-emerald-300/60 bg-emerald-50/70 p-3 text-xs text-emerald-800/80">
                      Nota: {order.notes}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

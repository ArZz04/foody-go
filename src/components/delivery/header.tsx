"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CirclePower, LogOut, MapPin, PackageSearch } from "lucide-react";

interface DeliveryHeaderProps {
  driverName?: string;
  serviceArea?: string;
  pendingOrders?: number;
  lastSync?: string;
}

export function DeliveryHeader({
  driverName = "Repartidor",
  serviceArea = "Zona Norte",
  pendingOrders = 0,
  lastSync = "Hace 2 min",
}: DeliveryHeaderProps) {
  const [isActive, setIsActive] = useState(true);

  const availabilityLabel = useMemo(
    () => (isActive ? "Activo" : "Inactivo"),
    [isActive],
  );

  return (
    <header className="relative overflow-hidden rounded-[28px] border border-white/20 bg-white/10 p-6 shadow-2xl shadow-emerald-900/10 backdrop-blur-lg lg:flex lg:items-center lg:justify-between">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(74,222,128,0.45)_0%,rgba(20,40,32,0.6)_55%,rgba(15,28,23,0.85)_100%)]" />
      <div className="relative space-y-4 text-white">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.35em] text-emerald-100/70">
          <span>Página repartidores</span>
        </div>
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Hola, {driverName}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-emerald-50/80">
            Revisa tus entregas asignadas, confirma ubicaciones y mantén tu
            estado de servicio al día durante el turno.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-emerald-50/90">
          <Badge
            variant="secondary"
            className="flex items-center gap-2 rounded-full border border-emerald-300/60 bg-emerald-500/30 text-emerald-50 backdrop-blur"
          >
            <PackageSearch className="h-3.5 w-3.5" />
            {pendingOrders} pedidos
          </Badge>
          <Badge
            variant="secondary"
            className="flex items-center gap-2 rounded-full border border-emerald-200/60 bg-white/10 text-emerald-50 backdrop-blur"
          >
            <MapPin className="h-3.5 w-3.5" />
            Zona: {serviceArea}
          </Badge>
          <Badge
            variant="outline"
            className="rounded-full border border-white/30 bg-white/10 text-xs uppercase tracking-[0.3em] text-emerald-50/80 backdrop-blur"
          >
            Última sync {lastSync}
          </Badge>
        </div>
      </div>

      <div className="relative mt-6 flex flex-col gap-3 text-sm text-white sm:flex-row sm:items-center lg:mt-0">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsActive((prev) => !prev)}
          className={cn(
            "flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold shadow-lg transition backdrop-blur",
            isActive
              ? "border-emerald-400 bg-emerald-500/80 text-white hover:bg-emerald-500"
              : "border-rose-400 bg-transparent text-rose-100 hover:bg-rose-500/20",
          )}
        >
          <CirclePower className="h-4 w-4" />
          {availabilityLabel}
        </Button>

        <Button
          variant="destructive"
          className="flex items-center gap-2 rounded-full border border-rose-400 bg-rose-500/80 px-5 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur hover:bg-rose-500"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </header>
  );
}

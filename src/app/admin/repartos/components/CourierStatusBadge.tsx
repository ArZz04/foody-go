"use client";

import type { CourierStatus } from "../../data/couriers";

export function CourierStatusBadge({ status }: { status: CourierStatus }) {
  const palette =
    status === "Activo"
      ? "bg-emerald-100 text-emerald-600"
      : status === "En descanso"
        ? "bg-sky-100 text-sky-600"
        : "bg-rose-100 text-rose-600";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${palette}`}>
      <span className="size-2 rounded-full bg-current" />
      {status}
    </span>
  );
}

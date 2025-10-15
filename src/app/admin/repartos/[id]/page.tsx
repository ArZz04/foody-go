import Link from "next/link";
import { notFound } from "next/navigation";

import { CourierAssignmentsTable } from "../../components/CourierAssignmentsTable";
import { getCourierById, type CourierAssignment } from "../../data/couriers";

import { CourierHeader } from "../components/CourierHeader";
import { CourierInfoCard } from "../components/CourierInfoCard";

interface PageProps {
  params: {
    id: string;
  };
}

export default function CourierDetailPage({ params }: PageProps) {
  const courierId = Number(params.id);
  const courier = getCourierById(courierId);

  if (!courier) {
    notFound();
  }

  const formatCurrency = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  const resumenPorMes = getMonthlySummary(courier.asignaciones);

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-8">
      <CourierHeader
        courierId={courier.id}
        name={courier.nombre}
        zone={courier.horario.zona}
        shift={courier.horario.turno}
        status={courier.estado}
      />

      <CourierInfoCard courier={courier} />

      <CourierAssignmentsTable assignments={courier.asignaciones} />

      <section className="space-y-4 rounded-3xl border border-red-200/60 bg-white/95 p-6 shadow-lg dark:border-white/10.dark:bg-white/10">
        <header className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Resumen por mes</h2>
          <span className="text-xs text-zinc-400">{resumenPorMes.length} meses con entregas</span>
        </header>
        {resumenPorMes.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-red-200/60 bg-white/70 p-6 text-sm text-zinc-400 dark:border-white/20 dark:bg-white/5">Sin entregas registradas.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {resumenPorMes.map((mes) => (
              <div
                key={mes.key}
                className="rounded-2xl border border-red-200/60 bg-white/90 p-5 text-sm shadow-sm dark:border-white/10 dark:bg-white/5"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{mes.label}</p>
                <p className="mt-2 text-2xl font-semibold">{formatCurrency.format(mes.total)}</p>
                <p className="text-xs text-zinc-500">{mes.count} entregas completadas</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function getMonthlySummary(asignaciones: CourierAssignment[]) {
  type MonthlySummary = {
    label: string;
    count: number;
    total: number;
    key: number;
  };

  const map = new Map<string, MonthlySummary>();

  asignaciones.forEach((asignacion) => {
    const fecha = new Date(asignacion.fecha);
    const key = `${fecha.getFullYear()}-${fecha.getMonth()}`;

    if (!map.has(key)) {
      map.set(key, {
        label: fecha.toLocaleDateString("es-MX", { month: "short", year: "numeric" }),
        count: 0,
        total: 0,
        key: fecha.getFullYear() * 100 + fecha.getMonth(),
      });
    }

    const summary = map.get(key)!;
    summary.count += 1;
    summary.total += asignacion.total;
  });

  return Array.from(map.values()).sort((a, b) => b.key - a.key);
}

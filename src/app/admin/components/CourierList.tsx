"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  couriers,
} from "../data/couriers";

import { CourierRecord, CourierStatus } from "@/types/Couriers";

type EstadoFiltro = "Todos" | CourierStatus;

export function CourierList() {
  const [search, setSearch] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoFiltro>("Todos");

  const filteredCouriers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return couriers.filter((courier) => {
      const matchesSearch =
        query.length === 0 ||
        courier.nombre.toLowerCase().includes(query) ||
        courier.telefono
          .replace(/\s+/g, "")
          .includes(query.replace(/\s+/g, "")) ||
        courier.vehiculo.toLowerCase().includes(query) ||
        courier.zona?.toLowerCase().includes?.(query);

      const matchesStatus =
        estadoFiltro === "Todos" || courier.estado === estadoFiltro;

      return matchesSearch && matchesStatus;
    });
  }, [search, estadoFiltro]);

  const summary = useMemo(() => {
    const total = couriers.length;
    const activos = couriers.filter((c) => c.estado === "Activo").length;
    const descanso = couriers.filter((c) => c.estado === "En descanso").length;
    const suspendidos = couriers.filter(
      (c) => c.estado === "Suspendido",
    ).length;
    return { total, activos, descanso, suspendidos };
  }, []);

  return (
    <section className="w-full rounded-3xl bg-white/95 px-6 py-8 shadow-lg ring-1 ring-red-200/60 backdrop-blur-sm dark:bg-white/10 dark:ring-white/10 lg:px-10 lg:py-10">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-red-700">
            Repartidores activos
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-300">
            Administra la flota, revisa horarios y estados de disponibilidad.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre, teléfono o vehículo"
            className="min-w-[240px] rounded-xl border border-red-200/60 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-200 dark:border-white/20 dark:bg-white/5"
          />
          <select
            value={estadoFiltro}
            onChange={(event) =>
              setEstadoFiltro(event.target.value as EstadoFiltro)
            }
            className="rounded-xl border border-red-200/60 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-200 dark:border-white/20 dark:bg-white/5"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Activo">Activos</option>
            <option value="En descanso">En descanso</option>
            <option value="Suspendido">Suspendidos</option>
          </select>
        </div>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Repartidores totales" value={summary.total} />
        <SummaryCard label="Activos" value={summary.activos} accent="emerald" />
        <SummaryCard
          label="En descanso"
          value={summary.descanso}
          accent="sky"
        />
        <SummaryCard
          label="Suspendidos"
          value={summary.suspendidos}
          accent="rose"
        />
      </section>

      <div className="mt-6 overflow-hidden rounded-2xl border border-red-200/60 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
        <table className="min-w-full divide-y divide-red-100/80 text-sm">
          <thead className="bg-red-50/70 text-left text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
            <tr>
              <th className="px-6 py-3">Repartidor</th>
              <th className="px-6 py-3">Contacto</th>
              <th className="px-6 py-3">Vehículo</th>
              <th className="px-6 py-3">Zona</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Ingreso</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-red-100/60 bg-white text-zinc-700 dark:bg-white/5 dark:text-zinc-200">
            {filteredCouriers.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-sm text-zinc-400"
                >
                  No se encontraron repartidores con los filtros actuales.
                </td>
              </tr>
            ) : (
              filteredCouriers.map((courier) => (
                <CourierRow key={courier.id} courier={courier} />
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-zinc-400">
        Datos simulados para prototipo. Conecta tu API de repartidores cuando
        esté disponible.
      </p>
    </section>
  );
}

function CourierRow({ courier }: { courier: CourierRecord }) {
  const [status, setStatus] = useState<CourierStatus>(courier.estado);

  return (
    <tr className="transition hover:bg-red-50/40 dark:hover:bg-white/10">
      <td className="px-6 py-3 font-medium">{courier.nombre}</td>
      <td className="px-6 py-3">
        <div className="flex flex-col gap-0.5">
          <span>{courier.telefono}</span>
          <span className="text-xs text-zinc-400">{courier.email}</span>
        </div>
      </td>
      <td className="px-6 py-3">
        <div className="flex flex-col gap-0.5">
          <span>{courier.vehiculo}</span>
          <span className="text-xs text-zinc-400">{courier.placas}</span>
        </div>
      </td>
      <td className="px-6 py-3">
        <div className="flex flex-col gap-0.5">
          <span>{courier.horario.zona}</span>
          <span className="text-xs text-zinc-400">
            {courier.horario.turno} ({courier.horario.inicio} -{" "}
            {courier.horario.fin})
          </span>
        </div>
      </td>
      <td className="px-6 py-3">
        <CourierStatusBadge status={status} />
      </td>
      <td className="px-6 py-3 text-xs text-zinc-400">
        {new Date(courier.inicioEnFoodyGo).toLocaleDateString("es-MX", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </td>
      <td className="px-6 py-3 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Link
            href={`/admin/repartos/${courier.id}`}
            className="rounded-lg border border-red-200/60 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-white/20 dark:text-red-200 dark:hover:bg-white/10"
          >
            Revisar
          </Link>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as CourierStatus)}
            className="rounded-lg border border-red-200/60 bg-white px-3 py-1 text-xs font-semibold text-zinc-600 transition focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-200 dark:border-white/20 dark:bg-white/5 dark:text-zinc-200"
          >
            <option value="Activo">Activo</option>
            <option value="En descanso">En descanso</option>
            <option value="Suspendido">Suspendido</option>
          </select>
        </div>
      </td>
    </tr>
  );
}

function SummaryCard({
  label,
  value,
  accent = "rose",
}: {
  label: string;
  value: number;
  accent?: "rose" | "emerald" | "sky";
}) {
  const palette =
    accent === "emerald"
      ? "from-emerald-200/80 to-emerald-400/60 text-emerald-700"
      : accent === "sky"
        ? "from-sky-200/80 to-sky-400/60 text-sky-700"
        : "from-rose-200/80 to-red-400/60 text-red-700";

  return (
    <div className={`rounded-[18px] bg-gradient-to-br ${palette} p-0.5`}>
      <div className="rounded-[16px] bg-white/95 px-4 py-5 shadow-sm ring-1 ring-white/60 dark:bg-zinc-900/80">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
          {label}
        </p>
        <p className="mt-2 text-3xl font-semibold">{value}</p>
      </div>
    </div>
  );
}

function CourierStatusBadge({ status }: { status: CourierStatus }) {
  const palette =
    status === "Activo"
      ? "bg-emerald-100 text-emerald-600"
      : status === "En descanso"
        ? "bg-sky-100 text-sky-600"
        : "bg-rose-100 text-rose-600";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${palette}`}
    >
      <span className="size-2 rounded-full bg-current" />
      {status}
    </span>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";

export default function EditUsersList() {
  const [users, setusers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUsers() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return console.warn("Token no encontrado");
        setLoading(true);
        setError(null);

        const response = await fetch("/api/users", {
          cache: "no-store",
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        if (!response.ok) throw new Error(`Error ${response.status}`);

        const json = await response.json();
        setusers(
          (json.users || []).map((u: any) => ({
            id: u.id,
            name: `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim(),
            email: u.email ?? "",
            phone: u.phone ?? "",
            createdAt: u.created_at ?? "",
            updatedAt: u.updated_at ?? "",
            status: u.status ?? "DESCONOCIDO",
          }))
        );


      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error("Error al cargar users", err);
        setError("No se pudieron cargar los users.");
        setusers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
    return () => controller.abort();
  }, []);

  const stats = useMemo(() => {
    const total = users.length;
    const activos = users.filter(
      (usuario) => usuario.status === 1,
    ).length;
    return { total, activos };
  }, [users]);

  const handleStatusToggle = (id: number) => {
    setusers((prev) =>
      prev.map((usuario) =>
        usuario.id === id
          ? {
              ...usuario,
              status: usuario.status === 1 ? 0 : 1,
            }
          : usuario,
      ),
    );
  };

  return (
    <section className="space-y-6 rounded-2xl bg-white/90 p-6 shadow-md ring-1 ring-red-200/60 dark:bg-white/10 dark:ring-white/10">
      <header>
        <h2 className="text-xl font-semibold text-red-700">
          Lista de Usuarios
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-300">
          Consulta y ajusta los roles de los users registrados en la
          plataforma.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="users totales" value={stats.total} />
        <SummaryCard label="Activos" value={stats.activos} accent="emerald" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-red-200/60 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
        <table className="min-w-full divide-y divide-red-100/80 text-sm">
          <thead className="bg-red-50/70 text-left text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
            <tr>
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Contacto</th>
              <th className="px-4 py-3">Estatus</th>
              <th className="px-4 py-3">Registro</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-red-100/60 bg-white text-zinc-700 dark:bg-white/5 dark:text-zinc-200">
            {loading ? (
              <LoadingRow />
            ) : error ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-red-500"
                >
                  {error}
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-zinc-400"
                >
                  No hay users aún.
                </td>
              </tr>
            ) : (
              users.map((usuario) => (
                <tr
                  key={usuario.id}
                  className="transition hover:bg-red-50/40 dark:hover:bg-white/10"
                >
                  <td className="px-4 py-3 font-medium">{usuario.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span>{usuario.email}</span>
                      <span className="text-xs text-zinc-400">
                        {usuario.phone || "—"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={usuario.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-zinc-400">
                      {usuario.createdAt
                        ? new Date(usuario.createdAt).toLocaleDateString(
                            "es-MX",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleStatusToggle(usuario.id)}
                      className="inline-flex items-center justify-center rounded-lg border border-red-200/60 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-white/20 dark:text-red-200 dark:hover:bg-white/10"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-zinc-400">
        Los cambios son locales. Integra este módulo con tu API para guardar
        roles y estatus.
      </p>
    </section>
  );
}

function SummaryCard({
  label,
  value,
  accent = "rose",
}: {
  label: string;
  value: number;
  accent?: "rose" | "emerald" | "violet" | "sky";
}) {
  const accentClass =
    accent === "emerald"
      ? "from-emerald-200/80 to-emerald-400/60 text-emerald-700"
      : accent === "violet"
        ? "from-violet-200/80 to-violet-400/60 text-violet-700"
        : accent === "sky"
          ? "from-sky-200/80 to-sky-400/60 text-sky-700"
          : "from-rose-200/80 to-red-400/60 text-red-700";

  return (
    <div className={`rounded-[18px] bg-gradient-to-br ${accentClass} p-0.5`}>
      <div className="rounded-[16px] bg-white/95 px-4 py-5 shadow-sm ring-1 ring-white/60 dark:bg-zinc-900/80">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
          {label}
        </p>
        <p className="mt-2 text-3xl font-semibold">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: number }) {
  const normalized = (status || 0) === 1 ? "ACTIVO" : "INACTIVO";
  const isActive = normalized === "ACTIVO";
  const baseStyles =
    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold";
  const theme = isActive
    ? "bg-emerald-100 text-emerald-600"
    : "bg-zinc-200 text-zinc-600";

  return (
    <span className={`${baseStyles} ${theme}`}>
      <span className="size-2 rounded-full bg-current" />
      {normalized}
    </span>
  );
}

function LoadingRow() {
  return (
    <tr>
      <td colSpan={6} className="px-4 py-6">
        <div className="flex items-center justify-center gap-3 text-sm text-zinc-400">
          <span className="inline-flex size-4 animate-spin rounded-full border-2 border-red-200 border-t-transparent" />
          Cargando users...
        </div>
      </td>
    </tr>
  );
}

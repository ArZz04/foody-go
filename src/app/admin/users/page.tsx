"use client"

import { useEffect, useMemo, useState } from "react"
import { Users, UserCheck, AlertCircle, Edit } from "lucide-react"
import SummaryCard from "./components/SummaryCard"
import StatusBadge from "./components/StatusBadge"
import LoadingRow from "./components/LoadingRow"
import ResponsiveModal from "@/app/components/Modal"
import type { User } from "@/types/User"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [open, setOpen] = useState(false)

  // ────────────────────────────────────────────────
  // 🔹 Fetch de usuarios
  // ────────────────────────────────────────────────
  useEffect(() => {
    const controller = new AbortController()

    async function fetchUsers() {
      try {
        const token = localStorage.getItem("token")
        if (!token) return console.warn("Token no encontrado")

        setLoading(true)
        setError(null)

        const response = await fetch("/api/users", {
          cache: "no-store",
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        })

        if (!response.ok) throw new Error(`Error ${response.status}`)

        const json = await response.json()
        setUsers(
          (json.users || []).map((u: any) => ({
            id: u.id,
            name: `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim(),
            email: u.email ?? "",
            phone: u.phone ?? "",
            createdAt: u.created_at ?? "",
            updatedAt: u.updated_at ?? "",
            status: u.status ?? 0,
          })),
        )
      } catch (err) {
        if ((err as Error).name === "AbortError") return
        console.error("Error al cargar usuarios:", err)
        setError("No se pudieron cargar los usuarios.")
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
    return () => controller.abort()
  }, [])

  // ────────────────────────────────────────────────
  // 🔹 Estadísticas
  // ────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = users.length
    const activos = users.filter((u) => u.status === 1).length
    return { total, activos }
  }, [users])

  // ────────────────────────────────────────────────
  // 🔹 Cambio de estatus (solo visual)
  // ────────────────────────────────────────────────
  const handleStatusToggle = (id: number) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: u.status === 1 ? 0 : 1 } : u)))
  }

  // ────────────────────────────────────────────────
  // 🔹 Abrir modal de edición
  // ────────────────────────────────────────────────
  const handleEdit = (user: User) => {
    console.log("Editar usuario:", user)
    setSelectedUser(user)
    setOpen(true)
  }

  // ────────────────────────────────────────────────
  // 🔹 Render principal
  // ────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6">
      <header className="flex items-center gap-2">
        <Users className="h-7 w-7 text-red-600 dark:text-red-400" />
        <h1 className="text-3xl font-semibold">Usuarios</h1>
      </header>

      <section className="space-y-6 rounded-2xl bg-white/90 p-6 shadow-md ring-1 ring-red-200/60 dark:bg-white/10 dark:ring-white/10">
        <header className="space-y-1">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-red-700 dark:text-red-400">
            <UserCheck className="h-5 w-5" />
            Lista de Usuarios
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-300">
            Consulta y ajusta los roles y estatus de los usuarios registrados.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Usuarios Totales" value={stats.total} />
          <SummaryCard label="Usuarios Activos" value={stats.activos} accent="emerald" />
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
                  <td colSpan={5} className="px-4 py-8 text-center text-red-500">
                    <AlertCircle className="mx-auto mb-2 h-5 w-5" />
                    {error}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-zinc-400">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                users.map((usuario) => (
                  <tr key={usuario.id} className="transition hover:bg-red-50/40 dark:hover:bg-white/10">
                    <td className="px-4 py-3 font-medium">{usuario.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span>{usuario.email}</span>
                        <span className="text-xs text-zinc-400">{usuario.phone || "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={usuario.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {usuario.createdAt
                        ? new Date(usuario.createdAt).toLocaleDateString("es-MX", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleEdit(usuario)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200/60 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-white/20 dark:text-red-200 dark:hover:bg-white/10"
                      >
                        <Edit className="h-4 w-4" />
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
          Los cambios son locales. Integra este módulo con tu API para guardar roles y estatus.
        </p>
      </section>

      {/* 🔹 Modal de edición */}
      <ResponsiveModal
        open={open}
        onOpenChange={setOpen}
        title="Editar usuario"
        icon={<Edit className="h-5 w-5 text-red-400" />}
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row-reverse">
            <button
              onClick={() => {
                setOpen(false)
                handleStatusToggle(selectedUser?.id ?? 0)
              }}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Guardar Cambios
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10"
            >
              Cerrar
            </button>
          </div>
        }
      >
        {selectedUser ? (
          <form className="space-y-5">
            {/* Información Personal */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Información Personal</h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Nombre
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedUser.name.split(" ")[0]}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-white transition focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Apellido
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedUser.name.split(" ")[1] || ""}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-white transition focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Teléfono
                </label>
                <input
                  type="tel"
                  defaultValue={selectedUser.phone}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-white transition focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>
            </div>

            {/* Credenciales */}
            <div className="space-y-3 border-t border-zinc-800 pt-5">
              <h3 className="text-sm font-semibold text-white">Credenciales</h3>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={selectedUser.email}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-white transition focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Contraseña
                </label>
                <button
                  type="button"
                  className="w-full rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Enviar nueva contraseña
                </button>
              </div>
            </div>

            {/* Roles y Permisos */}
            <div className="space-y-3 border-t border-zinc-800 pt-5">
              <h3 className="text-sm font-semibold text-white">Roles y Permisos</h3>

              <div className="space-y-2.5">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 accent-red-500" />
                  <span className="text-sm text-zinc-300">Administrador</span>
                </label>

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 accent-red-500" defaultChecked />
                    <span className="text-sm text-zinc-300">Dueño</span>
                  </label>
                  <div className="ml-6 flex flex-wrap gap-2">
                    <span className="rounded-lg bg-zinc-800 px-2 py-1 text-xs font-semibold text-zinc-300">
                      TQUITOS EL PERRON
                    </span>
                    <span className="rounded-lg bg-zinc-800 px-2 py-1 text-xs font-semibold text-zinc-300">
                      PUNTO DE ARCOS
                    </span>
                  </div>
                </div>

                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 accent-red-500" />
                  <span className="text-sm text-zinc-300">Vendedor</span>
                </label>

                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 accent-red-500" />
                  <span className="text-sm text-zinc-300">Repartidor</span>
                </label>
              </div>
            </div>

            {/* Información del Sistema */}
            <div className="space-y-1.5 border-t border-zinc-800 pt-5 text-xs text-zinc-400">
              <p>
                <span className="font-semibold text-zinc-300">Última modificación:</span>{" "}
                {selectedUser.updatedAt
                  ? new Date(selectedUser.updatedAt).toLocaleDateString("es-MX", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"}
              </p>
              <p>
                <span className="font-semibold text-zinc-300">Fecha de registro:</span>{" "}
                {selectedUser.createdAt
                  ? new Date(selectedUser.createdAt).toLocaleDateString("es-MX", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"}
              </p>
            </div>
          </form>
        ) : (
          <p className="text-center text-sm text-zinc-400">No hay datos disponibles.</p>
        )}
      </ResponsiveModal>
    </div>
  )
}

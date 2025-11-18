'use client';

import { useEffect, useMemo, useState } from "react";
import { Users, UserCheck, AlertCircle, Edit } from "lucide-react";
import SummaryCard from "./components/SummaryCard";
import StatusBadge from "./components/StatusBadge";
import LoadingRow from "./components/LoadingRow";
import ResponsiveModal from "@/app/components/Modal";
import type { DBUser } from "@/types/db/users";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<DBUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<DBUser | null>(null);
  const [open, setOpen] = useState(false);

  // Estados controlados dentro del modal
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [statusId, setStatusId] = useState(0);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isDelivery, setIsDelivery] = useState(false);

  async function refreshUsers() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const response = await fetch("/api/users", {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });

  const json = await response.json();

  setUsers(
    (json.users || []).map((u: any): DBUser => ({
      id: u.id,
      first_name: u.first_name ?? "",
      last_name: u.last_name ?? "",
      email: u.email ?? "",
      phone: u.phone ?? "",
      created_at: u.created_at ?? "",
      updated_at: u.updated_at ?? "",
      status_id: u.status_id ?? 0,
      is_verified: u.is_verified ?? false,
      roles: Array.isArray(u.roles)
        ? u.roles.map((r: any) => r.name)
        : []
    }))
  );
}



  // =========== FETCH USERS ===========
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
        console.log("🟢 FETCH USERS:", json.users);
        setUsers(
        (json.users || []).map(
          (u: any): DBUser => ({
            id: u.id,
            first_name: u.first_name ?? "",
            last_name: u.last_name ?? "",
            email: u.email ?? "",
            phone: u.phone ?? "",
            created_at: u.created_at ?? "",
            updated_at: u.updated_at ?? "",
            status_id: u.status_id ?? 0,
            is_verified: u.is_verified ?? false,

            roles: Array.isArray(u.roles) ? u.roles.map((r: any) => r.name) : []
          })
        )
      );
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error("Error al cargar usuarios:", err);
        setError("No se pudieron cargar los usuarios.");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
    return () => controller.abort();
  }, []);

  // =========== CALL API TO UPDATE USER ===========
  async function updateUser(updatedData: Partial<DBUser>, userId: number) {
    const token = localStorage.getItem("token");
    if (!token) return console.warn("Token no encontrado");

    const res = await fetch(`/api/users/edit/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    return await res.json();
  }

  // =========== OPEN MODAL AND SET FORM DATA ===========
const handleEdit = (user: DBUser) => {
  setSelectedUser(user);
  setFirstName(user.first_name);
  setLastName(user.last_name);
  setPhone(user.phone ?? "");
  setEmail(user.email);
  setStatusId(user.status_id);

  const roles = Array.isArray(user.roles) ? user.roles : [];

  setIsAdmin(roles.includes("ADMIN"));
  setIsDelivery(roles.includes("DELIVERY"));

  setOpen(true);
};


  // =========== SAVE CHANGES ===========
const handleSave = async () => {
  if (!selectedUser) return;

  const payload = {
    first_name: firstName,
    last_name: lastName,
    phone,
    email,
    status_id: statusId,
    roles: [
      ...(isAdmin ? ["ADMIN"] : []),
      ...(isDelivery ? ["DELIVERY"] : []),
    ],
  };

  const res = await updateUser(payload, selectedUser.id);

  // refrescar siempre después de guardar
  await refreshUsers();

  setOpen(false);
};



  const stats = useMemo(() => {
    const total = users.length;
    const activos = users.filter((u) => u.status_id === 1).length;
    return { total, activos };
  }, [users]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 px-3 py-6 sm:space-y-6 sm:px-6 sm:py-10 lg:space-y-8">
      <header className="flex items-center gap-2 sm:gap-3">
        <Users className="h-6 w-6 text-red-600 dark:text-red-400 sm:h-7 sm:w-7" />
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white sm:text-3xl">Usuarios</h1>
      </header>

      <section className="space-y-4 rounded-2xl bg-white/90 p-4 shadow-md ring-1 ring-red-200/60 dark:bg-white/10 dark:ring-white/10 sm:space-y-5 sm:p-6 lg:space-y-6">
        <header className="space-y-1">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-red-700 dark:text-red-400 sm:text-xl">
            <UserCheck className="h-4 w-4 sm:h-5 sm:w-5" />
            Lista de Usuarios
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-300 sm:text-sm">
            Consulta y ajusta los roles y estatus de los usuarios registrados.
          </p>
        </header>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
          <SummaryCard label="Usuarios Totales" value={stats.total} />
          <SummaryCard label="Usuarios Activos" value={stats.activos} accent="emerald" />
        </div>

        <div className="overflow-x-auto rounded-2xl border border-red-200/60 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
          <table className="w-full divide-y divide-red-100/80 text-xs sm:text-sm">
            <thead className="bg-red-50/70 text-left font-semibold uppercase tracking-[0.1em] text-red-500 sm:tracking-[0.2em]">
              <tr>
                <th className="px-3 py-2.5 sm:px-4 sm:py-3">Usuario</th>
                <th className="px-3 py-2.5 sm:px-4 sm:py-3">Contacto</th>
                <th className="hidden sm:table-cell px-3 py-2.5 sm:px-4 sm:py-3">Estado</th>
                <th className="hidden md:table-cell px-3 py-2.5 sm:px-4 sm:py-3">Registro</th>
                <th className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                  <span className="hidden sm:inline">Acciones</span>
                  <span className="sm:hidden">✎</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-red-100/60 bg-white text-zinc-700 dark:bg-white/5 dark:text-zinc-200">
              {loading ? (
                <LoadingRow />
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-red-500 sm:px-4 sm:py-8">
                    <AlertCircle className="mx-auto mb-2 h-4 w-4 sm:h-5 sm:w-5" />
                    {error}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-zinc-400 sm:px-4 sm:py-8">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="transition hover:bg-red-50/40 dark:hover:bg-white/10">
                    <td className="px-3 py-2.5 font-medium sm:px-4 sm:py-3">
                      <div className="line-clamp-2">{user.first_name} {user.last_name}</div>
                    </td>
                    
                    <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs sm:text-sm">{user.email}</span>
                        <span className="text-xs text-zinc-400">{user.phone || "—"}</span>
                      </div>
                    </td>
                    
                    <td className="hidden sm:table-cell px-3 py-2.5 sm:px-4 sm:py-3">
                      <StatusBadge status={user.status_id} />
                    </td>
                    
                    <td className="hidden md:table-cell px-3 py-2.5 text-xs text-zinc-400 sm:px-4 sm:py-3">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString("es-MX", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    
                    <td className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(user)}
                        className="inline-flex items-center justify-center gap-1 rounded-lg border border-red-200/60 px-2 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-white/20 dark:text-red-200 dark:hover:bg-white/10 sm:gap-1.5 sm:px-3 sm:py-2"
                      >
                        <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Editar</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-zinc-400">Los cambios son locales. Integra este módulo con tu API para guardar roles y estatus.</p>
      </section>

      {/* Modal de edición */}
      <ResponsiveModal
        open={open}
        onOpenChange={setOpen}
        title="Editar usuario"
        icon={<Edit className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />}
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row-reverse sm:gap-3">
            <button
              onClick={handleSave}
              className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 sm:px-4 sm:py-2 sm:text-sm"
            >
              Guardar Cambios
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg border border-white/20 px-3 py-2 text-xs text-zinc-300 transition hover:bg-white/10 sm:px-4 sm:py-2 sm:text-sm"
            >
              Cerrar
            </button>
          </div>
        }
      >
        {selectedUser ? (
          <form className="space-y-4 sm:space-y-5">
            {/* Información Personal */}
            <div className="space-y-2.5 sm:space-y-3">
              <h3 className="text-sm font-semibold text-white">Información Personal</h3>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-400 sm:mb-1.5">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-400 sm:mb-1.5">
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1.5 text-xs text-white transition focus:outline-none focus:ring-2 focus:ring-red-400 sm:px-3 sm:py-2 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-400 sm:mb-1.5">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1.5 text-xs text-white transition focus:outline-none focus:ring-2 focus:ring-red-400 sm:px-3 sm:py-2 sm:text-sm"
                />
              </div>
            </div>

            {/* Credenciales */}
            <div className="space-y-2.5 border-t border-zinc-800 pt-4 sm:space-y-3 sm:pt-5">
              <h3 className="text-sm font-semibold text-white">Credenciales</h3>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-400 sm:mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1.5 text-xs text-white transition focus:outline-none focus:ring-2 focus:ring-red-400 sm:px-3 sm:py-2 sm:text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-400 sm:mb-1.5">
                  Contraseña
                </label>
                <button
                  type="button"
                  className="w-full rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 sm:px-3 sm:py-2 sm:text-sm"
                >
                  Enviar nueva contraseña
                </button>
              </div>
            </div>

            {/* Roles y Permisos */}
          <div className="space-y-2.5 border-t border-zinc-800 pt-4 sm:space-y-3 sm:pt-5">
            <h3 className="text-sm font-semibold text-white">Roles y Permisos</h3>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={() => setIsAdmin(!isAdmin)}
                className="h-4 w-4 accent-red-500"
              />
              <span className="text-xs text-zinc-300 sm:text-sm">Administrador</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isDelivery}
                onChange={() => setIsDelivery(!isDelivery)}
                className="h-4 w-4 accent-red-500"
              />
              <span className="text-xs text-zinc-300 sm:text-sm">Repartidor</span>
            </label>
          </div>


            {/* Información del Sistema */}
            <div className="space-y-1 border-t border-zinc-800 pt-4 text-xs text-zinc-400 sm:pt-5">
              <p>
                <span className="font-semibold text-zinc-300">Última modificación:</span>{" "}
                {selectedUser.updated_at
                  ? new Date(selectedUser.updated_at).toLocaleDateString("es-MX", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"}
              </p>
              <p>
                <span className="font-semibold text-zinc-300">Fecha de registro:</span>{" "}
                {selectedUser.created_at
                  ? new Date(selectedUser.created_at).toLocaleDateString("es-MX", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"}
              </p>
            </div>
          </form>
        ) : (
          <p className="text-center text-xs text-zinc-400 sm:text-sm">No hay datos disponibles.</p>
        )}
      </ResponsiveModal>
    </div>
  )
}

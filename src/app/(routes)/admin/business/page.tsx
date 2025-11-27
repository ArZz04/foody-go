"use client"

import { useEffect, useMemo, useState } from "react"
import { Store, TrendingUp, Plus, Edit, AlertCircle } from "lucide-react"
import SummaryCard from "../components/SummaryCard"
import StatusBadge from "../components/StatusBadge"
import LoadingRow from "../components/LoadingRow"
import ResponsiveModal from "@/app/components/Modal"
import type { BusinessFull } from "@/types/domain/BusinessFull"

interface UserOption {
  id: number
  name: string
  email: string
}

export default function AdminNegociosPage() {
  const [negocios, setNegocios] = useState<BusinessFull[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessFull | null>(null)
  const [open, setOpen] = useState(false)
  const [isNew, setIsNew] = useState(false)

  const [users, setUsers] = useState<UserOption[]>([])
  const [selectedOwnerId, setSelectedOwnerId] = useState<number | null>(null)

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [business_category_id, setBusinessCategoryId] = useState<number | "">("");
  const [bussiness_category_name, setBusinessCategoryName] = useState("");
  const [legal_name, setLegalName] = useState("");
  const [tax_id, setTaxId] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [address_notes, setAddressNotes] = useState("");
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [userSearch, setUserSearch] = useState("");

  const filteredUsers = users.filter((u) =>
  `${u.name} ${u.email}`.toLowerCase().includes(userSearch)
);


  function validateForm() {
  const errors: string[] = [];

  if (!selectedOwnerId) errors.push("Debe seleccionar un propietario.");
  if (!name.trim()) errors.push("El nombre del negocio es obligatorio.");
  if (!business_category_id) errors.push("Debe seleccionar una categoría.");
  if (!city.trim()) errors.push("La ciudad es obligatoria.");
  if (!district.trim()) errors.push("El distrito/colonia es obligatorio.");
  if (!address.trim()) errors.push("La dirección es obligatoria.");

  if (errors.length > 0) {
    alert("❌ No se puede continuar:\n\n" + errors.join("\n"));
    return false;
  }

  return true;
}

  // ========================
  // Fetch users (Active only)
  // ========================
  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const res = await fetch("/api/users/filter?onlyActive=true", {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (!res.ok) throw new Error("Error al cargar usuarios")
        const data = await res.json()

        setUsers(data.users?.map((u: any) => ({
          id: u.id,
          name: u.name || `${u.first_name ?? ""} ${u.last_name ?? ""}`,
          email: u.email
        })) ?? [])
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    fetchUsers()
  }, [])

  // ========================
  // Fetch Businesses
  // ========================
  useEffect(() => {
    const controller = new AbortController()

    async function fetchNegocios() {
      try {
        const token = localStorage.getItem("token")
        if (!token) return console.warn("Token no encontrado")

        setLoading(true)
        setError(null)

        const res = await fetch("/api/business", {
          cache: "no-store",
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        })

        if (!res.ok) throw new Error(`Error ${res.status}`)

        const json = await res.json()
        const negociosList = Array.isArray(json.negocios) ? json.negocios : []

        if (negociosList.length === 0) {
          setError("No hay negocios registrados.")
          setNegocios([])
          return
        }

        setNegocios(negociosList.map((b: any) => ({
          ...b,
          created_at: new Date(b.created_at),
          updated_at: new Date(b.updated_at),
        })))

        
      } catch (err) {
        if ((err as Error).name === "AbortError") return
        console.error(err)
        setError("No se pudieron cargar los negocios.")
        setNegocios([])
      } finally {
        setLoading(false)
      }
    }

    fetchNegocios()
    return () => controller.abort()
  }, [])

  // Obtener las categorias de negocios para el formulario desde /api/business/categories
  useEffect(() => {
  async function fetchCategories() {
    try {
      const res = await fetch("/api/business/categories", { cache: "no-store" });
      if (!res.ok) throw new Error("Error al obtener categorías");

      
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Error categories:", err);
    }
  }

  fetchCategories();
}, []);


async function submitForm() {
  if (!validateForm()) return;

  const token = localStorage.getItem("token");
  if (!token) return alert("❌ No hay token, inicia sesión.");

  const payload = {
    owner_id: selectedOwnerId!,
    name,
    description: description || null,
    business_category_id,
    legal_name: legal_name || null,
    tax_id: tax_id || null,
    city,
    district,
    address,
    address_notes: address_notes || null,
  };

  try {
    const url = isNew
      ? "/api/business"
      : `/api/business/${selectedBusiness?.id}`;

    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("❌ Error server:", data);
      alert("❌ Error: " + (data.error || "No se pudo guardar."));
      return;
    }

    if (isNew) {
      // Agregar a tabla sin recargar
      setNegocios((prev) => [...prev, data.business]);
      alert("🎉 Negocio creado con éxito");
    } else {
      // Actualizar elemento dentro de la tabla sin recargar
      setNegocios((prev) =>
        prev.map((n) =>
          n.id === selectedBusiness?.id ? { ...n, ...data.business } : n
        )
      );
      alert("💾 Cambios guardados");
    }

    resetForm();
    setOpen(false);

  } catch (error) {
    console.error("❌ Error inesperado:", error);
    alert("❌ Error inesperado. Consulta consola.");
  }
}



function resetForm() {
  setSelectedOwnerId(null);
  setName("");
  setDescription("");
  setBusinessCategoryId("");
  setLegalName("");
  setTaxId("");
  setCity("");
  setDistrict("");
  setAddress("");
  setAddressNotes("");
}

const getCategoryName = (id: number) =>
  categories.find((c) => c.id === id)?.name || `#${id}`;


  // ========================
  // Stats
  // ========================
  const stats = useMemo(() => ({
    total: negocios.length,
    activos: negocios.filter((n) => n.status_id === 1).length,
  }), [negocios])

  // ========================
  // UI Actions
  // ========================
const handleEdit = (business: BusinessFull) => {
  setSelectedBusiness(business)

  setSelectedOwnerId(
    business.business_owner?.user_id
      ? Number(business.business_owner.user_id)
      : null
  );

  setBusinessCategoryId(business.business_category_id ?? "")
  setName(business.name)
  setDescription(business.description ?? "")
  setLegalName(business.legal_name ?? "")
  setTaxId(business.tax_id ?? "")
  setCity(business.city ?? "")
  setDistrict(business.district ?? "")
  setAddress(business.address ?? "")
  setAddressNotes(business.address_notes ?? "")

  setUserSearch("") // 🔥 para que el select pueda mostrarlo

  setIsNew(false)
  setOpen(true)
}



  const handleNew = () => {
    setSelectedBusiness(null)
    setSelectedOwnerId(null)
    setBusinessCategoryId("");
    setIsNew(true)
    setOpen(true)
  }


  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 px-3 py-6 sm:px-6 sm:py-10">

      {/* HEADER */}
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Store className="h-6 w-6 text-red-600 sm:h-7 sm:w-7" />
          <h1 className="text-2xl font-semibold dark:text-white">Negocios</h1>
        </div>

        <button
          onClick={handleNew}
          className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
        >
          <Plus className="h-4 w-4" /> Nuevo negocio
        </button>
      </header>

      {/* TABLE & STATS */}
      <section className="rounded-2xl bg-white/90 dark:bg-white/10 p-4 shadow-md space-y-5">

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <SummaryCard label="Negocios Totales" value={stats.total} />
          <SummaryCard label="Negocios Activos" value={stats.activos} accent="emerald" />
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto border rounded-2xl">
          <table className="w-full text-xs sm:text-sm divide-y divide-red-100">
            <thead className="bg-red-50 text-red-600 font-semibold uppercase">
              <tr>
                <th className="px-3 py-2.5">Negocio</th>
                <th className="hidden sm:table-cell px-3 py-2.5">Ciudad</th>
                <th className="hidden sm:table-cell px-3 py-2.5">Categoría</th>
                <th className="hidden sm:table-cell px-3 py-2.5">Estado</th>
                <th className="px-3 py-2.5 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-red-100">

              {loading ? (
                <LoadingRow />
              ) : error ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-red-500">
                    <AlertCircle className="mx-auto mb-2 h-4 w-4" />
                    {error}
                  </td>
                </tr>
              ) : (
                negocios.map((b) => (
                  <tr key={b.id} className="hover:bg-red-50 dark:hover:bg-white/10">
                    <td className="px-3 py-2.5">
                      <div className="font-medium">{b.name}</div>
                      <div className="text-xs text-zinc-400">{b.legal_name}</div>
                    </td>

                    <td className="hidden sm:table-cell px-3 py-2.5">{b.city}</td>
                    <td className="hidden sm:table-cell px-3 py-2.5">
                      {getCategoryName(b.business_category_id)}
                    </td>
                    <td className="hidden sm:table-cell px-3 py-2.5"><StatusBadge status={b.status_id} /></td>

                    <td className="px-3 py-2.5 text-center">
                      <button
                        onClick={() => handleEdit(b)}
                        className="inline-flex items-center gap-1 border border-red-300 rounded-lg px-2 py-1 text-red-600 hover:bg-red-50 dark:text-red-300"
                      >
                        <Edit className="h-4 w-4" /> <span className="hidden sm:inline">Editar</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>

      </section>

      {/* Modal */}
      <ResponsiveModal
  open={open}
  onOpenChange={setOpen}
  title={isNew ? "Crear negocio" : "Editar negocio"}
  icon={<Edit className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />}
  footer={
    <div className="flex flex-col-reverse gap-2 sm:flex-row-reverse sm:gap-3">
      <button
  onClick={submitForm}
  className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 sm:px-4 sm:py-2 sm:text-sm"
>
  {isNew ? "Crear negocio" : "Guardar cambios"}
</button>



      <button
        onClick={() => setOpen(false)}
        className="rounded-lg border border-white/20 px-3 py-2 text-xs text-zinc-300 transition hover:bg-white/10 sm:px-4 sm:py-2 sm:text-sm"
      >
        Cancelar
      </button>
    </div>
  }
>
  {(isNew || selectedBusiness) ? (
    <form className="space-y-5 sm:space-y-6">

      {/* OWNER */}
<div className="space-y-1">
  <label className="text-xs text-zinc-400 font-semibold">
    Dueño / Propietario <span className="text-red-500">*</span>
  </label>

  {/* buscador */}
  <div className="flex gap-2">
    <input
      type="text"
      placeholder="Buscar..."
      onChange={(e) => setUserSearch(e.target.value.toLowerCase())}
      className="w-1/2 rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1.5 text-xs text-white focus:ring-2 focus:ring-red-400"
    />

    <select
  value={selectedOwnerId ?? ""}  // <-- esto está bien, lo conservamos
  onChange={(e) => {
    const value = e.target.value;
    setSelectedOwnerId(value ? Number(value) : null);
  }}
  className="w-1/2 rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1.5 text-xs text-white focus:ring-2 focus:ring-red-400"
>
      <option value="">Selecciona propietario</option>
      {filteredUsers.map((u) => (
        <option key={u.id} value={u.id}>
        {u.name} — {u.email}
        </option>
      ))}
    </select>
  </div>
</div>


      {/* NAME */}
      <div className="space-y-1">
        <label className="text-xs text-zinc-400 font-semibold">Nombre del negocio <span className="text-red-500">*</span></label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Tacos El Güero"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1.5 text-xs text-white focus:ring-2 focus:ring-red-400"
        />
      </div>

      {/* CATEGORY */}
      <div className="space-y-1">
  <label className="text-xs text-zinc-400 font-semibold">Categoría <span className="text-red-500">*</span></label>
  <select
    value={business_category_id}
    onChange={(e) => setBusinessCategoryId(Number(e.target.value))}
    className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1.5 text-xs text-white focus:ring-2 focus:ring-red-400"
  >
    <option value="">Selecciona categoría</option>
    {categories.map((cat) => (
      <option key={cat.id} value={cat.id}>
        {cat.name}
      </option>
    ))}
  </select>
</div>


      {/* LEGAL INFORMATION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-zinc-400 font-semibold">Razón Social<span className="text-red-500">*</span></label>
          <input
            type="text"
            value={legal_name}
            onChange={(e) => setLegalName(e.target.value)}
            className="w-full rounded-lg border bg-zinc-800/80 border-zinc-700 px-2.5 py-1.5 text-xs text-white focus:ring-red-400 focus:ring-2"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-zinc-400 font-semibold">RFC / Tax ID <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={tax_id}
            onChange={(e) => setTaxId(e.target.value)}
            className="w-full rounded-lg border bg-zinc-800/80 border-zinc-700 px-2.5 py-1.5 text-xs text-white focus:ring-red-400 focus:ring-2"
          />
        </div>
      </div>

      {/* ADDRESS */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold">Ciudad <span className="text-red-500">*</span></label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1.5 text-xs text-white focus:ring-red-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold">Distrito / Colonia <span className="text-red-500">*</span></label>
            <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1.5 text-xs text-white focus:ring-red-400"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-zinc-400 font-semibold">Dirección <span className="text-red-500">*</span></label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1.5 text-xs text-white focus:ring-red-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-zinc-400 font-semibold">Notas</label>
          <textarea value={address_notes} onChange={(e) => setAddressNotes(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1.5 text-xs text-white resize-none focus:ring-red-400"
          />
        </div>
      </div>

    </form>
  ) : (
    <p className="text-center text-xs text-zinc-400 sm:text-sm">No hay datos disponibles.</p>
  )}
</ResponsiveModal>
    </div>
  )
}


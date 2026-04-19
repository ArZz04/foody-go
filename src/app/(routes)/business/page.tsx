"use client";

import {
  AlertTriangle,
  Bell,
  CalendarDays,
  ChevronRight,
  DollarSign,
  MoreVertical,
  Package,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShoppingCart,
  Store,
  Tag,
  TrendingUp,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import BusinessTabs from "./components/BusinessTabs";

type ProductStatus = "Activo" | "Agotado" | "Borrador";
type PromotionType = "Ninguna" | "Oferta" | "Happy Hour" | "Combo" | string;

interface Product {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  costo: number;
  margen: number;
  estado: ProductStatus;
  promocion: PromotionType;
  destacado?: boolean;
  actualizadoEn: string;
}

interface BusinessInfo {
  id: number;
  name: string;
  categoryId: number;
  category_name: string;
  city: string | null;
  district: string | null;
  address: string | null;
  legal_name: string | null;
  tax_id: string | null;
  address_notes: string | null;
  created_at: string;
  updated_at: string;
  statusId: number;
  is_open_now?: number;
}

interface BusinessListItem {
  id: number;
  nombre: string;
  ciudad: string | null;
  categoria: string;
}

interface BusinessHour {
  day_of_week: number;
  day_name: string;
  is_closed: boolean;
  open_time?: string | null;
  close_time?: string | null;
}

interface CategoryRecord {
  id?: number;
  name: string;
}

interface ApiBusinessListItem {
  id: number;
  name: string;
  city: string | null;
}

interface ApiProduct {
  id: number | string;
  name: string;
  category_name?: string | null;
  price: number | string;
  stock_average?: number | string | null;
  cost?: number | string | null;
  margin?: number | string | null;
  status_id: number;
  promotion_id?: number | string | null;
  updated_at: string;
}

const peso = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

export default function BusinessPage() {
  const [businesses, setBusinesses] = useState<BusinessListItem[]>([]);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<number | null>(null);
  const [loadingToggle, setLoadingToggle] = useState(false);

  useEffect(() => {
    async function fetchBusinesses() {
      try {
        const token = localStorage.getItem("token");

        const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
        const userId = payload?.id;

        if (!token) {
          console.error("No hay token en localStorage");
          return;
        }

        const res = await fetch(`/api/users/owner/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Error al cargar negocios");
        }

        const data = await res.json();

        if (!data.businesses) {
          console.error("La API no retornó 'businesses'");
          return;
        }

        const parsedBusinesses = data.businesses.map(
          (b: ApiBusinessListItem) => ({
            id: b.id,
            nombre: b.name,
            ciudad: b.city,
            categoria: "General",
          }),
        );

        setBusinesses(parsedBusinesses);

        if (parsedBusinesses.length > 0) {
          setSelectedBusiness(parsedBusinesses[0].id);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchBusinesses();
  }, []);

  useEffect(() => {
    if (!selectedBusiness) return;

    async function fetchBusinessInfo() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`/api/business/${selectedBusiness}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al cargar el negocio");

        const data = await res.json();

        setBusinessInfo({
          id: data.business.id,
          name: data.business.name,
          categoryId: data.business.business_category_id,
          category_name: data.business.category_name,
          city: data.business.city,
          district: data.business.district,
          address: data.business.address,
          legal_name: data.business.legal_name,
          tax_id: data.business.tax_id,
          address_notes: data.business.address_notes,
          created_at: data.business.created_at,
          updated_at: data.business.updated_at,
          statusId: data.business.status_id,
        });
        setBusinessHours(data.hours || []);
        setLoadingToggle(true);
        const statusRes = await fetch(
          `/api/business/${data.business.id}/toggle`,
          {
            method: "GET",
          },
        );
        const statusData = await statusRes.json();
        setBusinessInfo((prev) =>
          prev ? { ...prev, is_open_now: statusData.is_open_now } : prev,
        );
        setLoadingToggle(false);
      } catch (err) {
        console.error(err);
        setLoadingToggle(false);
      }
    }

    fetchBusinessInfo();
  }, [selectedBusiness]);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);

  useEffect(() => {
    if (!selectedBusiness) return;

    async function fetchCategories() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`/api/categories/${selectedBusiness}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    }

    fetchCategories();
  }, [selectedBusiness]);

  useEffect(() => {
    if (!selectedBusiness) return;

    async function fetchProducts() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(
          `/api/business/products?business_id=${selectedBusiness}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();

        if (!res.ok) {
          console.error("Error al cargar productos:", data);
          return;
        }

        const parsed = data.products.map((p: ApiProduct) => ({
          id: p.id.toString(),
          nombre: p.name,
          categoria: p.category_name ?? "Sin categoría",
          precio: Number(p.price),
          stock: Number(p.stock_average ?? 0),
          costo: Number(p.cost ?? 0),
          margen: Number(p.margin ?? 0),
          estado:
            p.status_id === 1
              ? "Activo"
              : p.status_id === 2
                ? "Agotado"
                : "Borrador",
          promocion: p.promotion_id ? "Oferta" : "Ninguna",
          destacado: false,
          actualizadoEn: p.updated_at,
        }));
        setProducts(parsed);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchProducts();
  }, [selectedBusiness]);

  async function toggleBusiness(id: number) {
    setLoadingToggle(true);

    const res = await fetch(`/api/business/${id}/toggle`, {
      method: "PUT",
    });

    const data = await res.json();

    setBusinessInfo((prev) =>
      prev ? { ...prev, is_open_now: data.new_status } : prev,
    );

    setLoadingToggle(false);
  }

  const { totalProducts, activeProducts, lowStockProducts, productsOnPromo } =
    useMemo(() => {
      const total = products.length;
      const active = products.filter(
        (product) => product.estado === "Activo",
      ).length;
      const lowStock = products.filter((product) => product.stock <= 10).length;
      const promos = products.filter(
        (product) => product.promocion !== "Ninguna",
      ).length;
      return {
        totalProducts: total,
        activeProducts: active,
        lowStockProducts: lowStock,
        productsOnPromo: promos,
      };
    }, [products]);

  const categorySummary = useMemo(() => {
    const source =
      categories.length > 0
        ? categories.map((category) => category.name)
        : Array.from(new Set(products.map((product) => product.categoria)));

    return source.map((name) => {
      const categoryProducts = products.filter(
        (product) => product.categoria === name,
      );
      const criticalProducts = categoryProducts.filter(
        (product) => product.stock <= 10,
      ).length;

      return {
        name,
        productos: categoryProducts.length,
        desabastecidos: criticalProducts,
        porcentaje:
          categoryProducts.length === 0
            ? 0
            : Math.round((criticalProducts / categoryProducts.length) * 100),
      };
    });
  }, [categories, products]);

  const promoProducts = useMemo(
    () =>
      products.filter((product) => product.promocion !== "Ninguna").slice(0, 4),
    [products],
  );

  async function handleUpdatePrice(productId: string) {
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    const raw = window.prompt(
      "Ingresa el nuevo precio:",
      String(product.precio ?? ""),
    );
    if (raw === null) return;

    const normalized = raw.replace(",", ".").trim();
    if (normalized.length === 0) return;

    const nextPrice = Number.parseFloat(normalized);
    if (!Number.isFinite(nextPrice) || nextPrice < 0) {
      window.alert("Introduce un precio válido mayor o igual a 0.");
      return;
    }

    try {
      const res = await fetch("/api/business/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId, price: nextPrice }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Error HTTP ${res.status}`);
      }

      setProducts((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, precio: nextPrice } : item,
        ),
      );
    } catch (error) {
      console.error("Error al actualizar price:", error);
      window.alert("No se pudo actualizar el precio. Intenta nuevamente.");
    }
  }

  const lowStockList = useMemo(
    () =>
      products
        .filter((product) => product.stock <= 10)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 6),
    [products],
  );

  const weeklyPerformance = useMemo(() => {
    const baseline = Math.max(
      products.reduce((total, product) => total + product.precio, 0),
      1200,
    );
    const multipliers = [0.32, 0.18, 1, 0.48, 0.58, 0.44, 0.52];
    const labels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

    return labels.map((label, index) => ({
      label,
      value: Math.round(baseline * multipliers[index]),
    }));
  }, [products]);

  async function handleUpdateStock(productId: string) {
    const product = products.find((item) => item.id === productId);
    if (!product) {
      return;
    }

    const raw = window.prompt(
      "Ingresa el nuevo stock disponible:",
      product.stock.toString(),
    );
    if (raw === null) {
      return;
    }

    const normalized = raw.replace(",", ".").trim();
    if (normalized.length === 0) {
      return;
    }

    const nextStock = Number.parseInt(normalized, 10);
    if (!Number.isFinite(nextStock) || nextStock < 0) {
      window.alert("Introduce un número entero válido mayor o igual a 0.");
      return;
    }

    try {
      await fetch("/api/business/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId, stock_average: nextStock }),
      });

      setProducts((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, stock: nextStock } : item,
        ),
      );
    } catch (error) {
      console.error("Error al actualizar stock:", error);
      window.alert("No se pudo actualizar el stock. Intenta nuevamente.");
    }
  }

  function handleToggleStatus(productId: string) {
    const product = products.find((item) => item.id === productId);
    if (!product) {
      return;
    }

    const isActive = product.estado === "Activo";
    const confirmed = window.confirm(
      isActive
        ? "¿Deseas desactivar este producto? Podrás activarlo de nuevo cuando lo necesites."
        : "¿Deseas activar este producto para que vuelva a estar disponible?",
    );

    if (!confirmed) {
      return;
    }

    setProducts((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, estado: isActive ? "Borrador" : "Activo" }
          : item,
      ),
    );
  }

  function handleBulkDiscount() {
    if (products.length === 0) {
      window.alert("No hay productos disponibles para aplicar una rebaja.");
      return;
    }

    const scopeInput = window.prompt(
      "¿A qué productos deseas aplicar la oferta? Escribe 'todos' o ingresa el ID/nombre separado por comas.",
      "todos",
    );
    if (scopeInput === null) {
      return;
    }
    const scope = scopeInput.trim().toLowerCase();
    if (scope.length === 0) {
      return;
    }

    let targetProducts: Product[] = [];
    if (scope === "todos") {
      targetProducts = products.filter(
        (product) => product.estado === "Activo",
      );
    } else {
      const terms = scope
        .split(",")
        .map((term) => term.trim().toLowerCase())
        .filter(Boolean);
      if (terms.length === 0) {
        window.alert("Debes ingresar al menos un identificador de producto.");
        return;
      }
      targetProducts = products.filter((product) => {
        if (product.estado !== "Activo") {
          return false;
        }
        const id = product.id.toLowerCase();
        const name = product.nombre.toLowerCase();
        return terms.some((term) => id === term || name === term);
      });
    }

    if (targetProducts.length === 0) {
      window.alert("No se encontraron productos activos con ese criterio.");
      return;
    }

    const percentInput = window.prompt(
      `Porcentaje de rebaja para ${scope === "todos" ? "los productos seleccionados" : "el producto seleccionado"}:`,
      "10",
    );
    if (percentInput === null) {
      return;
    }
    const normalizedPercent = percentInput.replace(",", ".").trim();
    if (normalizedPercent.length === 0) {
      return;
    }

    const percentage = Number.parseFloat(normalizedPercent);
    if (!Number.isFinite(percentage) || percentage <= 0 || percentage >= 100) {
      window.alert("Introduce un porcentaje válido mayor a 0 y menor a 100.");
      return;
    }

    const labelInput = window.prompt(
      "Nombre de la oferta (opcional). Ejemplo: '2x1 Degustación' o 'Campaña Primavera'.",
      "Oferta especial",
    );
    if (labelInput === null) {
      return;
    }
    const promotionLabel =
      labelInput.trim().length > 0 ? labelInput.trim() : "Oferta";

    const targetIds = new Set(targetProducts.map((product) => product.id));
    const factor = 1 - percentage / 100;

    setProducts((prev) =>
      prev.map((item) =>
        targetIds.has(item.id)
          ? {
              ...item,
              precio: Math.max(
                0,
                Number.parseFloat((item.precio * factor).toFixed(2)),
              ),
              promocion: promotionLabel,
            }
          : item,
      ),
    );

    window.alert(
      `Rebaja del ${percentage}% aplicada a ${targetIds.size} producto(s).`,
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f7f8] text-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-lg shadow-orange-600/20">
              <Store className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-black tracking-tight">
                {businessInfo?.name ?? "Panel de negocio"}
              </h1>
              <p className="truncate text-sm font-semibold text-slate-500">
                {businessInfo?.category_name ?? "Negocio"} ·{" "}
                {businessInfo?.city ?? "Ciudad"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <nav className="flex gap-2 overflow-x-auto rounded-2xl bg-slate-100 p-1 text-sm font-extrabold text-slate-600">
              <a
                className="rounded-xl bg-white px-4 py-2 text-orange-600 shadow-sm"
                href="#resumen"
              >
                Resumen
              </a>
              <a
                className="rounded-xl px-4 py-2 transition hover:bg-white"
                href="#inventario"
              >
                Inventario
              </a>
              <a
                className="rounded-xl px-4 py-2 transition hover:bg-white"
                href="#catalogo"
              >
                Catálogo
              </a>
            </nav>

            <div className="flex items-center gap-2">
              <label className="relative hidden min-w-72 lg:block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Buscar productos..."
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                />
              </label>
              <IconButton label="Notificaciones" marker>
                <Bell className="h-5 w-5" />
              </IconButton>
              <IconButton label="Configuración">
                <Settings className="h-5 w-5" />
              </IconButton>
              <IconButton label="Perfil">
                <UserRound className="h-5 w-5" />
              </IconButton>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        <section
          id="resumen"
          className="relative overflow-hidden rounded-[22px] bg-orange-600 px-5 py-5 text-white shadow-xl shadow-orange-900/15 sm:px-7 lg:px-8"
        >
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),transparent_38%,rgba(194,65,12,0.32))]" />
          <div className="relative flex flex-col gap-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-4xl">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/80">
                  Negocio
                </p>
                <h2 className="mt-2 text-3xl font-black uppercase tracking-tight sm:text-4xl">
                  {businessInfo?.name ?? "Cargando negocio"}
                </h2>
                <p className="mt-3 max-w-3xl text-base font-semibold leading-7 text-white/90">
                  {businessInfo
                    ? `${businessInfo.category_name} en ${businessInfo.city}. Gestiona catálogo, precios, inventario y promociones desde un panel operativo.`
                    : "Estamos cargando los datos principales del negocio."}
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                <button
                  type="button"
                  onClick={() =>
                    businessInfo && toggleBusiness(businessInfo.id)
                  }
                  disabled={loadingToggle || !businessInfo}
                  className={`inline-flex h-10 items-center justify-center rounded-xl px-5 text-sm font-black shadow-lg transition disabled:cursor-not-allowed disabled:opacity-70 ${
                    businessInfo?.is_open_now === 1
                      ? "bg-white text-rose-600 hover:bg-rose-50"
                      : "bg-white text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  {loadingToggle || !businessInfo
                    ? "Cargando..."
                    : businessInfo.is_open_now === 1
                      ? "Cerrar negocio"
                      : "Abrir negocio"}
                </button>
                <BusinessTabs
                  businesses={businesses}
                  selectedId={selectedBusiness}
                  onSelect={(id) => setSelectedBusiness(id)}
                />
              </div>
            </div>

            <dl className="grid gap-4 border-y border-white/20 py-4 md:grid-cols-3">
              <StatItem
                label="Productos activos"
                value={`${activeProducts}/${totalProducts}`}
                helper="Disponibles para venta"
              />
              <StatItem
                label="Órdenes activas"
                value="0"
                helper="0 nuevas, 0 completadas"
              />
              <StatItem
                label="Inventario crítico"
                value={lowStockProducts.toString()}
                helper="Productos a reabastecer"
              />
            </dl>

            <div className="grid gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm lg:grid-cols-[1fr,1.2fr,auto] lg:items-center">
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/60">
                  Ubicación
                </p>
                <p className="mt-1 truncate font-black uppercase tracking-wide">
                  {businessInfo?.address ??
                    businessInfo?.district ??
                    "Sin dirección registrada"}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/60">
                  Horario
                </p>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 font-semibold text-white/90">
                  {businessHours?.slice(0, 2).map((hour) => (
                    <p key={hour.day_of_week}>
                      {hour.is_closed
                        ? `${hour.day_name}: Cerrado`
                        : !hour.open_time
                          ? `${hour.day_name}: No definido`
                          : `${hour.day_name}: ${hour.open_time} - ${hour.close_time}`}
                    </p>
                  ))}
                  {businessHours?.length > 2 ? (
                    <p className="text-white/70">
                      + {businessHours.length - 2} días más
                    </p>
                  ) : null}
                </div>
              </div>
              <Link
                href="/business/manager"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-orange-700/40 px-5 text-sm font-black text-white transition hover:bg-orange-700/60"
              >
                Ver pedidos
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            icon={<Package className="h-5 w-5" />}
            label="Productos totales"
            value={totalProducts.toString()}
            helper={`${activeProducts} activos en catálogo`}
            trend="+12%"
          />
          <KpiCard
            icon={<ShoppingCart className="h-5 w-5" />}
            label="Activos en catálogo"
            value={activeProducts.toString()}
            tone="green"
            helper="Listos para venta"
            trend="+8%"
          />
          <KpiCard
            icon={<DollarSign className="h-5 w-5" />}
            label="Sin promoción"
            value={(totalProducts - productsOnPromo).toString()}
            tone="purple"
            helper="Oportunidad comercial"
          />
          <KpiCard
            icon={<AlertTriangle className="h-5 w-5" />}
            label="Inventario crítico"
            value={lowStockProducts.toString()}
            tone="rose"
            helper="Requieren atención"
            trend="-15%"
          />
        </section>

        <DashboardCard
          title="Rendimiento semanal"
          description="Ventas y pedidos de los últimos 7 días"
          action={<TrendBadge>+12.5%</TrendBadge>}
        >
          <WeeklyChart data={weeklyPerformance} />
        </DashboardCard>

        <section id="inventario" className="space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight">
                Inventario actual
              </h2>
              <p className="mt-2 text-base font-semibold text-slate-500">
                Estos precios, stocks y estados provienen de cada lugar.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <PrimaryAction variant="outline">
                <CalendarDays className="h-4 w-4" />
                Filtrar
              </PrimaryAction>
              <PrimaryAction
                href={`/business/products/${selectedBusiness}/new`}
              >
                <Plus className="h-4 w-4" />
                Agregar producto
              </PrimaryAction>
            </div>
          </div>

          {products.length === 0 ? (
            <EmptyState message="Aún no hay productos registrados para este negocio. Agrega el primero para comenzar." />
          ) : (
            <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50 text-left text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Producto</th>
                      <th className="px-6 py-4">Precio</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4">Margen</th>
                      <th className="px-6 py-4">Oferta</th>
                      <th className="px-6 py-4">Actualizado</th>
                      <th className="px-6 py-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {products.slice(0, 5).map((product) => (
                      <tr
                        key={product.id}
                        className="transition hover:bg-orange-50/35"
                      >
                        <td className="px-6 py-5">
                          <p className="font-black text-slate-950">
                            {product.nombre}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-500">
                            {product.categoria} · {product.estado}
                          </p>
                        </td>
                        <td className="px-6 py-5 text-lg font-black text-slate-950">
                          {peso.format(product.precio)}
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-2 font-black ${
                              product.stock <= 10
                                ? "text-rose-600"
                                : "text-slate-950"
                            }`}
                          >
                            {product.stock}
                            {product.stock <= 10 ? (
                              <AlertTriangle className="h-4 w-4" />
                            ) : null}
                          </span>
                        </td>
                        <td className="px-6 py-5 font-semibold text-slate-500">
                          {product.margen}%
                        </td>
                        <td className="px-6 py-5">
                          <PromoBadge promotion={product.promocion} />
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-semibold">
                            {formatDate(product.actualizadoEn)}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleUpdateStock(product.id)}
                            className="mt-1 text-sm font-black text-orange-600 hover:text-orange-700"
                          >
                            Actualizar stock
                          </button>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleUpdatePrice(product.id)}
                              className="font-black text-orange-600 hover:text-orange-700"
                            >
                              Editar precio
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(product.id)}
                              className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                              aria-label={`Cambiar estado de ${product.nombre}`}
                            >
                              <MoreVertical className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {products.length > 5 ? (
                <div className="border-t border-slate-200 px-6 py-4 text-center">
                  <Link
                    href={`/business/products/${selectedBusiness}`}
                    className="font-black text-orange-600 hover:text-orange-700"
                  >
                    Ver todos los productos ({products.length}) →
                  </Link>
                </div>
              ) : null}
            </div>
          )}
        </section>

        <section id="catalogo" className="grid gap-6 xl:grid-cols-2">
          <DashboardCard
            title="Resumen por categoría"
            description="Monitor equilibrado de la oferta de cada sección."
          >
            {categorySummary.length === 0 ? (
              <EmptyState message="Sin categorías registradas todavía." />
            ) : (
              <ul className="grid gap-4">
                {categorySummary.slice(0, 4).map((category) => (
                  <li
                    key={category.name}
                    className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-5 py-4"
                  >
                    <div>
                      <p className="text-lg font-black text-slate-950">
                        {category.name}
                      </p>
                      <p className="mt-1 font-semibold text-slate-500">
                        {category.productos} productos ·{" "}
                        {category.desabastecidos} desabastecidos
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-orange-600">
                        {category.porcentaje}% desabastecidos
                      </span>
                      <ChevronRight className="h-5 w-5 text-slate-400" />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </DashboardCard>

          <DashboardCard
            title="Alertas de stock"
            description="Revisa y actualiza los productos con inventario crítico."
            icon={<AlertTriangle className="h-5 w-5" />}
          >
            {lowStockList.length === 0 ? (
              <EmptyState message="Todo en orden. No hay alertas de stock." />
            ) : (
              <ul className="grid gap-3">
                {lowStockList.map((product) => (
                  <li
                    key={product.id}
                    className="flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-black text-slate-950">
                        {product.nombre}
                      </p>
                      <p className="mt-1 font-semibold text-slate-500">
                        Stock actual:{" "}
                        <span className="text-rose-600">{product.stock}</span> ·
                        Margen {product.margen}%
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUpdateStock(product.id)}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-5 font-black text-rose-600 transition hover:bg-rose-100"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Reabastecer
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </DashboardCard>
        </section>

        <DashboardCard
          title="Promociones activas"
          description="Ajusta descuentos y vigencia de campañas."
          icon={<Tag className="h-5 w-5" />}
        >
          {promoProducts.length === 0 ? (
            <div className="rounded-2xl border border-orange-200 bg-orange-50 px-6 py-12 text-center">
              <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-white text-orange-600 shadow-sm">
                <Tag className="h-8 w-8" />
              </span>
              <h3 className="mt-6 text-xl font-black">
                No hay promociones activas
              </h3>
              <p className="mx-auto mt-3 max-w-md font-semibold text-slate-500">
                Crea una oferta desde acciones rápidas para impulsar las ventas
                de productos específicos.
              </p>
              <button
                type="button"
                onClick={handleBulkDiscount}
                className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-orange-600 px-7 font-black text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700"
              >
                <Plus className="h-5 w-5" />
                Crear promoción
              </button>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {promoProducts.map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4"
                >
                  <p className="font-black text-slate-950">{product.nombre}</p>
                  <p className="mt-1 font-semibold text-slate-500">
                    {product.promocion} · {peso.format(product.precio)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </DashboardCard>
      </div>
    </main>
  );
}

function StatItem({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.28em] text-white/70">
        {label}
      </dt>
      <dd className="mt-1 text-xl font-black leading-none">{value}</dd>
      {helper ? (
        <p className="mt-1 text-xs font-semibold text-white/70 line-clamp-1">
          {helper}
        </p>
      ) : null}
    </div>
  );
}

function PrimaryAction({
  children,
  variant = "solid",
  href,
  onClick,
  className = "",
}: {
  children: ReactNode;
  variant?: "solid" | "outline" | "soft";
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  const base =
    "inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-black transition focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2";
  const styles =
    variant === "solid"
      ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20 hover:bg-orange-700"
      : variant === "outline"
        ? "border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-orange-50"
        : "bg-orange-50 text-orange-700 hover:bg-orange-100";

  if (href) {
    return (
      <Link href={href} className={`${base} ${styles} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

function KpiCard({
  icon,
  label,
  value,
  helper,
  tone = "orange",
  trend,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  helper?: string;
  tone?: "orange" | "green" | "purple" | "rose";
  trend?: string;
}) {
  const palette = {
    icon:
      tone === "rose"
        ? "bg-rose-50 text-rose-600"
        : tone === "green"
          ? "bg-emerald-50 text-emerald-600"
          : tone === "purple"
            ? "bg-violet-50 text-violet-600"
            : "bg-blue-50 text-blue-600",
    trend: trend?.startsWith("-")
      ? "bg-rose-50 text-rose-600"
      : "bg-emerald-50 text-emerald-600",
  };

  return (
    <article className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <span
          className={`inline-flex size-12 items-center justify-center rounded-xl ${palette.icon}`}
        >
          {icon}
        </span>
        {trend ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black ${palette.trend}`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            {trend}
          </span>
        ) : null}
      </div>
      <p className="mt-6 text-base font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-4xl font-black tracking-tight text-slate-950">
        {value}
      </p>
      {helper ? (
        <p className="mt-2 text-sm font-semibold text-slate-500">{helper}</p>
      ) : null}
    </article>
  );
}

function DashboardCard({
  title,
  description,
  children,
  action,
  icon,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <section className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          {icon ? (
            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              {icon}
            </span>
          ) : null}
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              {title}
            </h2>
            {description ? (
              <p className="mt-2 text-base font-semibold text-slate-500">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {action ? <div>{action}</div> : null}
      </header>
      {children}
    </section>
  );
}

function TrendBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-5 py-3 font-black text-emerald-700">
      <TrendingUp className="h-4 w-4" />
      {children}
    </span>
  );
}

function WeeklyChart({
  data,
}: {
  data: Array<{ label: string; value: number }>;
}) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="h-80 rounded-2xl border border-slate-100 bg-white px-4 py-5">
      <div className="flex h-60 items-end gap-4 border-b border-l border-slate-200 pl-3 sm:gap-8">
        {data.map((item) => (
          <div
            key={item.label}
            className="flex h-full flex-1 flex-col justify-end gap-3"
          >
            <div
              className="min-h-3 rounded-t-xl bg-blue-500 shadow-lg shadow-blue-500/20"
              style={{ height: `${Math.max(8, (item.value / max) * 100)}%` }}
              title={peso.format(item.value)}
            />
            <span className="text-center text-sm font-semibold text-slate-500">
              {item.label}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-center gap-5 text-sm font-bold">
        <span className="inline-flex items-center gap-2 text-orange-600">
          <span className="size-3 rounded-full bg-orange-600" />
          Ventas ($)
        </span>
        <span className="inline-flex items-center gap-2 text-blue-500">
          <span className="size-3 rounded-full bg-blue-500" />
          Pedidos
        </span>
      </div>
    </div>
  );
}

function IconButton({
  children,
  label,
  marker = false,
}: {
  children: ReactNode;
  label: string;
  marker?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="relative inline-flex size-11 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
    >
      {children}
      {marker ? (
        <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-rose-500" />
      ) : null}
    </button>
  );
}

function PromoBadge({ promotion }: { promotion: PromotionType }) {
  if (promotion === "Ninguna") {
    return (
      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-500">
        Sin promo
      </span>
    );
  }

  if (
    promotion === "Oferta" ||
    promotion === "Happy Hour" ||
    promotion === "Combo"
  ) {
    const styles =
      promotion === "Oferta"
        ? "bg-orange-50 text-orange-700"
        : promotion === "Happy Hour"
          ? "bg-blue-50 text-blue-700"
          : "bg-amber-50 text-amber-700";

    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold ${styles}`}
      >
        <span className="size-2 rounded-full bg-current" aria-hidden />
        {promotion}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-orange-700">
      <span className="size-2 rounded-full bg-current" aria-hidden />
      {promotion}
    </span>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-orange-200/60 bg-white/60 px-3 py-4 text-center text-sm text-orange-700 sm:rounded-2xl sm:px-4 sm:py-6">
      {message}
    </div>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
  });
}

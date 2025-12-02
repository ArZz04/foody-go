"use client";

import type { ReactNode } from "react";
import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";

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

const peso = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

export default function BusinessPage() {
  const [businesses, setBusinesses] = useState([]);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [businessHours, setBusinessHours] = useState<any[]>([]);
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

        const parsedBusinesses = data.businesses.map((b: any) => ({
          id: b.id,
          nombre: b.name,
          ciudad: b.city,
          categoria: "General",
        }));

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
        loadBusinessStatus(data.business.id);
      } catch (err) {
        console.error(err);
      }
    }

    fetchBusinessInfo();
  }, [selectedBusiness]);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

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
          }
        );

        const data = await res.json();

        if (!res.ok) {
          console.error("Error al cargar productos:", data);
          return;
        }

        const parsed = data.products.map((p: any) => ({
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

    setBusinessInfo(prev =>
      prev ? { ...prev, is_open_now: data.new_status } : prev
    );

    setLoadingToggle(false);
  }

  async function loadBusinessStatus(id: number) {
    setLoadingToggle(true);

    const res = await fetch(`/api/business/${id}/toggle`, {
      method: "GET"
    });

    const data = await res.json();

    setBusinessInfo(prev =>
      prev ? { ...prev, is_open_now: data.is_open_now } : prev
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
    return categories.map((c) => ({
      name: c.name,
      productos: 0,
      destacados: 0,
    }));
  }, [categories]);

  const promoProducts = useMemo(
    () =>
      products.filter((product) => product.promocion !== "Ninguna").slice(0, 4),
    [products],
  );

  function handleEditPrice(productId: string) {
    const product = products.find((item) => item.id === productId);
    if (!product) {
      return;
    }

    const raw = window.prompt(
      "Ingresa el nuevo precio (MXN):",
      product.precio.toString(),
    );
    if (raw === null) {
      return;
    }

    const normalized = raw.replace(",", ".").trim();
    if (normalized.length === 0) {
      return;
    }

    const nextPrice = Number.parseFloat(normalized);
    if (!Number.isFinite(nextPrice) || nextPrice < 0) {
      window.alert("Introduce un número válido mayor o igual a 0.");
      return;
    }

    setProducts((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, precio: nextPrice } : item,
      ),
    );
  }

  const lowStockList = useMemo(
    () =>
      products
        .filter((product) => product.stock <= 10)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 6),
    [products],
  );

  function handleUpdateStock(productId: string) {
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

    setProducts((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, stock: nextStock } : item,
      ),
    );
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
    <main className="mx-auto max-w-7xl space-y-6 px-3 py-6 sm:space-y-8 sm:px-4 sm:py-8 md:space-y-10 md:px-6 md:py-10 lg:px-8">
      {/* Sección Hero con información del negocio */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1f3029] via-[#2f4638] to-[#3f5c45] p-4 text-white shadow-xl sm:rounded-3xl sm:p-6 md:p-8 lg:p-10">
        {/* Elementos de fondo decorativos - totalmente responsivos */}
        <div
          aria-hidden="true"
          className="absolute -left-10 top-8 size-32 rounded-full bg-white/10 blur-xl sm:-left-16 sm:size-48 sm:blur-2xl md:-left-20 md:top-10 md:size-56 lg:-left-28 lg:size-64 lg:blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -right-8 -top-12 size-32 rounded-full bg-white/15 blur-xl sm:-right-12 sm:-top-16 sm:size-48 sm:blur-2xl md:-right-16 md:-top-20 md:size-56 lg:-right-24 lg:-top-24 lg:size-64 lg:blur-3xl"
        />
        
        <div className="relative grid gap-6 md:gap-8 lg:grid-cols-[1.5fr,1fr] lg:items-center">
          {/* Columna izquierda: Información del negocio */}
          <div className="space-y-4 md:space-y-6 lg:order-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-[0.3em]">
              Negocio
            </div>
            
            <div className="space-y-3 md:space-y-4">
              <h1 className="text-2xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl">
                {businessInfo?.name ?? "Cargando..."}
              </h1>

              <p className="text-sm text-white/90 sm:text-base md:text-lg lg:max-w-2xl">
                {businessInfo
                  ? `${businessInfo.category_name} en ${businessInfo.city}. Gestiona el catálogo,
                    precios y promociones de este negocio desde un único panel operativo.`
                  : "Cargando descripción..."}
              </p>
            </div>
            
            <dl className="grid gap-3 text-sm sm:grid-cols-2 md:grid-cols-3 md:gap-4">
              <StatItem
                label="Productos activos"
                value={`${activeProducts}/${totalProducts}`}
              />
              <StatItem
                label="Promociones activas"
                value={productsOnPromo.toString()}
                helper="Descuentos, combos y happy hour"
              />
              <StatItem
                label="Inventario crítico"
                value={lowStockProducts.toString()}
                helper="Stock menores a 10 unidades"
              />
            </dl>
            
            <div className="grid gap-3 rounded-xl bg-white/15 p-3 text-xs uppercase tracking-[0.2em] sm:rounded-2xl sm:p-4">
              <div className="space-y-1 text-white/80">
                <span>FISCAL</span>
                <p className="text-sm normal-case tracking-normal text-white">
                  {businessInfo?.legal_name ?? "—"} · RFC {businessInfo?.tax_id ?? "—"}
                </p>
              </div>
              
              <div className="space-y-1 text-white/80">
                <span>Horario</span>
                {businessHours?.slice(0, 2).map((h) => (
                  <p key={h.day_of_week} className="text-sm normal-case tracking-normal text-white">
                    {h.is_closed
                      ? `${h.day_name}: Cerrado`
                      : !h.open_time
                        ? `${h.day_name}: No definido`
                        : `${h.day_name}: ${h.open_time} – ${h.close_time} hrs`}
                  </p>
                ))}
                {businessHours?.length > 2 && (
                  <p className="text-sm normal-case tracking-normal text-white/70">
                    +{businessHours.length - 2} días más
                  </p>
                )}
              </div>

              <Link
                href={`/admin/negocios/hardid`}
                className="inline-flex items-center gap-2 text-sm font-semibold normal-case tracking-normal text-white transition hover:opacity-80"
              >
                Editar Horarios <span aria-hidden>→</span>
              </Link>
            </div>
            
            {/* Botón para abrir/cerrar negocio - responsive */}
            <button
              onClick={() => businessInfo && toggleBusiness(businessInfo.id)}
              disabled={loadingToggle || !businessInfo}
              className={`
                w-full rounded-xl px-4 py-2.5 text-sm font-medium transition-all border
                sm:w-auto sm:text-base
                ${loadingToggle || !businessInfo
                  ? "bg-gray-300 text-gray-600 border-gray-400 cursor-not-allowed"
                  : businessInfo.is_open_now === 1
                    ? "bg-red-600 text-white border-red-700 hover:bg-red-700"
                    : "bg-green-600 text-white border-green-700 hover:bg-green-700"
                }
              `}
            >
              {loadingToggle || !businessInfo
                ? "Cargando..."
                : businessInfo.is_open_now === 1
                  ? "Cerrar negocio"
                  : "Abrir negocio"}
            </button>
          </div>
          
          {/* Columna derecha: Tabs para seleccionar negocio */}
          <div className="lg:order-2">
            <BusinessTabs
              businesses={businesses}
              selectedId={selectedBusiness}
              onSelect={(id) => setSelectedBusiness(id)}
            />
          </div>
        </div>
      </section>

      {/* Sección de Acciones Rápidas */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-white drop-shadow sm:text-2xl">
            Acciones rápidas
          </h2>
          <p className="text-sm text-[#f4f8f0] sm:text-base">
            Ejecuta tareas clave en tu catálogo sin salir del panel principal.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <PrimaryAction href={`/business/products/${selectedBusiness}/new`}>
            + Agregar producto
          </PrimaryAction>
          <PrimaryAction href={`/business/categories/${selectedBusiness}/new`}>
            + Agregar categoría
          </PrimaryAction>
          <PrimaryAction variant="outline" className="hidden sm:inline-flex">
            Importar catálogo
          </PrimaryAction>
          <PrimaryAction variant="soft" onClick={() => handleBulkDiscount()}>
            Aplicar rebaja
          </PrimaryAction>
        </div>
      </section>

      {/* KPI Cards - 1 col móvil, 2 col tablet, 4 col desktop */}
      <section aria-label="Indicadores principales" className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <KpiCard
          label="Productos totales"
          value={totalProducts.toString()}
          helper="Incluye activos, borradores y agotados"
        />
        <KpiCard
          label="Activos en catálogo"
          value={activeProducts.toString()}
          tone="teal"
          helper="Listos para la app y web"
        />
        <KpiCard
          label="En promoción"
          value={productsOnPromo.toString()}
          tone="emerald"
          helper="Descuentos visibles al cliente"
        />
        <KpiCard
          label="Inventario crítico"
          value={lowStockProducts.toString()}
          tone="rose"
          helper="Necesitan resurtido"
        />
      </section>

      {/* Tabla de productos y Resumen por categoría - Responsive */}
      <section className="grid gap-6 lg:grid-cols-1 xl:grid-cols-[2fr,1fr]">
        {/* Tabla de productos */}
        <DashboardCard
          title="Inventario actual"
          description="Edita precios, stock y estado desde un solo lugar."
        >
          {products.length === 0 ? (
            <EmptyState message="Aún no hay productos registrados para este negocio. Agrega el primero para comenzar." />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-emerald-200/60 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-emerald-100/70 text-sm">
                <thead className="bg-emerald-50/80 text-left text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  <tr>
                    <th className="px-3 py-2 sm:px-4 sm:py-3">Producto</th>
                    <th className="px-3 py-2 sm:px-4 sm:py-3 hidden md:table-cell">Precio</th>
                    <th className="px-3 py-2 sm:px-4 sm:py-3">Stock</th>
                    <th className="px-3 py-2 sm:px-4 sm:py-3 hidden lg:table-cell">Margen</th>
                    <th className="px-3 py-2 sm:px-4 sm:py-3 hidden sm:table-cell">Oferta</th>
                    <th className="px-3 py-2 sm:px-4 sm:py-3 hidden xl:table-cell">Actualizado</th>
                    <th className="px-3 py-2 sm:px-4 sm:py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100 bg-white text-emerald-900">
                  {products.slice(0, 5).map((product) => (
                    <tr key={product.id} className="transition hover:bg-emerald-50/50">
                      <td className="px-3 py-2 sm:px-4 sm:py-3">
                        <div className="flex flex-col">
                          <span className="font-semibold line-clamp-1">
                            {product.nombre}
                          </span>
                          <span className="text-xs text-emerald-900/60">
                            {product.categoria} · {product.estado}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 font-semibold hidden md:table-cell">
                        {peso.format(product.precio)}
                      </td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3">
                        <span className={product.stock <= 10 ? "font-semibold text-rose-600" : ""}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs text-emerald-900/60 hidden lg:table-cell">
                        {peso.format(product.costo)} · {product.margen}%
                      </td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 hidden sm:table-cell">
                        <PromoBadge promotion={product.promocion} />
                      </td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs text-emerald-900/60 hidden xl:table-cell">
                        {formatDate(product.actualizadoEn)}
                      </td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3">
                        <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-2">
                          <TableAction
                            onClick={() => handleEditPrice(product.id)}
                            className="text-xs sm:text-xs"
                          >
                            Editar precio
                          </TableAction>
                          <TableAction
                            onClick={() => handleUpdateStock(product.id)}
                            className="text-xs sm:text-xs"
                          >
                            Actualizar stock
                          </TableAction>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length > 5 && (
                <div className="border-t border-emerald-100/70 bg-emerald-50/50 px-4 py-3 text-center">
                  <Link 
                    href={`/business/products/${selectedBusiness}`}
                    className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    Ver todos los productos ({products.length}) →
                  </Link>
                </div>
              )}
            </div>
          )}
        </DashboardCard>

        {/* Resumen por categoría */}
        <DashboardCard
          title="Resumen por categoría"
          description="Mantén equilibrada la oferta de cada sección."
        >
          {categorySummary.length === 0 ? (
            <EmptyState message="Sin categorías registradas todavía." />
          ) : (
            <ul className="space-y-3 text-sm">
              {categorySummary.slice(0, 4).map((cat) => (
                <li
                  key={cat.name}
                  className="flex items-center justify-between rounded-xl bg-white/90 px-3 py-2.5 shadow-sm ring-1 ring-emerald-200/50 sm:rounded-2xl sm:px-4 sm:py-3"
                >
                  <div>
                    <p className="font-semibold text-emerald-700 line-clamp-1">
                      {cat.name}
                    </p>
                    <p className="text-xs text-emerald-900/70">
                      {cat.productos} productos · {cat.destacados} destacados
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 sm:px-3">
                    0% destacados
                  </span>
                </li>
              ))}
              {categorySummary.length > 4 && (
                <li className="text-center">
                  <Link 
                    href={`/business/categories/${selectedBusiness}`}
                    className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    Ver todas las categorías ({categorySummary.length}) →
                  </Link>
                </li>
              )}
            </ul>
          )}
        </DashboardCard>
      </section>

      {/* Promociones y Alertas de Stock */}
      <section className="grid gap-6 lg:grid-cols-1 xl:grid-cols-[1.4fr,1fr]">
        {/* Promociones activas */}
        <DashboardCard
          title="Promociones activas"
          description="Ajusta descuentos y vigencia de campañas."
        >
          {promoProducts.length === 0 ? (
            <EmptyState message="No hay promociones activas. Crea una oferta desde acciones rápidas." />
          ) : (
            <div className="space-y-3 text-sm">
              {promoProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-2 rounded-xl bg-emerald-500/10 px-3 py-2.5 shadow-sm ring-1 ring-emerald-200/60 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:rounded-2xl sm:px-4 sm:py-3"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-emerald-800 line-clamp-1">
                      {product.nombre}
                    </p>
                    <p className="text-xs text-emerald-900/70">
                      {product.promocion} · Precio actual {peso.format(product.precio)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <TableAction className="text-xs">Editar</TableAction>
                    <TableAction variant="ghost" className="text-xs">
                      Finalizar
                    </TableAction>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardCard>

        {/* Alertas de stock */}
        <DashboardCard
          title="Alertas de stock"
          description="Revisa y actualiza los productos con inventario crítico."
        >
          {lowStockList.length === 0 ? (
            <EmptyState message="Todo en orden. No hay alertas de stock." />
          ) : (
            <ul className="space-y-3 text-sm">
              {lowStockList.map((product) => (
                <li
                  key={product.id}
                  className="rounded-xl bg-white/90 px-3 py-2.5 shadow-sm ring-1 ring-rose-200/60 sm:rounded-2xl sm:px-4 sm:py-3"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-rose-600 line-clamp-1">
                        {product.nombre}
                      </p>
                      <p className="text-xs text-rose-900/60">
                        Stock actual {product.stock} · Margen {product.margen}%
                      </p>
                    </div>
                    <TableAction className="text-xs whitespace-nowrap">
                      Reabastecer
                    </TableAction>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>
      </section>
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
      <dt className="text-xs uppercase tracking-[0.3em] text-white/70">
        {label}
      </dt>
      <dd className="mt-1 text-base font-semibold sm:text-lg">{value}</dd>
      {helper ? <p className="text-xs text-white/70 line-clamp-1">{helper}</p> : null}
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
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:px-4 sm:py-2.5";
  const styles =
    variant === "solid"
      ? "bg-white text-[#264c36] shadow-lg hover:bg-[#f7f6ef]"
      : variant === "outline"
        ? "border border-[#cddccf] bg-white text-[#264c36] hover:bg-[#f7f6ef]"
        : "bg-white/80 text-[#264c36] hover:bg-white";
  
  if (href) {
    return (
      <Link href={href} className={`${base} ${styles} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}

function KpiCard({
  label,
  value,
  helper,
  tone = "emerald",
}: {
  label: string;
  value: string;
  helper?: string;
  tone?: "emerald" | "teal" | "rose";
}) {
  const palette =
    tone === "rose"
      ? "from-rose-200/90 to-rose-400/80 text-rose-700"
      : tone === "teal"
        ? "from-teal-200/90 to-sky-300/80 text-teal-700"
        : "from-emerald-200/90 to-emerald-400/80 text-emerald-700";

  return (
    <div className={`rounded-[16px] bg-gradient-to-br ${palette} p-0.5 sm:rounded-[18px]`}>
      <div className="rounded-[15px] bg-white/95 px-3 py-4 shadow-sm ring-1 ring-white/70 sm:rounded-[16px] sm:px-4 sm:py-5">
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-900/50 line-clamp-1">
          {label}
        </p>
        <p className="mt-1 text-2xl font-semibold sm:mt-2 sm:text-3xl">{value}</p>
        {helper ? (
          <p className="mt-1 text-xs text-emerald-900/60 line-clamp-1 sm:line-clamp-2">
            {helper}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl bg-white/95 p-4 shadow-lg ring-1 ring-emerald-200/60 backdrop-blur-sm sm:rounded-2xl sm:p-6">
      <header className="mb-3 space-y-1 sm:mb-4">
        <h2 className="text-lg font-semibold text-emerald-800 sm:text-xl">
          {title}
        </h2>
        {description ? (
          <p className="text-sm text-emerald-900/70 line-clamp-2">
            {description}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  );
}

function PromoBadge({ promotion }: { promotion: PromotionType }) {
  if (promotion === "Ninguna") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 sm:gap-2 sm:px-3 sm:py-1">
        — Sin promo
      </span>
    );
  }

  if (
    promotion === "Oferta" ||
    promotion === "Happy Hour" ||
    promotion === "Combo"
  ) {
    const palette =
      promotion === "Oferta"
        ? "bg-emerald-500/10 text-emerald-700"
        : promotion === "Happy Hour"
          ? "bg-sky-500/10 text-sky-700"
          : "bg-amber-500/10 text-amber-700";

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold sm:gap-2 sm:px-3 sm:py-1 ${palette}`}
      >
        <span className="size-1.5 rounded-full bg-current sm:size-2" aria-hidden />
        {promotion}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700 sm:gap-2 sm:px-3 sm:py-1">
      <span className="size-1.5 rounded-full bg-current sm:size-2" aria-hidden />
      {promotion}
    </span>
  );
}

function TableAction({
  children,
  variant = "solid",
  onClick,
  className = "",
}: {
  children: ReactNode;
  variant?: "solid" | "ghost";
  onClick?: () => void;
  className?: string;
}) {
  const base = "inline-flex items-center justify-center rounded-lg px-2 py-1 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:px-3 sm:py-1.5";
  const styles =
    variant === "solid"
      ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20"
      : "text-emerald-700 hover:text-emerald-500";

  return (
    <button type="button" onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-emerald-200/60 bg-white/60 px-3 py-4 text-center text-sm text-emerald-700 sm:rounded-2xl sm:px-4 sm:py-6">
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
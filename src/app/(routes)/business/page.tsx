"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { businesses } from "@/app/admin/data/businesses";

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

const BUSINESS_PRODUCTS: Record<number, Product[]> = {
  1: [
    {
      id: "CAF-101",
      nombre: "Latte con almendra",
      categoria: "Bebidas calientes",
      precio: 65,
      stock: 28,
      costo: 32,
      margen: 51,
      estado: "Activo",
      promocion: "Oferta",
      destacado: true,
      actualizadoEn: "2024-06-10T09:30:00",
    },
    {
      id: "CAF-118",
      nombre: "Cold Brew Vainilla",
      categoria: "Bebidas frías",
      precio: 72,
      stock: 12,
      costo: 36,
      margen: 50,
      estado: "Activo",
      promocion: "Happy Hour",
      actualizadoEn: "2024-06-09T18:00:00",
    },
    {
      id: "CAF-134",
      nombre: "Rebanada pastel de zanahoria",
      categoria: "Repostería",
      precio: 58,
      stock: 6,
      costo: 27,
      margen: 53,
      estado: "Activo",
      promocion: "Ninguna",
      actualizadoEn: "2024-06-08T12:40:00",
    },
    {
      id: "CAF-142",
      nombre: "Panini de pavo y queso",
      categoria: "Snacks",
      precio: 85,
      stock: 18,
      costo: 41,
      margen: 52,
      estado: "Activo",
      promocion: "Combo",
      actualizadoEn: "2024-06-10T07:15:00",
    },
    {
      id: "CAF-155",
      nombre: "Galleta doble chocolate",
      categoria: "Repostería",
      precio: 32,
      stock: 48,
      costo: 14,
      margen: 56,
      estado: "Activo",
      promocion: "Ninguna",
      actualizadoEn: "2024-06-10T08:05:00",
    },
  ],
  2: [
    {
      id: "TAC-200",
      nombre: "Taco al pastor",
      categoria: "Tacos",
      precio: 28,
      stock: 210,
      costo: 12,
      margen: 57,
      estado: "Activo",
      promocion: "Happy Hour",
      destacado: true,
      actualizadoEn: "2024-06-10T00:05:00",
    },
    {
      id: "TAC-212",
      nombre: "Orden de costilla",
      categoria: "Especiales",
      precio: 98,
      stock: 32,
      costo: 45,
      margen: 54,
      estado: "Activo",
      promocion: "Ninguna",
      actualizadoEn: "2024-06-09T22:45:00",
    },
    {
      id: "TAC-233",
      nombre: "Gringas pastor",
      categoria: "Especiales",
      precio: 69,
      stock: 8,
      costo: 31,
      margen: 55,
      estado: "Activo",
      promocion: "Oferta",
      actualizadoEn: "2024-06-09T21:25:00",
    },
    {
      id: "TAC-248",
      nombre: "Volcán de sirloin",
      categoria: "Antojitos",
      precio: 44,
      stock: 4,
      costo: 21,
      margen: 52,
      estado: "Agotado",
      promocion: "Ninguna",
      actualizadoEn: "2024-06-08T23:05:00",
    },
  ],
  3: [
    {
      id: "PAN-301",
      nombre: "Concha tradicional",
      categoria: "Pan dulce",
      precio: 18,
      stock: 86,
      costo: 6,
      margen: 67,
      estado: "Activo",
      promocion: "Oferta",
      destacado: true,
      actualizadoEn: "2024-06-10T06:45:00",
    },
    {
      id: "PAN-327",
      nombre: "Baguette integral",
      categoria: "Pan artesanal",
      precio: 42,
      stock: 14,
      costo: 18,
      margen: 57,
      estado: "Activo",
      promocion: "Ninguna",
      actualizadoEn: "2024-06-09T16:20:00",
    },
    {
      id: "PAN-333",
      nombre: "Pay de queso",
      categoria: "Pasteles",
      precio: 85,
      stock: 3,
      costo: 39,
      margen: 54,
      estado: "Agotado",
      promocion: "Combo",
      actualizadoEn: "2024-06-09T13:40:00",
    },
  ],
};

const BUSINESS_COVER_IMAGES: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1400&q=80",
  2: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1400&q=80",
  3: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1400&q=80",
};

const peso = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

export default function BusinessPage() {
  const businessOwnerId = businesses[0]?.id ?? 1;

  const business = useMemo(
    () =>
      businesses.find((item) => item.id === businessOwnerId) ?? businesses[0],
    [businessOwnerId],
  );

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const data = BUSINESS_PRODUCTS[business.id] ?? [];
    setProducts(data.map((item) => ({ ...item })));
  }, [business.id]);

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

  const categorySummary = useMemo(
    () =>
      products.reduce<Record<string, { count: number; destacados: number }>>(
        (acc, product) => {
          if (!acc[product.categoria]) {
            acc[product.categoria] = { count: 0, destacados: 0 };
          }
          acc[product.categoria].count += 1;
          if (product.destacado) {
            acc[product.categoria].destacados += 1;
          }
          return acc;
        },
        {},
      ),
    [products],
  );

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

  const businessCover =
    BUSINESS_COVER_IMAGES[business.id] ?? BUSINESS_COVER_IMAGES[1];

  return (
    <main className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1f3029] via-[#2f4638] to-[#3f5c45] p-6 text-white shadow-xl sm:p-10">
        <div
          aria-hidden
          className="absolute -left-28 top-10 size-64 rounded-full bg-white/15 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -right-24 -top-24 size-64 rounded-full bg-white/20 blur-3xl"
        />
        <div className="relative grid gap-8 lg:grid-cols-[1.5fr,1fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-[0.3em]">
              Negocio
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold md:text-4xl lg:text-5xl">
                {business.nombre}
              </h1>
              <p className="max-w-2xl text-sm text-white/90 md:text-base lg:text-lg">
                {business.categoria} en {business.ciudad}. Gestiona el catálogo,
                precios y promociones de este negocio desde un único panel
                operativo.
              </p>
            </div>
            <dl className="grid gap-4 text-sm md:grid-cols-3">
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
                label="Criticidad de inventario"
                value={lowStockProducts.toString()}
                helper="Revisa niveles menores a 10 unidades"
              />
            </dl>
            <div className="grid gap-3 rounded-2xl bg-white/15 p-4 text-xs uppercase tracking-[0.2em]">
              <div className="space-y-1 text-white/80">
                <span>Contacto</span>
                <p className="text-sm normal-case tracking-normal text-white">
                  {business.contacto} · {business.telefono}
                </p>
              </div>
              <div className="space-y-1 text-white/80">
                <span>Horario</span>
                <p className="text-sm normal-case tracking-normal text-white">
                  {business.horario.dias} · {business.horario.apertura} –{" "}
                  {business.horario.cierre} hrs
                </p>
              </div>
              <Link
                href={`/admin/negocios/${business.id}`}
                className="inline-flex items-center gap-2 text-sm font-semibold normal-case tracking-normal text-white transition hover:opacity-80"
              >
                Ver perfil completo <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
          <figure className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
            <img
              src={businessCover}
              alt={`Imagen de ${business.nombre}`}
              className="h-full w-full object-cover"
            />
            <figcaption className="absolute bottom-4 left-4 right-4 rounded-xl bg-black/40 px-4 py-3 text-xs uppercase tracking-[0.3em] text-white/80">
              {business.ciudad} · Desde{" "}
              {new Date(business.creadoEn).toLocaleDateString("es-MX", {
                month: "short",
                year: "numeric",
              })}
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-white drop-shadow-[0_1px_6px_rgba(31,48,41,0.45)]">
            Acciones rápidas
          </h2>
          <p className="text-sm text-[#f4f8f0] drop-shadow-[0_1px_4px_rgba(31,48,41,0.35)]">
            Ejecuta tareas clave en tu catálogo sin salir del panel principal.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <PrimaryAction href="/business/products/new">
            + Agregar producto
          </PrimaryAction>
          <PrimaryAction variant="outline">Importar catálogo</PrimaryAction>
          <PrimaryAction variant="soft" onClick={() => handleBulkDiscount()}>
            Aplicar rebaja masiva
          </PrimaryAction>
        </div>
      </section>

      <section
        aria-label="Indicadores principales"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
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

      <section className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <DashboardCard
          title="Inventario actual"
          description="Edita precios, stock y estado desde un solo lugar."
        >
          {products.length === 0 ? (
            <EmptyState message="Aún no hay productos registrados para este negocio. Agrega el primero para comenzar." />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-emerald-200/60 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
              <table className="min-w-full divide-y divide-emerald-100/70 text-sm">
                <thead className="bg-emerald-50/80 text-left text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  <tr>
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3">Precio</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Margen</th>
                    <th className="px-4 py-3">Oferta</th>
                    <th className="px-4 py-3">Actualizado</th>
                    <th className="px-4 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100 bg-white text-emerald-900 dark:bg-transparent dark:text-emerald-100">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="transition hover:bg-emerald-50/50 dark:hover:bg-white/10"
                    >
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            {product.nombre}
                          </span>
                          <span className="text-xs text-emerald-900/60 dark:text-emerald-200/70">
                            {product.categoria} · {product.estado}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {peso.format(product.precio)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            product.stock <= 10
                              ? "font-semibold text-rose-600 dark:text-rose-300"
                              : ""
                          }
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-emerald-900/60 dark:text-emerald-200/70">
                        {peso.format(product.costo)} · {product.margen}%
                      </td>
                      <td className="px-4 py-3">
                        <PromoBadge promotion={product.promocion} />
                      </td>
                      <td className="px-4 py-3 text-xs text-emerald-900/60 dark:text-emerald-200/70">
                        {formatDate(product.actualizadoEn)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          <TableAction
                            onClick={() => handleEditPrice(product.id)}
                          >
                            Editar precio
                          </TableAction>
                          <TableAction
                            onClick={() => handleUpdateStock(product.id)}
                          >
                            Actualizar stock
                          </TableAction>
                          <TableAction
                            variant="ghost"
                            onClick={() => handleToggleStatus(product.id)}
                          >
                            {product.estado === "Activo"
                              ? "Desactivar"
                              : "Activar"}
                          </TableAction>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DashboardCard>

        <DashboardCard
          title="Resumen por categoría"
          description="Mantén equilibrada la oferta de cada sección."
        >
          {Object.keys(categorySummary).length === 0 ? (
            <EmptyState message="Sin categorías registradas todavía." />
          ) : (
            <ul className="space-y-3 text-sm">
              {Object.entries(categorySummary).map(([category, info]) => (
                <li
                  key={category}
                  className="flex items-center justify-between rounded-2xl bg-white/90 px-4 py-3 shadow-sm ring-1 ring-emerald-200/50 dark:bg-white/5 dark:ring-white/10"
                >
                  <div>
                    <p className="font-semibold text-emerald-700 dark:text-emerald-300">
                      {category}
                    </p>
                    <p className="text-xs text-emerald-900/70 dark:text-emerald-200/70">
                      {info.count} productos · {info.destacados} destacados
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
                    {(
                      (info.destacados / Math.max(info.count, 1)) *
                      100
                    ).toFixed(0)}
                    % destacados
                  </span>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr,1fr]">
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
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-emerald-500/10 px-4 py-3 shadow-sm ring-1 ring-emerald-200/60 dark:bg-white/5 dark:ring-white/10"
                >
                  <div>
                    <p className="font-semibold text-emerald-800 dark:text-emerald-200">
                      {product.nombre}
                    </p>
                    <p className="text-xs text-emerald-900/70 dark:text-emerald-200/70">
                      {product.promocion} · Precio actual{" "}
                      {peso.format(product.precio)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <TableAction>Editar promo</TableAction>
                    <TableAction variant="ghost">Finalizar</TableAction>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardCard>

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
                  className="rounded-2xl bg-white/90 px-4 py-3 shadow-sm ring-1 ring-rose-200/60 dark:bg-white/5 dark:ring-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-rose-600 dark:text-rose-300">
                        {product.nombre}
                      </p>
                      <p className="text-xs text-rose-900/60 dark:text-rose-200/70">
                        Stock actual {product.stock} · Margen {product.margen}%
                      </p>
                    </div>
                    <TableAction>Reabastecer</TableAction>
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
      <dd className="mt-1 text-lg font-semibold">{value}</dd>
      {helper ? <p className="text-xs text-white/70">{helper}</p> : null}
    </div>
  );
}

function PrimaryAction({
  children,
  variant = "solid",
  href,
  onClick,
}: {
  children: ReactNode;
  variant?: "solid" | "outline" | "soft";
  href?: string;
  onClick?: () => void;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#b7ccb8]";
  const styles =
    variant === "solid"
      ? "bg-white text-[#264c36] shadow-lg hover:bg-[#f7f6ef]"
      : variant === "outline"
        ? "border border-[#cddccf] bg-white text-[#264c36] hover:bg-[#f7f6ef]"
        : "bg-white/80 text-[#264c36] hover:bg-white";
  if (href) {
    return (
      <Link href={href} className={`${base} ${styles}`}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`${base} ${styles}`}>
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
    <div className={`rounded-[18px] bg-gradient-to-br ${palette} p-0.5`}>
      <div className="rounded-[16px] bg-white/95 px-4 py-5 shadow-sm ring-1 ring-white/70 dark:bg-zinc-900/80">
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-900/50">
          {label}
        </p>
        <p className="mt-2 text-3xl font-semibold">{value}</p>
        {helper ? (
          <p className="mt-1 text-xs text-emerald-900/60">{helper}</p>
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
    <section className="rounded-3xl bg-white/95 p-6 shadow-lg ring-1 ring-emerald-200/60 backdrop-blur-sm dark:bg-white/10 dark:ring-white/10">
      <header className="mb-4 space-y-1">
        <h2 className="text-xl font-semibold text-emerald-800 dark:text-emerald-200">
          {title}
        </h2>
        {description ? (
          <p className="text-sm text-emerald-900/70 dark:text-emerald-200/70">
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
      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
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
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${palette}`}
      >
        <span className="size-2 rounded-full bg-current" aria-hidden />
        {promotion}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700">
      <span className="size-2 rounded-full bg-current" aria-hidden />
      {promotion}
    </span>
  );
}

function TableAction({
  children,
  variant = "solid",
  onClick,
}: {
  children: ReactNode;
  variant?: "solid" | "ghost";
  onClick?: () => void;
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500";
  const styles =
    variant === "solid"
      ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20"
      : "text-emerald-700 hover:text-emerald-500";

  return (
    <button type="button" onClick={onClick} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-emerald-200/60 bg-white/60 px-4 py-6 text-center text-sm text-emerald-700 dark:border-white/20 dark:bg-white/5 dark:text-emerald-200">
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

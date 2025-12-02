"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";

export default function NewProductClient({ businessId }: { businessId: number }) {
  const businessIdNumber = Number(businessId);

  console.log("businessId:", businessIdNumber);
  // ============================
  // 📌 Estados principales
  // ============================

  // Identidad del producto
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");

  const [name, setName] = useState("");
  const [descriptionShort, setDescriptionShort] = useState("");
  const [descriptionLong, setDescriptionLong] = useState("");

  // Categorías
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [subcategoryId, setSubcategoryId] = useState<number | null>(null);

  // Precios
  const [price, setPrice] = useState<number>(0);
  const [discountPrice, setDiscountPrice] = useState<number | null>(null);
  const [currency, setCurrency] = useState("MXN");

  const [saleFormat, setSaleFormat] = useState("pieza");
  const [pricePerUnit, setPricePerUnit] = useState<number | null>(null);

  // Impuestos
  const [taxIncluded, setTaxIncluded] = useState(true);
  const [taxRate, setTaxRate] = useState<number>(16);
  const [commissionRate, setCommissionRate] = useState<number | null>(null);

  // Stock
  const [isStockAvailable, setIsStockAvailable] = useState(true);
  const [stockAverage, setStockAverage] = useState<number>(0);
  const [stockDanger, setStockDanger] = useState<number>(0);

  // Restricciones por pedido
  const [maxPerOrder, setMaxPerOrder] = useState<number>(10);
  const [minPerOrder, setMinPerOrder] = useState<number>(1);

  // Promociones
  const [promotionId, setPromotionId] = useState<number | null>(null);

  // Imagen (deshabilitada)
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);

  // Fechas
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  // Status
  const [statusId, setStatusId] = useState<number>(1); // activo

  // ============================
  // 📌 Clases de input
  // ============================

  const inputClass =
    "w-full rounded-lg border border-[#d6e3d0] bg-white/95 px-3 py-2.5 text-sm shadow-sm transition focus:border-[#4c956c] focus:outline-none focus:ring-2 focus:ring-[#c5ead1] sm:rounded-xl sm:px-4 sm:py-3";

  // ============================
  // 📌 Cargar categorías dinámicas
  // ============================
useEffect(() => {
  async function loadCategories() {
    try {
      const token = typeof window !== "undefined" 
        ? localStorage.getItem("token")
        : null;

      const res = await fetch("/api/categories/" + businessId, {
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
        },
      });

      const data = await res.json();

      if (data.categories) {
        setCategories(data.categories);

        if (data.categories.length > 0) {
          setCategoryId(data.categories[0].id);
        }
      }
    } catch (err) {
      console.error("Error cargando categorías:", err);
    }
  }

  loadCategories();
}, [businessId]);


  // ============================
  // 📌 Manejo de imagen (deshabilitada)
  // ============================

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    return; // imagen deshabilitada por ahora
  }

// ============================
// 📌 Validación mínima para permitir submit
// ============================

const canSubmit = useMemo(() => {
  return (
    name.trim().length > 0 &&
    categoryId !== null &&
    price > 0
  );
}, [name, categoryId, price]);

// ============================
// 📌 Envío a API
// ============================

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  // Generar SKU automático más corto y legible
  const skuValue = sku.trim() || `PROD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  try {
    const payload = {
      product: {
        business_id: businessId,
        sku: skuValue,
        barcode: barcode || null,
        name,
        description_long: descriptionLong || null,
        description_short: descriptionShort || null,
        product_category_id: categoryId,
        product_subcategory_id: subcategoryId || null,
        price,
        discount_price: discountPrice || null,
        currency: currency || "MXN",
        sale_format: saleFormat || "UNIDAD",
        price_per_unit: pricePerUnit || null,
        tax_included: taxIncluded ? 1 : 0,
        tax_rate: taxRate || 0,
        commission_rate: commissionRate || 0,
        is_stock_available: isStockAvailable ? 1 : 0,
        max_per_order: maxPerOrder || null,
        min_per_order: minPerOrder || null,
        promotion_id: promotionId || null,
        thumbnail_url: null,
        stock_average: stockAverage || 0,  // ← 0 en lugar de null
        stock_danger: stockDanger || 0,    // ← 0 en lugar de null
        created_at: new Date(),
        updated_at: new Date(),
        expires_at: expiresAt || null,
        status_id: statusId
      }
    };

    const token = typeof window !== "undefined" 
      ? localStorage.getItem("token")
      : null;

    const res = await fetch("/api/business/products", {
      method: "POST",
      headers: {
        "Authorization": token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      alert("❌ Error al guardar: " + JSON.stringify(data));
      return;
    }

    alert("✅ Producto creado correctamente.");
    // Opcional: redirigir al panel
    // window.location.href = `/business`;
    
  } catch (err) {
    console.error(err);
    alert("❌ Error inesperado.");
  }
}

  // ============================
  // 📌 Layout del formulario (empieza aquí)
  // ============================

  return (
    <main className="min-h-screen bg-fixed bg-cover bg-center [background-image:url('/portada.jpg')]">
      <div className="min-h-screen bg-[linear-gradient(180deg,rgba(35,55,40,0.15)_0%,rgba(214,205,168,0.65)_25%,rgba(228,235,220,0.85)_55%,rgba(244,239,222,0.9)_100%)]">
        <div className="mx-auto max-w-7xl px-8 py-4 pt-8 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8">
          {/* ============================
              🏆 Header Principal
              ============================ */}
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
              {/* Columna izquierda: Contenido principal */}
              <div className="space-y-4 md:space-y-6 lg:order-1">
                {/* Breadcrumb + Etiqueta */}
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/business"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm transition hover:bg-white/10"
                  >
                    ← Panel
                  </Link>

                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-[0.3em]">
                    Nuevo producto
                  </span>
                </div>

                {/* Títulos */}
                <div className="space-y-3 md:space-y-4">
                  <h1 className="text-2xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl">
                    Agregar producto al catálogo
                  </h1>
                  
                  <p className="text-sm text-white/90 sm:text-base md:text-lg lg:max-w-2xl">
                    Completa la ficha del producto para publicarlo en el menú del negocio.
                  </p>
                </div>
                
                {/* Badge del sistema */}
                <div className="grid gap-3 rounded-xl bg-white/15 p-3 text-xs uppercase tracking-[0.2em] sm:rounded-2xl sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-emerald-800 shadow-inner">
                      FG
                    </div>
                    <div className="space-y-1">
                      <span className="text-white/80">SISTEMA</span>
                      <p className="text-sm normal-case tracking-normal text-white">
                        FoodyGo · Panel de administrador
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Columna derecha: Espacio para contenido adicional */}
              
            </div>
          </section>

          {/* ============================
              📋 Formulario Principal - Layout compacto
              ============================ */}
          <form
            className="mt-4 grid gap-4 sm:mt-5 sm:gap-5 md:mt-6 md:gap-6 lg:grid-cols-[1fr,400px]"
            onSubmit={handleSubmit}
          >
            {/* ============================
                📝 ÁREA PRINCIPAL DEL FORMULARIO
                ============================ */}
            <div className="grid gap-4 sm:gap-5 md:gap-6">
              {/* Grupo 1: Información básica y precio */}
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                {/* Columna izquierda: Información básica */}
                <section className="rounded-lg bg-[#f7f6ef] p-3 shadow-lg ring-1 ring-[#d6e3d0] backdrop-blur sm:rounded-xl sm:p-4">
                  <header className="space-y-0.5 pb-2 sm:pb-3">
                    <h2 className="text-sm font-semibold text-[#1b4332] sm:text-base">
                      Información básica
                    </h2>
                    <p className="text-[10px] text-[#5c6f5b] sm:text-xs">
                      Datos principales del producto
                    </p>
                  </header>
                  
                  <div className="grid gap-3">
                    <FieldCompact
                      label="Nombre del producto"
                      htmlFor="name"
                      required
                    >
                      <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Ej. Latte con almendra"
                        className={inputClass}
                      />
                    </FieldCompact>

                    <FieldCompact
                      label="Descripción corta"
                      htmlFor="descriptionShort"
                    >
                      <input
                        id="descriptionShort"
                        type="text"
                        required
                        value={descriptionShort}
                        onChange={(event) =>
                          setDescriptionShort(event.target.value)
                        }
                        placeholder="Café latte con leche de almendra..."
                        className={inputClass}
                      />
                    </FieldCompact>

                    <div className="grid gap-2 sm:grid-cols-2">
                      <FieldCompact
                        label="SKU"
                        htmlFor="sku"
                        required
                      >
                        <input
                          id="sku"
                          type="text"
                          value={sku}
                          onChange={(event) => setSku(event.target.value)}
                          placeholder="CAF-001"
                          className={inputClass}
                        />
                      </FieldCompact>

                      <FieldCompact
                        label="Código de barras"
                        htmlFor="barcode"
                      >
                        <input
                          id="barcode"
                          type="text"
                          value={barcode}
                          onChange={(event) => setBarcode(event.target.value)}
                          placeholder="7501234567890"
                          className={inputClass}
                        />
                      </FieldCompact>
                    </div>

                    <FieldCompact
                      label="Categoría"
                      htmlFor="category"
                    >
                      <select
                        id="category"
                        value={categoryId ?? ""}
                        onChange={(e) => setCategoryId(Number(e.target.value))}
                        className={inputClass}
                      >
                        {categories.length === 0 ? (
                          <option value="">Cargando...</option>
                        ) : (
                          categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))
                        )}
                      </select>
                    </FieldCompact>
                  </div>
                </section>

                {/* Columna derecha: Precio y presentación */}
                <section className="rounded-lg bg-[#f7f6ef] p-3 shadow-lg ring-1 ring-[#d6e3d0] backdrop-blur sm:rounded-xl sm:p-4">
                  <header className="space-y-0.5 pb-2 sm:pb-3">
                    <h2 className="text-sm font-semibold text-[#1b4332] sm:text-base">
                      Precio y presentación
                    </h2>
                    <p className="text-[10px] text-[#5c6f5b] sm:text-xs">
                      Costo y cómo se vende
                    </p>
                  </header>
                  
                  <div className="grid gap-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      {/* Precio (MXN) */}
                      <FieldCompact
                        label="Precio (MXN)"
                        htmlFor="price"
                        required
                      >
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#4c956c]/70">
                            $
                          </span>
                          <input
                            id="price"
                            type="number"
                            min={0}
                            step="0.01"
                            required
                            value={price}
                            onChange={(event) => setPrice(Number(event.target.value))}
                            className={`${inputClass} pl-8 sm:pl-8`}
                          />
                        </div>
                      </FieldCompact>

                      {/* Precio oferta */}
                      <FieldCompact
                        label="Precio oferta"
                        htmlFor="discountPrice"
                      >
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#4c956c]/70">
                            $
                          </span>
                          <input
                            id="discountPrice"
                            type="number"
                            min={0}
                            step="0.01"
                            value={discountPrice ?? ""}
                            onChange={(event) =>
                              setDiscountPrice(
                                event.target.value
                                  ? Number(event.target.value)
                                  : null,
                              )
                            }
                            placeholder="Opcional"
                            className={`${inputClass} pl-8 sm:pl-8`}
                          />
                        </div>
                      </FieldCompact>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      <FieldCompact
                        label="Formato de venta"
                        htmlFor="saleFormat"
                      >
                        <select
                          id="saleFormat"
                          value={saleFormat}
                          onChange={(event) => setSaleFormat(event.target.value)}
                          className={inputClass}
                        >
                          <option value="pieza">Pieza</option>
                          <option value="kg">Kilogramo</option>
                          <option value="lt">Litro</option>
                          <option value="paquete">Paquete</option>
                        </select>
                      </FieldCompact>

                      <FieldCompact
                        label="Precio por unidad"
                        htmlFor="pricePerUnit"
                      >
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#4c956c]/70">
                            $
                          </span>
                          <input
                            id="pricePerUnit"
                            type="number"
                            min={0}
                            step="0.01"
                            value={pricePerUnit ?? ""}
                            onChange={(event) =>
                              setPricePerUnit(
                                event.target.value
                                  ? Number(event.target.value)
                                  : null,
                              )
                            }
                            placeholder="Opcional"
                            className={`${inputClass} pl-8 sm:pl-8`}
                          />
                        </div>
                      </FieldCompact>
                    </div>

                    <FieldCompact
                      label="Moneda"
                      htmlFor="currency"
                    >
                      <select
                        id="currency"
                        value={currency}
                        onChange={(event) => setCurrency(event.target.value)}
                        className={inputClass}
                      >
                        <option value="MXN">MXN (Peso mexicano)</option>
                      </select>
                    </FieldCompact>
                  </div>
                </section>
              </div>

              {/* Grupo 2: Detalles adicionales */}
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                {/* Columna izquierda: Impuestos y comisiones */}
                <section className="rounded-lg bg-[#f7f6ef] p-3 shadow-lg ring-1 ring-[#d6e3d0] backdrop-blur sm:rounded-xl sm:p-4">
                  <header className="space-y-0.5 pb-2 sm:pb-3">
                    <h2 className="text-sm font-semibold text-[#1b4332] sm:text-base">
                      Impuestos
                    </h2>
                    <p className="text-[10px] text-[#5c6f5b] sm:text-xs">
                      Configuración fiscal
                    </p>
                  </header>
                  
                  <div className="grid gap-3">
                    <div className="flex items-center gap-2">
                      <input
                        id="taxIncluded"
                        type="checkbox"
                        checked={taxIncluded}
                        onChange={(e) => setTaxIncluded(e.target.checked)}
                        className="size-3.5 rounded border-[#c1e3b2] text-[#3f6b45] sm:size-4"
                      />
                      <label htmlFor="taxIncluded" className="text-xs font-medium text-[#3f6b45] sm:text-sm">
                        Precio incluye impuestos
                      </label>
                    </div>

                    <FieldCompact
                      label="Tasa de impuesto (%)"
                      htmlFor="taxRate"
                    >
                      <input
                        id="taxRate"
                        type="number"
                        min={0}
                        step="0.01"
                        value={taxRate}
                        onChange={(event) =>
                          setTaxRate(Number(event.target.value))
                        }
                        className={inputClass}
                      />
                    </FieldCompact>

                    <FieldCompact
                      label="Comisión interna (%)"
                      htmlFor="commissionRate"
                    >
                      <input
                        id="commissionRate"
                        type="number"
                        min={0}
                        step="0.01"
                        value={commissionRate ?? ""}
                        onChange={(event) =>
                          setCommissionRate(
                            event.target.value
                              ? Number(event.target.value)
                              : null,
                          )
                        }
                        placeholder="Opcional"
                        className={inputClass}
                      />
                    </FieldCompact>
                  </div>
                </section>

                {/* Columna derecha: Inventario */}
                <section className="rounded-lg bg-[#f7f6ef] p-3 shadow-lg ring-1 ring-[#d6e3d0] backdrop-blur sm:rounded-xl sm:p-4">
                  <header className="space-y-0.5 pb-2 sm:pb-3">
                    <h2 className="text-sm font-semibold text-[#1b4332] sm:text-base">
                      Inventario
                    </h2>
                    <p className="text-[10px] text-[#5c6f5b] sm:text-xs">
                      Control de stock y disponibilidad
                    </p>
                  </header>
                  
                  <div className="grid gap-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isStockAvailable}
                        onChange={(event) =>
                          setIsStockAvailable(event.target.checked)
                        }
                        className="size-3.5 rounded border-[#c1e3b2] text-[#3f6b45] sm:size-4"
                      />
                      <label className="text-xs font-medium text-[#3f6b45] sm:text-sm">
                        Mostrar como disponible
                      </label>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      <FieldCompact
                        label="Stock promedio"
                        htmlFor="stockAverage"
                      >
                        <input
                          id="stockAverage"
                          type="number"
                          min={0}
                          value={stockAverage}
                          onChange={(event) =>
                            setStockAverage(Number(event.target.value))
                          }
                          className={inputClass}
                        />
                      </FieldCompact>

                      <FieldCompact
                        label="Stock de alerta"
                        htmlFor="stockDanger"
                      >
                        <input
                          id="stockDanger"
                          type="number"
                          min={0}
                          value={stockDanger}
                          onChange={(event) =>
                            setStockDanger(Number(event.target.value))
                          }
                          className={inputClass}
                        />
                      </FieldCompact>
                    </div>
                  </div>
                </section>
              </div>

              {/* Grupo 3: Límites y descripción larga */}
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                {/* Columna izquierda: Límites y promoción */}
                <section className="rounded-lg bg-[#f7f6ef] p-3 shadow-lg ring-1 ring-[#d6e3d0] backdrop-blur sm:rounded-xl sm:p-4">
                  <header className="space-y-0.5 pb-2 sm:pb-3">
                    <h2 className="text-sm font-semibold text-[#1b4332] sm:text-base">
                      Límites y promoción
                    </h2>
                    <p className="text-[10px] text-[#5c6f5b] sm:text-xs">
                      Restricciones por pedido
                    </p>
                  </header>
                  
                  <div className="grid gap-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <FieldCompact
                        label="Mínimo por pedido"
                        htmlFor="minPerOrder"
                      >
                        <input
                          id="minPerOrder"
                          type="number"
                          min={1}
                          value={minPerOrder}
                          onChange={(event) =>
                            setMinPerOrder(Number(event.target.value))
                          }
                          className={inputClass}
                        />
                      </FieldCompact>

                      <FieldCompact
                        label="Máximo por pedido"
                        htmlFor="maxPerOrder"
                      >
                        <input
                          id="maxPerOrder"
                          type="number"
                          min={1}
                          value={maxPerOrder}
                          onChange={(event) =>
                            setMaxPerOrder(Number(event.target.value))
                          }
                          className={inputClass}
                        />
                      </FieldCompact>
                    </div>

                    <FieldCompact
                      label="ID Promoción"
                      htmlFor="promotionId"
                    >
                      <input
                        id="promotionId"
                        type="number"
                        min={0}
                        value={promotionId ?? ""}
                        onChange={(event) =>
                          setPromotionId(
                            event.target.value
                              ? Number(event.target.value)
                              : null,
                          )
                        }
                        placeholder="Opcional"
                        className={inputClass}
                      />
                    </FieldCompact>

                    <FieldCompact
                      label="Fecha de expiración"
                      htmlFor="expiresAt"
                    >
                      <input
                        id="expiresAt"
                        type="datetime-local"
                        value={expiresAt ?? ""}
                        onChange={(event) =>
                          setExpiresAt(
                            event.target.value ? event.target.value : null,
                          )
                        }
                        className={inputClass}
                      />
                    </FieldCompact>
                  </div>
                </section>

                {/* Columna derecha: Descripción larga y subcategoría */}
                <section className="rounded-lg bg-[#f7f6ef] p-3 shadow-lg ring-1 ring-[#d6e3d0] backdrop-blur sm:rounded-xl sm:p-4">
                  <header className="space-y-0.5 pb-2 sm:pb-3">
                    <h2 className="text-sm font-semibold text-[#1b4332] sm:text-base">
                      Detalles adicionales
                    </h2>
                    <p className="text-[10px] text-[#5c6f5b] sm:text-xs">
                      Información complementaria
                    </p>
                  </header>
                  
                  <div className="grid gap-3">
                    <FieldCompact
                      label="Descripción larga"
                      htmlFor="descriptionLong"
                    >
                      <textarea
                        id="descriptionLong"
                        rows={4}
                        value={descriptionLong}
                        onChange={(event) =>
                          setDescriptionLong(event.target.value)
                        }
                        placeholder="Describe ingredientes, tamaño, notas especiales, preparación..."
                        className={`${inputClass} min-h-[80px] resize-y`}
                      />
                    </FieldCompact>

                    <FieldCompact
                      label="Subcategoría (ID)"
                      htmlFor="subcategory"
                    >
                      <input
                        id="subcategory"
                        type="number"
                        min={0}
                        value={subcategoryId ?? ""}
                        onChange={(event) =>
                          setSubcategoryId(
                            event.target.value
                              ? Number(event.target.value)
                              : null,
                          )
                        }
                        placeholder="Opcional"
                        className={inputClass}
                      />
                    </FieldCompact>
                  </div>
                </section>
              </div>
            </div>

            {/* ============================
                📍 BARRA LATERAL DERECHA - Siempre visible
                ============================ */}
            <aside className="space-y-4 sm:space-y-5">
              {/* Sección de Resumen y Guardar */}
              <section className="rounded-lg bg-[#f6f5ec] p-3 shadow-lg ring-1 ring-[#d6e3d0] sm:rounded-xl sm:p-4">
                <header className="space-y-0.5 pb-2 sm:pb-3">
                  <p className="text-sm font-semibold text-[#2f5238]">
                    Resumen
                  </p>
                  <p className="text-[10px] text-[#5c6f5b] sm:text-xs">
                    Verifica antes de guardar
                  </p>
                </header>

                <ul className="space-y-2 text-xs text-[#5c6f5b] sm:text-sm">
                  <li className="flex items-center justify-between rounded-lg bg-[#ecfadc] px-3 py-2 sm:rounded-xl">
                    <span className="font-medium text-[#2f5238]">Precio</span>
                    <span className="font-semibold">
                      {new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                      }).format(price || 0)}
                    </span>
                  </li>

                  <li className="flex items-center justify-between rounded-lg bg-[#ecfadc] px-3 py-2 sm:rounded-xl">
                    <span className="font-medium text-[#2f5238]">SKU</span>
                    <span className="text-right font-mono text-xs">
                      {sku || <span className="text-amber-600 italic">(auto-generado)</span>}
                    </span>
                  </li>

                  <li className="flex items-center justify-between rounded-lg bg-[#ecfadc] px-3 py-2 sm:rounded-xl">
                    <span className="font-medium text-[#2f5238]">IVA incluido</span>
                    <span>{taxIncluded ? "Sí" : "No"}</span>
                  </li>

                  <li className="flex items-center justify-between rounded-lg bg-[#ecfadc] px-3 py-2 sm:rounded-xl">
                    <span className="font-medium text-[#2f5238]">Stock</span>
                    <span>
                      {isStockAvailable ? "Disponible" : "No disponible"}
                    </span>
                  </li>

                  <li className="flex items-center justify-between rounded-lg bg-[#ecfadc] px-3 py-2 sm:rounded-xl">
                    <span className="font-medium text-[#2f5238]">Categoría</span>
                    <span className="text-right">
                      {categories.find((c) => c.id === categoryId)?.name ??
                        "Sin categoría"}
                    </span>
                  </li>
                </ul>

                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full rounded-lg bg-gradient-to-r from-[#2f5238] via-[#4c956c] to-[#a7c957] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-[1.05] disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-xl"
                  >
                    Guardar producto
                  </button>
                  
                  {!canSubmit && (
                    <p className="mt-2 text-center text-[10px] text-[#dc2626]">
                      Completa los campos requeridos
                    </p>
                  )}
                </div>

                <div className="mt-3 border-t border-[#dfe9d8] pt-3">
                  <p className="text-[9px] text-[#5c6f5b] sm:text-[10px]">
                    <span className="font-semibold">Nota:</span> La subida de imágenes está deshabilitada temporalmente.
                  </p>
                </div>
              </section>

              {/* Sección de Imagen (más compacta) */}
              <section className="rounded-lg bg-[#f6f5ec] p-3 shadow-lg ring-1 ring-[#d6e3d0] sm:rounded-xl sm:p-4">
                <header className="space-y-0.5 pb-2 sm:pb-3">
                  <p className="text-sm font-semibold text-[#2f5238]">
                    Imagen
                  </p>
                  <p className="text-[10px] text-[#5c6f5b] sm:text-xs">
                    Vista previa del producto
                  </p>
                </header>
                
                <div className="space-y-3">
                  <label className="grid min-h-24 place-content-center gap-1.5 rounded-lg border-2 border-dashed border-[#c1e3b2] bg-[#f4ffef] p-3 text-center text-xs font-medium text-[#3f6b45] opacity-60 cursor-not-allowed sm:min-h-28 sm:rounded-xl">
                    <span className="text-[10px] sm:text-xs">Cargar imagen (próximamente)</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled
                      onChange={() => {}}
                      className="hidden"
                    />
                  </label>

                  {imagePreview && (
                    <div className="overflow-hidden rounded-lg border border-[#d6e3d0] shadow-sm opacity-60 sm:rounded-xl">
                      <img
                        src={imagePreview}
                        alt="Vista previa"
                        className="w-full object-cover"
                      />
                      {imageFileName && (
                        <p className="truncate px-2 py-1.5 text-[10px] text-[#5c6f5b]">
                          {imageFileName}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </section>

              {/* Información rápida del negocio */}
              <section className="rounded-lg bg-[#f6f5ec] p-3 shadow-lg ring-1 ring-[#d6e3d0] sm:rounded-xl sm:p-4">
                <header className="space-y-0.5 pb-2 sm:pb-3">
                  <p className="text-sm font-semibold text-[#2f5238]">
                    Negocio actual
                  </p>
                  <p className="text-[10px] text-[#5c6f5b] sm:text-xs">
                    ID: {businessId}
                  </p>
                </header>
                
                <div className="space-y-2 text-xs text-[#5c6f5b]">
                  <p className="flex items-center gap-1.5">
                    <span className="text-[#3f6b45]">✓</span>
                    Producto se agregará a este negocio
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="text-[#3f6b45]">✓</span>
                    Disponible en app y web
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="text-[#3f6b45]">✓</span>
                    Gestión de inventario activa
                  </p>
                </div>
              </section>
            </aside>
          </form>
        </div>
      </div>
    </main>
  );
}

/* =======================================
   📦 Componentes auxiliares compactos
   ======================================= */
function FieldCompact({
  label,
  htmlFor,
  required = false,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#1b4332] sm:text-sm">
          {label}
        </span>
        {required && (
          <span className="text-[10px] text-[#dc2626]">*</span>
        )}
      </div>
      {children}
    </label>
  );
}
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

export default function NewProductPage({
  params,
}: {
  params: { id: string };
}) {

  const businessId = Number(params.id);
  console.log("businessId:", businessId);
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
    "w-full rounded-2xl border border-[#d6e3d0] bg-white/95 px-4 py-3 text-sm shadow-sm transition focus:border-[#4c956c] focus:outline-none focus:ring-2 focus:ring-[#c5ead1]";

  // ============================
  // 📌 Cargar categorías dinámicas
  // ============================
useEffect(() => {
  async function loadCategories() {
    try {
      // Evita error si se ejecuta en SSR
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
      descriptionShort.trim().length > 0 &&
      categoryId !== null &&
      price > 0
    );
  }, [name, descriptionShort, categoryId, price]);

  // ============================
  // 📌 Envío a API
  // ============================

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const payload = {
  product: {
    business_id: businessId,

    sku: sku || null,
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

    thumbnail_url: null, // imagen deshabilitada

    stock_average: stockAverage || null,
    stock_danger: stockDanger || null,

    created_at: new Date(),
    updated_at: new Date(),
    expires_at: expiresAt || null,

    status_id: statusId
  },
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
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <section className="relative overflow-hidden rounded-[32px] border border-[#dbe7c7] bg-gradient-to-br from-[#1f3029] via-[#2f4638] to-[#3f5c45] p-8 text-white shadow-2xl sm:p-10">
            <div
              aria-hidden
              className="absolute -left-24 -top-28 h-64 w-64 rounded-full bg-[#b9f6ca]/20 blur-3xl"
            />
            <div
              aria-hidden
              className="absolute -right-20 top-12 h-52 w-52 rounded-full bg-[#ccd5ae]/30 blur-[90px]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25)_0%,transparent_55%)]"
            />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-5">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-[#f2fbe0]">
                  Nuevo producto
                </span>
                <div className="space-y-3">
                  <h1 className="text-3xl font-semibold leading-tight text-[#f9fffa] md:text-4xl">
                    Agrega un nuevo artículo al catálogo
                  </h1>
                  <p className="max-w-xl text-sm text-[#f0fff4]/90 md:text-base">
                    Completa la ficha del producto, define precios, inventario,
                    impuestos y más. Una vez listo podrás publicarlo para que
                    aparezca en el menú del negocio.
                  </p>
                </div>
                <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm backdrop-blur">
                  <div className="size-10 rounded-full bg-white text-center text-base font-bold text-[#1b4332] shadow-inner">
                    FG
                  </div>
                  <div>
                    <p className="font-semibold text-[#f9fffa]">FoodyGo</p>
                    <p className="text-xs text-[#cbe8d4]">
                      Panel de administrador de negocio
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href={`/business`}
                className="inline-flex items-center gap-2 rounded-2xl border border-[#ccd5ae]/70 bg-white/10 px-4 py-2.5 text-sm font-semibold text-[#f6fff5] transition hover:bg-white/20"
              >
                ← Regresar al panel
              </Link>
            </div>
          </section>

          <form
            className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]"
            onSubmit={handleSubmit}
          >
            <section className="space-y-6 rounded-[32px] bg-[#f7f6ef] p-6 shadow-xl ring-1 ring-[#d6e3d0] backdrop-blur">
              {/* ============================
                  🧾 Información básica
                  ============================ */}
              <FormSection
                title="Información básica"
                helper="Define cómo aparecerá este producto en el catálogo del negocio."
              >
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                  <Field
                    label="Nombre del producto"
                    htmlFor="name"
                    description="Nombre visible para tus clientes."
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
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="SKU"
                      htmlFor="sku"
                      description="Identificador interno del producto."
                    >
                      <input
                        id="sku"
                        type="text"
                        value={sku}
                        onChange={(event) => setSku(event.target.value)}
                        placeholder="Ej. CAF-001"
                        className={inputClass}
                      />
                    </Field>

                    <Field
                      label="Código de barras"
                      htmlFor="barcode"
                      description="Opcional, para escáner o inventario."
                    >
                      <input
                        id="barcode"
                        type="text"
                        value={barcode}
                        onChange={(event) => setBarcode(event.target.value)}
                        placeholder="Ej. 7501234567890"
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </div>

                <Field
                  label="Descripción corta"
                  htmlFor="descriptionShort"
                  description="Se muestra en listados y vistas rápidas."
                >
                  <input
                    id="descriptionShort"
                    type="text"
                    required
                    value={descriptionShort}
                    onChange={(event) =>
                      setDescriptionShort(event.target.value)
                    }
                    placeholder="Ej. Café latte con leche de almendra y shot extra."
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="Descripción larga"
                  htmlFor="descriptionLong"
                  description="Información más detallada para la ficha completa del producto."
                >
                  <textarea
                    id="descriptionLong"
                    rows={4}
                    value={descriptionLong}
                    onChange={(event) =>
                      setDescriptionLong(event.target.value)
                    }
                    placeholder="Describe ingredientes, tamaño, notas especiales, preparación, recomendaciones..."
                    className={`${inputClass} min-h-[132px] resize-y`}
                  />
                </Field>

                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                  <Field
                    label="Categoría"
                    htmlFor="category"
                    description="Categoría general del negocio a la que pertenece."
                  >
                    <select
                      id="category"
                      value={categoryId ?? ""}
                      onChange={(e) => setCategoryId(Number(e.target.value))}
                      className={inputClass}
                    >
                      {categories.length === 0 ? (
                        <option value="">Cargando categorías...</option>
                      ) : (
                        categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))
                      )}
                    </select>
                  </Field>

                  <Field
                    label="Subcategoría (ID opcional)"
                    htmlFor="subcategory"
                    description="Para una clasificación más específica dentro del menú."
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
                      placeholder="Ej. 10"
                      className={inputClass}
                    />
                  </Field>
                </div>
              </FormSection>

              {/* ============================
                  📦 Detalles de presentación
                  ============================ */}
              <FormSection
                title="Detalles de presentación"
                helper="Configura cómo se vende y presenta este producto."
              >
                <div className="grid gap-5 lg:grid-cols-2">
                  <Field
                    label="Formato de venta"
                    htmlFor="saleFormat"
                    description="Define si se vende por pieza, kilo, paquete, etc."
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
                      <option value="otro">Otro</option>
                    </select>
                  </Field>

                  <Field
                    label="Precio por unidad de referencia"
                    htmlFor="pricePerUnit"
                    description="Opcional. Útil para mostrar precio por kg, litro, etc."
                  >
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#4c956c]/70">
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
                        placeholder="Ej. 180.00"
                        className={`${inputClass} pl-7`}
                      />
                    </div>
                  </Field>
                </div>
              </FormSection>
            </section>
            {/* ============================
                💰 Precio, impuestos y comisiones
                ============================ */}
            <section className="space-y-6 rounded-[32px] bg-[#f7f6ef] p-6 shadow-xl ring-1 ring-[#d6e3d0] backdrop-blur">
              <FormSection
                title="Precio y ajustes"
                helper="Define el costo principal del producto y precios alternos."
              >
                <div className="grid gap-5 lg:grid-cols-2">
                  <Field
                    label="Precio (MXN)"
                    htmlFor="price"
                    description="Precio base del producto."
                  >
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#4c956c]/70">
                        $
                      </span>
                      <input
                        id="price"
                        type="number"
                        min={0}
                        step="0.01"
                        required
                        value={price}
                        onChange={(event) =>
                          setPrice(Number(event.target.value))
                        }
                        className={`${inputClass} pl-7`}
                      />
                    </div>
                  </Field>

                  <Field
                    label="Precio con descuento"
                    htmlFor="discountPrice"
                    description="Opcional. Se mostrará como oferta."
                  >
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#4c956c]/70">
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
                        className={`${inputClass} pl-7`}
                      />
                    </div>
                  </Field>
                </div>

                <Field
                  label="Moneda"
                  htmlFor="currency"
                  description="Actualmente solo se usa MXN en la plataforma."
                >
                  <select
                    id="currency"
                    value={currency}
                    onChange={(event) => setCurrency(event.target.value)}
                    className={inputClass}
                  >
                    <option value="MXN">MXN (Peso mexicano)</option>
                    <option value="USD" disabled>
                      USD (No disponible)
                    </option>
                  </select>
                </Field>
              </FormSection>

              {/* ============================
                  🧾 Impuestos
                  ============================ */}
              <FormSection
                title="Impuestos"
                helper="Configura si el precio incluye IVA u otros impuestos."
              >
                <Field
                  label="Precio incluye impuestos"
                  htmlFor="taxIncluded"
                >
                  <label className="inline-flex items-center gap-3 rounded-xl bg-[#ecfadc] px-4 py-2 text-xs font-medium text-[#3f6b45] shadow-sm">
                    <input
                      id="taxIncluded"
                      type="checkbox"
                      checked={taxIncluded}
                      onChange={(e) => setTaxIncluded(e.target.checked)}
                      className="size-4 rounded border-[#c1e3b2] text-[#3f6b45]"
                    />
                    Sí, el precio indicado ya incluye impuestos
                  </label>
                </Field>

                <Field
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
                </Field>

                <Field
                  label="Comisión interna (%)"
                  htmlFor="commissionRate"
                  description="Opcional. Solo si el negocio usa comisiones internas."
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
                    className={inputClass}
                  />
                </Field>
              </FormSection>

              {/* ============================
                  📦 Inventario y stock
                  ============================ */}
              <FormSection
                title="Inventario y disponibilidad"
                helper="Controla la visibilidad y los niveles de inventario."
              >
                <Field label="Producto disponible">
                  <label className="inline-flex items-center gap-3 rounded-xl bg-[#ecfadc] px-4 py-2 text-xs font-medium text-[#3f6b45] shadow-sm">
                    <input
                      type="checkbox"
                      checked={isStockAvailable}
                      onChange={(event) =>
                        setIsStockAvailable(event.target.checked)
                      }
                      className="size-4 rounded border-[#c1e3b2] text-[#3f6b45]"
                    />
                    Mostrar como disponible para venta
                  </label>
                </Field>

                <div className="grid gap-5 lg:grid-cols-2">
                  <Field
                    label="Stock promedio"
                    htmlFor="stockAverage"
                    description="Cantidad promedio que suele haber disponible."
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
                  </Field>

                  <Field
                    label="Stock de alerta"
                    htmlFor="stockDanger"
                    description="Nivel mínimo para alerta de inventario bajo."
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
                  </Field>
                </div>
              </FormSection>

              {/* ============================
                  🛒 Límites por pedido
                  ============================ */}
              <FormSection
                title="Límites por pedido"
                helper="Controla cuántas piezas puede solicitar un cliente."
              >
                <div className="grid gap-5 lg:grid-cols-2">
                  <Field
                    label="Cantidad mínima por pedido"
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
                  </Field>

                  <Field
                    label="Cantidad máxima por pedido"
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
                  </Field>
                </div>

                <Field
                  label="ID Promoción (opcional)"
                  htmlFor="promotionId"
                  description="Se vincula a una promoción ya existente."
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
                    placeholder="Ej. 2"
                    className={inputClass}
                  />
                </Field>
              </FormSection>

              {/* ============================
                  📅 Fechas importantes
                  ============================ */}
              <FormSection
                title="Fechas"
                helper="Opcional. Define fecha de caducidad o vigencia."
              >
                <Field label="Fecha de expiración" htmlFor="expiresAt">
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
                </Field>
              </FormSection>
            </section>
            {/* ============================
                📍 COLUMNA DERECHA
                ============================ */}
            <aside className="space-y-6">
              {/* ============================
                  🖼️ Imagen principal (disabled)
                  ============================ */}
              <section className="overflow-hidden rounded-[28px] bg-[#f6f5ec] shadow-xl ring-1 ring-[#d6e3d0]">
                <header className="space-y-1 border-b border-[#dfe9d8] bg-[#f1fbea] px-5 py-4">
                  <p className="text-sm font-semibold text-[#2f5238]">
                    Imagen principal
                  </p>
                  <p className="text-xs text-[#5c6f5b]">
                    Próximamente podrás subir imágenes. Por ahora está
                    deshabilitado.
                  </p>
                </header>
                <div className="space-y-4 p-5">
                  <label className="grid min-h-48 place-content-center gap-2 rounded-2xl border border-dashed border-[#c1e3b2] bg-[#f4ffef] p-4 text-center text-sm font-medium text-[#3f6b45] opacity-60 cursor-not-allowed">
                    <span>Cargar imagen (deshabilitado)</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled
                      onChange={() => {}}
                      className="hidden"
                    />
                  </label>

                  {imagePreview ? (
                    <div className="overflow-hidden rounded-2xl border border-[#d6e3d0] shadow-sm opacity-60">
                      <img
                        src={imagePreview}
                        alt="Vista previa"
                        className="w-full object-cover"
                      />
                      {imageFileName ? (
                        <p className="truncate px-3 py-2 text-xs text-[#5c6f5b]">
                          {imageFileName}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </section>

              {/* ============================
                  📊 Resumen
                  ============================ */}
              <section className="space-y-4 rounded-[28px] bg-[#f6f5ec] p-6 shadow-xl ring-1 ring-[#d6e3d0]">
                <header className="space-y-1">
                  <p className="text-sm font-semibold text-[#2f5238]">
                    Resumen
                  </p>
                  <p className="text-xs text-[#5c6f5b]">
                    Verifica los datos antes de guardar el producto.
                  </p>
                </header>

                <ul className="space-y-3 text-sm text-[#5c6f5b]">
                  <li className="flex items-center justify-between rounded-2xl bg-[#ecfadc] px-4 py-3">
                    <span className="font-medium text-[#2f5238]">Precio</span>
                    <span>
                      {new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                      }).format(price || 0)}
                    </span>
                  </li>

                  <li className="flex items-center justify-between rounded-2xl bg-[#ecfadc] px-4 py-3">
                    <span className="font-medium text-[#2f5238]">
                      Impuestos incluidos
                    </span>
                    <span>{taxIncluded ? "Sí" : "No"}</span>
                  </li>

                  <li className="flex items-center justify-between rounded-2xl bg-[#ecfadc] px-4 py-3">
                    <span className="font-medium text-[#2f5238]">
                      Stock
                    </span>
                    <span>
                      {isStockAvailable
                        ? `Disponible (promedio: ${stockAverage})`
                        : "No disponible"}
                    </span>
                  </li>

                  <li className="flex items-center justify-between rounded-2xl bg-[#ecfadc] px-4 py-3">
                    <span className="font-medium text-[#2f5238]">
                      Categoría
                    </span>
                    <span>
                      {categories.find((c) => c.id === categoryId)?.name ??
                        "Sin categoría"}
                    </span>
                  </li>
                </ul>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full rounded-2xl bg-gradient-to-r from-[#2f5238] via-[#4c956c] to-[#a7c957] px-4 py-3 text-sm font-semibold text-white shadow-2xl transition hover:brightness-[1.05] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Guardar producto
                </button>

                <p className="text-[11px] text-[#5c6f5b]">
                  Recuerda que aún no se admite subida de imagen. El producto
                  quedará registrado sin miniatura.
                </p>
              </section>
            </aside>
          </form>
        </div>
      </div>
    </main>
  );
}

/* =======================================
   📦 Componentes auxiliares
   ======================================= */
function FormSection({
  title,
  helper,
  children,
}: {
  title: string;
  helper?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[26px] border border-[#dfe9d8] bg-[#f6f5ec] p-5 shadow-sm ring-1 ring-white/60">
      <header className="space-y-1 pb-4">
        <h2 className="text-lg font-semibold text-[#1b4332]">{title}</h2>
        {helper ? <p className="text-sm text-[#5c6f5b]">{helper}</p> : null}
      </header>
      <div className="grid gap-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  description,
  children,
}: {
  label: string;
  htmlFor?: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="space-y-2 text-sm text-[#1b4332]">
      <span className="flex items-center justify-between font-medium">
        {label}
        {description ? (
          <span className="text-xs font-normal text-[#5c6f5b]">
            {description}
          </span>
        ) : null}
      </span>
      {children}
    </label>
  );
}

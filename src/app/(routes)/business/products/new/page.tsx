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

const CATEGORY_OPTIONS = [
  "Bebidas calientes",
  "Bebidas frías",
  "Snacks",
  "Repostería",
  "Comida rápida",
  "Otros",
];

export default function NewProductPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [price, setPrice] = useState<number>(65);
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState<number>(15);
  const [showStock, setShowStock] = useState(true);
  const [hasComplements, setHasComplements] = useState(false);
  const [complements, setComplements] = useState<string[]>([]);
  const [complementDraft, setComplementDraft] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);

  const inputClass =
    "w-full rounded-2xl border border-[#d6e3d0] bg-white/95 px-4 py-3 text-sm shadow-sm transition focus:border-[#4c956c] focus:outline-none focus:ring-2 focus:ring-[#c5ead1]";

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const canSubmit = useMemo(
    () => name.trim().length > 0 && description.trim().length > 0,
    [name, description],
  );

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setImagePreview(null);
      setImageFileName(null);
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setImageFileName(file.name);
  }

  function handleAddComplement() {
    const value = complementDraft.trim();
    if (!value) return;
    setComplements((prev) => [...prev, value]);
    setComplementDraft("");
  }

  function handleRemoveComplement(index: number) {
    setComplements((prev) => prev.filter((_, idx) => idx !== index));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Placeholder: Aquí iría la llamada a la API
    console.log({
      name,
      category,
      price,
      description,
      stock,
      showStock,
      hasComplements,
      complements,
      imageFileName,
    });
    alert(
      "Producto listo para enviarse. Conecta este formulario con tu API para guardar los datos de verdad.",
    );
  }

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
                    Completa la ficha del producto, define precios, inventario y
                    complementos. Una vez listo podrás publicarlo para que los
                    clientes lo vean en minutos.
                  </p>
                </div>
                <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm backdrop-blur">
                  <div className="size-10 rounded-full bg-white text-center text-base font-bold text-[#1b4332] shadow-inner">
                    FG
                  </div>
                  <div>
                    <p className="font-semibold text-[#f9fffa]">
                      Cafetería Central
                    </p>
                    <p className="text-xs text-[#cbe8d4]">
                      Panel de administrador de negocio
                    </p>
                  </div>
                </div>
              </div>
              <Link
                href="/business"
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
              <FormSection
                title="Información básica"
                helper="Define cómo aparecerá este producto en tu menú principal."
              >
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,240px)]">
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
                  <Field
                    label="Precio (MXN)"
                    htmlFor="price"
                    description="Puedes editarlo después."
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
                        value={price}
                        onChange={(event) =>
                          setPrice(Number(event.target.value))
                        }
                        className={`${inputClass} pl-7`}
                      />
                    </div>
                  </Field>
                </div>

                <div className="grid gap-5 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)]">
                  <Field label="Categoría" htmlFor="category">
                    <select
                      id="category"
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      className={inputClass}
                    >
                      {CATEGORY_OPTIONS.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Descripción" htmlFor="description">
                    <textarea
                      id="description"
                      rows={4}
                      required
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="Describe ingredientes, tamaño, notas especiales..."
                      className={`${inputClass} min-h-[132px] resize-y`}
                    />
                  </Field>
                </div>
              </FormSection>

              <FormSection
                title="Inventario y disponibilidad"
                helper="Controla la visibilidad y el inventario disponible en tiempo real."
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <Field label="Stock disponible" htmlFor="stock">
                    <input
                      id="stock"
                      type="number"
                      min={0}
                      value={stock}
                      onChange={(event) => setStock(Number(event.target.value))}
                      className={inputClass}
                    />
                    <label className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#ecfadc] px-3 py-2 text-xs font-medium text-[#3f6b45] shadow-sm ring-1 ring-[#d6e3d0]/80">
                      <input
                        type="checkbox"
                        checked={showStock}
                        onChange={(event) => setShowStock(event.target.checked)}
                        className="size-4 rounded border-[#c1e3b2] text-[#3f6b45] focus:ring-[#4c956c]"
                      />
                      Mostrar stock al cliente
                    </label>
                  </Field>

                  <Field
                    label="Complementos"
                    description="Permite que el cliente elija extras como salsas, toppings o acompañamientos."
                  >
                    <label className="inline-flex w-full items-start gap-3 rounded-2xl border border-[#d6e3d0] bg-white px-4 py-3 text-sm shadow-sm">
                      <input
                        type="checkbox"
                        checked={hasComplements}
                        onChange={(event) =>
                          setHasComplements(event.target.checked)
                        }
                        className="mt-1 size-4 rounded border-[#c1e3b2] text-[#3f6b45] focus:ring-[#4c956c]"
                      />
                      <span>
                        Este producto permite seleccionar complementos
                        <span className="block text-xs text-[#5c6f5b]">
                          Se mostrarán como opciones al momento de ordenar.
                        </span>
                      </span>
                    </label>

                    {hasComplements ? (
                      <div className="mt-4 space-y-4 rounded-2xl border border-dashed border-[#c1e3b2] bg-[#f4f9ec] p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#4c956c]">
                            Opciones
                          </p>
                          <span className="rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold text-[#3f6b45] shadow-sm">
                            {complements.length} disponibles
                          </span>
                        </div>
                        {complements.length === 0 ? (
                          <p className="rounded-xl bg-white px-4 py-3 text-xs text-[#5c6f5b] shadow-sm">
                            Aún no hay complementos. Agrega al menos uno para
                            que el cliente pueda seleccionarlo.
                          </p>
                        ) : (
                          <ul className="flex flex-wrap gap-2">
                            {complements.map((option, index) => (
                              <li
                                key={option}
                                className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#31513b] shadow-sm ring-1 ring-[#c1e3b2]"
                              >
                                {option}
                                <button
                                  type="button"
                                  className="rounded-full bg-[#ecfadc] px-1 text-xs text-[#3f6b45] hover:text-[#2f5238]"
                                  onClick={() => handleRemoveComplement(index)}
                                  aria-label={`Eliminar ${option}`}
                                >
                                  ×
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <input
                            type="text"
                            value={complementDraft}
                            onChange={(event) =>
                              setComplementDraft(event.target.value)
                            }
                            placeholder="Ej. Salsa extra, Pan integral"
                            className={`${inputClass} flex-1 text-xs`}
                          />
                          <button
                            type="button"
                            onClick={handleAddComplement}
                            className="rounded-2xl bg-[#3f6b45] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#2f5238]"
                          >
                            Agregar complemento
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </Field>
                </div>
              </FormSection>
            </section>

            <aside className="space-y-6">
              <section className="overflow-hidden rounded-[28px] bg-[#f6f5ec] shadow-xl ring-1 ring-[#d6e3d0]">
                <header className="space-y-1 border-b border-[#dfe9d8] bg-[#f1fbea] px-5 py-4">
                  <p className="text-sm font-semibold text-[#2f5238]">
                    Imagen principal
                  </p>
                  <p className="text-xs text-[#5c6f5b]">
                    Sube una imagen cuadrada o vertical con buena iluminación.
                    Formato JPG/PNG.
                  </p>
                </header>
                <div className="space-y-4 p-5">
                  <label className="grid min-h-48 place-content-center gap-2 rounded-2xl border border-dashed border-[#c1e3b2] bg-[#f4ffef] p-4 text-center text-sm font-medium text-[#3f6b45] transition hover:border-[#9ed29a]">
                    <span>Cargar imagen</span>
                    <span className="text-xs text-[#7e8f78]">
                      Haz click o arrastra aquí
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {imagePreview ? (
                    <div className="overflow-hidden rounded-2xl border border-[#d6e3d0] shadow-sm">
                      <img
                        src={imagePreview}
                        alt="Previsualización del producto"
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

              <section className="space-y-4 rounded-[28px] bg-[#f6f5ec] p-6 shadow-xl ring-1 ring-[#d6e3d0]">
                <header className="space-y-1">
                  <p className="text-sm font-semibold text-[#2f5238]">
                    Resumen
                  </p>
                  <p className="text-xs text-[#5c6f5b]">
                    Revisa los datos antes de guardar el producto.
                  </p>
                </header>
                <ul className="space-y-3 text-sm text-[#5c6f5b]">
                  <li className="flex items-center justify-between rounded-2xl bg-[#ecfadc] px-4 py-3">
                    <span className="font-medium text-[#2f5238]">
                      Precio sugerido
                    </span>
                    <span>
                      {new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                      }).format(price || 0)}
                    </span>
                  </li>
                  <li className="flex items-center justify-between rounded-2xl bg-[#ecfadc] px-4 py-3">
                    <span className="font-medium text-[#2f5238]">
                      Stock visible
                    </span>
                    <span>{showStock ? "Sí" : "No"}</span>
                  </li>
                  <li className="flex items-center justify-between rounded-2xl bg-[#ecfadc] px-4 py-3">
                    <span className="font-medium text-[#2f5238]">
                      Complementos
                    </span>
                    <span>
                      {hasComplements
                        ? `${complements.length || 0} opciones`
                        : "No"}
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
                  Los cambios se guardarán en borrador hasta que integres este
                  flujo con tu backend.
                </p>
              </section>
            </aside>
          </form>
        </div>
      </div>
    </main>
  );
}

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

import { BusinessList } from "../components/BusinessList";

export default function AdminNegociosPage() {
  return (
    <main className="space-y-8 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <header className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-rose-400 via-red-500 to-sky-500 p-6 text-white shadow-[0_32px_120px_-40px_rgba(244,63,94,0.55)] ring-1 ring-white/30 sm:p-10">
        <div className="absolute -left-32 top-[-120px] size-72 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-40px] size-72 rounded-full bg-sky-300/35 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_60%)]" />
        <div className="relative z-10 space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
            Gestión de partners
          </span>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">Negocios</h1>
            <p className="max-w-2xl text-sm text-white/80 sm:text-base">
              Gestiona comercios aliados, revisa documentación, estado de verificación y desempeño.
              Mantén tu red de negocios siempre actualizada y lista para operar.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <HeroBadge>Trazabilidad</HeroBadge>
            <HeroBadge tone="white">Integración API pendiente</HeroBadge>
          </div>
        </div>
      </header>
      <BusinessList />
    </main>
  );
}

function HeroBadge({
  children,
  tone = "rose",
}: {
  children: React.ReactNode;
  tone?: "rose" | "white";
}) {
  const styles =
    tone === "white"
      ? "border-white/60 bg-white/15 text-white/80"
      : "border-rose-100/70 bg-white/10 text-white";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${styles}`}>
      {children}
    </span>
  );
}

import EditUsersList from "../components/EditUsersList";

export default function AdminUsuariosPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 pb-16 pt-10 sm:px-6 md:space-y-10">
      <header className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-rose-500 via-red-500 to-amber-400 p-6 text-white shadow-[0px_32px_120px_-40px_rgba(244,63,94,0.6)] ring-1 ring-white/30 sm:p-10">
        <div className="absolute -left-24 -top-24 size-64 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-[-80px] right-[-40px] size-[220px] rounded-full bg-amber-300/35 blur-3xl" />
        <div className="relative z-10 space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/85 sm:text-sm">
            Gestión de usuarios
          </span>
          <div>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">Usuarios</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/80 sm:text-base">
              Administra roles, estados y accesos del equipo. Conecta este panel a tu API para
              mantener la información sincronizada en tiempo real.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge>Pendiente API</Badge>
            <Badge tone="white">Vista previa v1.0.0</Badge>
          </div>
        </div>
      </header>

      <EditUsersList />
    </div>
  );
}

function Badge({
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

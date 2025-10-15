

export default function StatusBadge({ status }: { status: number }) {
  const normalized = (status || 0) === 1 ? "ACTIVO" : "INACTIVO";
  const isActive = normalized === "ACTIVO";
  const baseStyles =
    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold";
  const theme = isActive
    ? "bg-emerald-100 text-emerald-600"
    : "bg-zinc-200 text-zinc-600";

  return (
    <span className={`${baseStyles} ${theme}`}>
      <span className="size-2 rounded-full bg-current" />
      {normalized}
    </span>
  );
}
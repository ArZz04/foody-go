
export default function SummaryCard({
  label,
  value,
  accent = "rose",
}: {
  label: string;
  value: number;
  accent?: "rose" | "emerald" | "violet" | "sky";
}) {
  const accentClass =
    accent === "emerald"
      ? "from-emerald-200/80 to-emerald-400/60 text-emerald-700"
      : accent === "violet"
        ? "from-violet-200/80 to-violet-400/60 text-violet-700"
        : accent === "sky"
          ? "from-sky-200/80 to-sky-400/60 text-sky-700"
          : "from-rose-200/80 to-red-400/60 text-red-700";

  return (
    <div className={`rounded-[18px] bg-gradient-to-br ${accentClass} p-0.5`}>
      <div className="rounded-[16px] bg-white/95 px-4 py-5 shadow-sm ring-1 ring-white/60 dark:bg-zinc-900/80">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
          {label}
        </p>
        <p className="mt-2 text-3xl font-semibold">{value}</p>
      </div>
    </div>
  );
}
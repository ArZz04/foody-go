interface StatusBadgeProps {
  status: number
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const isActive = status === 1

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold sm:px-3 ${
        isActive
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
          : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
      }`}
    >
      {isActive ? "Activo" : "Inactivo"}
    </span>
  )
}

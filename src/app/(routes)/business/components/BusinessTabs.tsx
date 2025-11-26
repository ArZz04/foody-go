"use client";

interface Business {
  id: number;
  nombre: string;
}

interface BusinessTabsProps {
  businesses: Business[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function BusinessTabs({
  businesses,
  selectedId,
  onSelect,
}: BusinessTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {businesses.map((b) => (
        <button
          key={b.id}
          onClick={() => onSelect(b.id)}
          className={`
            px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap
            transition-all border
            ${
              selectedId === b.id
                ? "bg-white text-black border-white"
                : "bg-white/10 text-white/70 border-white/10 hover:bg-white/20 hover:text-white"
            }
          `}
        >
          {b.nombre}
        </button>
      ))}
    </div>
  );
}

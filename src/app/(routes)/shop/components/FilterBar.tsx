"use client";

interface FilterBarProps {
  items: string[];
  selected: string;
  onSelect: (value: string) => void;
  title?: string;
  icon?: React.ReactNode;
}

export default function FilterBar({
  items,
  selected,
  onSelect,
  title,
  icon,
}: FilterBarProps) {
  return (
    <div className="bg-white sticky top-0 z-10">
      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide border-b border-gray-100">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => onSelect(item)}
            className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition ${
              selected === item
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-300 hover:bg-blue-100"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

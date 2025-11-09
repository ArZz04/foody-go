"use client";

import type { CategoryKey } from "@/lib/categoryTheme";
import { CATEGORY_THEMES } from "@/lib/categoryTheme";

type Props = {
  active: CategoryKey;
  onChange: (next: CategoryKey) => void;
};

export function CategoryChips({ active, onChange }: Props) {
  return (
    <div className="sticky top-4 z-10 rounded-[30px] border border-[#eadfce] bg-[#f8f5f0]/90 px-3 py-3 shadow-[0_15px_40px_rgba(59,47,40,0.08)]">
      <div className="flex gap-3 overflow-x-auto scroll-smooth px-1 py-1 scrollbar-thin">
        {(Object.keys(CATEGORY_THEMES) as CategoryKey[]).map((key) => {
          const theme = CATEGORY_THEMES[key];
          const isActive = key === active;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a46a] ${
                isActive
                  ? "border-[rgba(0,0,0,0.08)] bg-white text-[#3e2f28] shadow-[0_10px_25px_rgba(62,47,40,0.15)]"
                  : "border-transparent bg-white/70 text-[#7a6b5f] hover:border-[#eadfce]"
              }`}
            >
              {theme.emoji} {theme.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

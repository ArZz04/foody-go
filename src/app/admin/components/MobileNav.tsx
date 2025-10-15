"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

import { SidebarLink } from "./SidebarLink";

interface MobileNavProps {
  links: Array<{ href: string; label: string; icon?: string }>;
}

export function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        className="inline-flex size-10 items-center justify-center rounded-xl bg-white/90 shadow-sm ring-1 ring-white/70 transition hover:-translate-y-0.5 hover:ring-red-300 md:hidden dark:bg-white/10 dark:ring-white/10"
        aria-label="Abrir menú"
        onClick={() => setOpen(true)}
      >
        ☰
      </button>

      <div
        className={clsx(
          "fixed inset-0 z-40 grid md:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          className={clsx(
            "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity",
            open ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setOpen(false)}
        />

        <aside
          className={clsx(
            "relative z-10 h-full w-[80vw] max-w-xs border-r border-white/25 bg-white/20 p-5 shadow-2xl ring-1 ring-white/40 backdrop-blur-2xl transition-transform duration-300 ease-out dark:border-white/10 dark:bg-zinc-900/90",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between">
            <Link
              href="/admin"
              className="rounded-xl bg-white/55 px-3 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-red-200/40 backdrop-blur dark:bg-zinc-900/70 dark:text-red-200 dark:ring-white/10"
              onClick={() => setOpen(false)}
            >
              Panel Admin
            </Link>
            <button
              className="inline-flex size-9 items-center justify-center rounded-xl bg-white/70 text-lg shadow-sm ring-1 ring-white/60 transition hover:rotate-90 hover:text-red-500 dark:bg-white/10 dark:text-zinc-200"
              aria-label="Cerrar menú"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          <nav className="mt-6 grid gap-2">
            {links.map((link) => (
              <SidebarLink key={link.href} {...link} onClick={() => setOpen(false)} />
            ))}
          </nav>
        </aside>
      </div>
    </>
  );
}

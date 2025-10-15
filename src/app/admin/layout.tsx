import Link from "next/link";
import type { ReactNode } from "react";

import { SidebarLink } from "./components/SidebarLink";

const NAV_LINKS = [
  { href: "/admin", label: "Resumen", icon: "📊" },
  { href: "/admin/users", label: "Usuarios", icon: "👥" },
  { href: "/admin/negocios", label: "Negocios", icon: "🏪" },
  { href: "/admin/repartos", label: "Repartos", icon: "🛵" },
  { href: "/admin/ajustes", label: "Ajustes", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-rose-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div aria-hidden className="pointer-events-none">
        <div className="absolute -left-40 top-[-18rem] h-[32rem] w-[32rem] rounded-full bg-gradient-to-br from-rose-200/70 via-red-200/60 to-red-300/20 blur-3xl sm:-left-20 sm:top-[-22rem]" />
        <div className="absolute inset-x-16 top-24 h-52 rounded-3xl bg-gradient-to-r from-red-100/60 via-transparent to-rose-100/60 blur-2xl sm:top-32 md:inset-x-24" />
        <div className="absolute -right-20 bottom-[-14rem] h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-red-200/60 via-rose-300/40 to-transparent blur-3xl md:-right-32" />
      </div>

      <div className="relative z-10 grid min-h-screen md:grid-cols-[260px_1fr]">
        <aside className="hidden gap-4 border-r border-white/60 bg-white/70 p-6 shadow-xl ring-1 ring-white/70 backdrop-blur-2xl md:flex md:flex-col dark:border-white/10 dark:bg-white/5 dark:ring-white/10">
          <div className="rounded-2xl bg-gradient-to-br from-rose-500/80 to-red-500/80 p-[1px] shadow-lg">
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-[14px] bg-white/95 px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-zinc-900/90 dark:text-red-200"
            >
              <span className="text-xl">🚀</span>
              <div className="leading-tight">
                <span className="block text-xs uppercase tracking-[0.3em] text-red-400">
                  Foody Go
                </span>
                Panel Admin
              </div>
            </Link>
          </div>
          <nav className="mt-2 grid gap-1.5">
            {NAV_LINKS.map((link) => (
              <SidebarLink key={link.href} {...link} />
            ))}
          </nav>
          <div className="mt-auto space-y-2 text-xs text-zinc-400">
            <div className="rounded-xl border border-white/70 bg-white/80 px-3 py-2 text-zinc-500 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
              <p className="font-semibold text-zinc-600 dark:text-zinc-200">
                v1.0.0
              </p>
              <p>Seguro y rápido</p>
            </div>
          </div>
        </aside>

        <div className="relative flex min-h-screen flex-col">
          <header className="sticky top-0 z-10 border-b border-white/60 bg-white/70 backdrop-blur-xl transition-shadow dark:border-white/10 dark:bg-white/5">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <button
                  className="inline-flex size-10 items-center justify-center rounded-xl bg-white/90 shadow-sm ring-1 ring-white/70 transition hover:-translate-y-0.5 hover:ring-red-300 md:hidden dark:bg-white/10 dark:ring-white/10"
                  aria-label="Abrir menú"
                >
                  ☰
                </button>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-red-400">
                    Panel
                  </p>
                  <h1 className="text-lg font-bold text-zinc-700 sm:text-xl dark:text-zinc-100">
                    Dashboard
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="search"
                  placeholder="Buscar…"
                  className="hidden h-10 rounded-xl border border-white/70 bg-white/90 px-4 text-sm shadow-sm transition focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-200 sm:block dark:border-white/10 dark:bg-zinc-900/80"
                />
                <button
                  className="inline-flex size-10 items-center justify-center rounded-xl border border-white/70 bg-white/90 text-lg shadow-sm transition hover:-translate-y-0.5 hover:text-red-500 hover:shadow-md dark:border-white/10 dark:bg-zinc-900/80"
                  aria-label="Notificaciones"
                >
                  🔔
                </button>
                <Avatar name="Admin" />
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="inline-flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-red-500 p-[2px] shadow-sm">
      <div className="flex size-full items-center justify-center rounded-full bg-white/95 text-sm font-semibold text-red-600 dark:bg-zinc-900 dark:text-red-200">
        {initials}
      </div>
    </div>
  );
}

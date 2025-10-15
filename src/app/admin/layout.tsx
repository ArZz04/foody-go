import Link from "next/link";
import type { ReactNode } from "react";

import { SidebarLink } from "./components/SidebarLink";
import { MobileNav } from "./components/MobileNav";

const NAV_LINKS = [
  { href: "/admin", label: "Resumen", icon: "📊" },
  { href: "/admin/usuarios", label: "Usuarios", icon: "👥" },
  { href: "/admin/negocios", label: "Negocios", icon: "🏪" },
  { href: "/admin/repartos", label: "Repartos", icon: "🛵" },
  { href: "/admin/ajustes", label: "Ajustes", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden text-zinc-900 dark:text-zinc-100">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/fondo-bosque.jpg')] bg-cover bg-center bg-fixed" />
        <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] dark:bg-zinc-950/85" />
        <div className="absolute -left-40 top-[-18rem] h-[32rem] w-[32rem] rounded-full bg-gradient-to-br from-rose-200/60 via-red-200/50 to-red-300/10 blur-3xl sm:-left-20 sm:top-[-22rem]" />
        <div className="absolute inset-x-16 top-24 h-52 rounded-3xl bg-gradient-to-r from-red-100/50 via-transparent to-rose-100/40 blur-2xl sm:top-32 md:inset-x-24" />
        <div className="absolute -right-20 bottom-[-14rem] h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-red-200/50 via-rose-300/30 to-transparent blur-3xl md:-right-32" />
      </div>

      <div className="relative z-10 grid min-h-screen md:grid-cols-[260px_1fr]">
        <aside className="hidden gap-4 border-r border-white/25 bg-white/20 p-6 shadow-xl ring-1 ring-white/40 backdrop-blur-3xl md:flex md:flex-col dark:border-white/10 dark:bg-white/5 dark:ring-white/10">
          <div className="rounded-2xl bg-gradient-to-br from-rose-500/50 to-red-500/50 p-[1px] shadow-lg">
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-[14px] bg-white/55 px-4 py-3 text-left text-sm font-semibold text-red-600 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/70 hover:shadow-md dark:bg-zinc-900/70 dark:text-red-200"
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
              <p className="font-semibold text-zinc-600 dark:text-zinc-200">v1.0.0</p>
              <p>Seguro y rápido</p>
            </div>
          </div>
        </aside>

        <div className="relative flex min-h-screen flex-col">
          <header className="sticky top-0 z-10 border-b border-white/60 bg-white/70 backdrop-blur-xl transition-shadow dark:border-white/10 dark:bg-white/5">
            <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6">
              <MobileNav links={NAV_LINKS} />
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-red-400">Panel</p>
                <h1 className="text-lg font-bold text-zinc-700 sm:text-xl dark:text-zinc-100">
                  Dashboard
                </h1>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto overflow-x-hidden">{children}</main>
        </div>
      </div>
    </div>
  );
}

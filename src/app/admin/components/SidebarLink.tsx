"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface SidebarLinkProps {
  href: string;
  label: string;
  icon?: string;
  onClick?: () => void;
}

export function SidebarLink({ href, label, icon, onClick }: SidebarLinkProps) {
  const pathname = usePathname();
  const active =
    pathname === href || (href !== "/admin" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={clsx(
        "group flex w-full items-center gap-3 rounded-[14px] border border-white/30 bg-white/25 px-3 py-2 text-sm font-medium text-zinc-600 shadow-sm ring-1 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/45 hover:text-red-600 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-zinc-200",
        active
          ? "border-transparent bg-gradient-to-r from-rose-500/25 to-red-500/40 text-red-600 ring-red-200/50 dark:from-red-500/20 dark:to-red-500/10 dark:text-red-200"
          : "ring-white/70 dark:ring-white/5",
      )}
      onClick={onClick}
    >
      {icon ? (
        <span
          className={clsx(
            "flex size-8 items-center justify-center rounded-xl bg-white/80 text-lg shadow-sm transition group-hover:scale-105 dark:bg-white/10",
            active ? "text-red-600 dark:text-red-200" : "text-zinc-400 dark:text-zinc-500",
          )}
          aria-hidden
        >
          {icon}
        </span>
      ) : null}
      <span>{label}</span>
    </Link>
  );
}

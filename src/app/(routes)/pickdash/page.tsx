"use client";

import type { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";
import adminImg from "@/../public/admi.jpg";
import administradorImg from "@/../public/administrador.jpg";
import deliveryImg from "@/../public/repartidor-2.jpg";
import vendorImg from "@/../public/vendedor.jpg";
import { useAuth } from "@/context/AuthContext";

type RoleName = "DELIVERY" | "MANAGER" | "OWNER" | "ADMIN";

type RoleCard = {
  role: RoleName;
  title: string;
  description: string;
  href: string;
  image: StaticImageData;
  accent?: string;
  chip: string;
  chipLabel?: string;
};

const CARDS: RoleCard[] = [
  {
    role: "DELIVERY",
    title: "Zona de Delivery",
    description: "Logística y seguimiento de pedidos",
    href: "/delivery",
    image: deliveryImg,
    chip: "text-white",
    chipLabel: "Repartidores",
  },
  {
    role: "MANAGER",
    title: "Panel de Vendedor",
    description: "Gestión de catálogo y promociones",
    href: "/business/manager",
    image: vendorImg,
    accent: "from-orange-500/70 via-orange-700/75 to-orange-900/85",
    chip: "text-orange-100",
    chipLabel: "Dueño de negocio",
  },
  {
    role: "OWNER",
    title: "Panel Administrador",
    description: "Operación integral del negocio",
    href: "/business",
    image: administradorImg,
    accent: "from-sky-500/70 via-slate-700/75 to-slate-900/90",
    chip: "text-sky-100",
    chipLabel: "Administrador del negocio",
  },
  {
    role: "ADMIN",
    title: "Panel Admin",
    description: "Supervisión de usuarios y ajustes",
    href: "/admin",
    image: adminImg,
    accent: "from-rose-500/70 via-amber-700/80 to-amber-900/90",
    chip: "text-rose-100",
    chipLabel: "Administradores de la web",
  },
];

export default function RoleMenu() {
  const { user } = useAuth();

  if (!user) {
    return (
      <main className="grid min-h-screen place-content-center bg-neutral-950 text-white">
        <p className="rounded-2xl border border-white/20 bg-white/5 px-8 py-6 text-center text-lg shadow-xl">
          Inicia sesión para continuar.
        </p>
      </main>
    );
  }

  const roles: RoleName[] = (
    Array.isArray(user.roles) ? user.roles : [user.roles]
  ).filter(
    (role): role is RoleName =>
      role === "DELIVERY" ||
      role === "MANAGER" ||
      role === "OWNER" ||
      role === "ADMIN",
  );

  const visibleCards = CARDS.filter((card) => roles.includes(card.role));

  return (
    <main
      className="min-h-screen bg-fixed bg-cover bg-center"
      style={{ backgroundImage: "url('/portada.jpg')" }}
    >
      <div className="min-h-screen bg-[linear-gradient(180deg,rgba(16,24,19,0.78)_0%,rgba(235,240,231,0.94)_40%,rgba(248,246,238,0.98)_100%)]">
        <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center gap-8 px-4 py-10 text-gray-900 sm:gap-10 sm:px-6 lg:px-10">
          <header className="space-y-3 text-white sm:space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">
              Centro de acceso
            </p>
            <h1 className="text-3xl font-semibold sm:text-4xl">
              Hola,{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-200 to-orange-200">
                {user.name}
              </span>
            </h1>
            {roles.length > 0 && (
              <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.25em] text-white/75">
                {roles.map((role) => (
                  <span
                    key={role}
                    className="rounded-full border border-white/30 px-3 py-1 backdrop-blur-sm"
                  >
                    {role}
                  </span>
                ))}
              </div>
            )}
          </header>

          {visibleCards.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {visibleCards.map((card) => (
                <Card key={card.role} {...card} />
              ))}
            </div>
          ) : (
            <div className="grid flex-1 place-content-center text-center text-sm text-gray-600">
              <p>No tienes accesos asignados por el momento.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Card({
  title,
  description,
  href,
  image,
  accent,
  chip,
  chipLabel = "Acceso rápido",
}: RoleCard) {
  return (
    <Link
      href={href}
      className="group relative block h-[320px] overflow-hidden rounded-[24px] border border-white/30 bg-white/5 shadow-2xl transition-transform duration-300 ease-out hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 sm:h-[360px] lg:h-[420px]"
    >
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/55" />
      {accent ? (
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${accent}`}
        />
      ) : null}
      <div className="relative flex h-full flex-col justify-end gap-5 p-5 text-white sm:p-6">
        <div className="space-y-3">
          <span
            className={`inline-flex max-w-full items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[9px] font-semibold uppercase leading-5 tracking-[0.16em] backdrop-blur-sm xl:text-[10px] ${chip}`}
          >
            {chipLabel}
          </span>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold leading-tight sm:text-2xl lg:text-xl xl:text-2xl">
              {title}
            </h2>
            <p className="max-w-[15rem] text-sm leading-6 text-white/85 sm:text-base">
              {description}
            </p>
          </div>
        </div>
        <div className="flex w-full items-center justify-between text-sm font-semibold text-white/90">
          <span className="inline-flex items-center gap-2">
            Entrar
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </span>
          <span className="rounded-full border border-white/60 px-3 py-1 text-xs uppercase tracking-wide">
            Abrir
          </span>
        </div>
      </div>
    </Link>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useAuth } from "@/context/AuthContext";

import deliveryImg from "@/../public/repartidor-2.jpg";
import vendorImg from "@/../public/vendedor.jpg";
import administradorImg from "@/../public/administrador.jpg";
import adminImg from "@/../public/admi.jpg";

type RoleName = "REPARTIDOR" | "VENDEDOR" | "ADMINISTRADOR" | "ADMIN";

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
    role: "REPARTIDOR",
    title: "Zona de Delivery",
    description: "Logística y seguimiento de pedidos",
    href: "/delivery",
    image: deliveryImg,
    chip: "text-white",
    chipLabel: "Repartidores",
  },
  {
    role: "VENDEDOR",
    title: "Panel de Vendedor",
    description: "Gestión de catálogo y promociones",
    href: "/business/manager",
    image: vendorImg,
    accent: "from-lime-500/70 via-emerald-700/75 to-emerald-900/85",
    chip: "text-lime-100",
    chipLabel: "Dueño de negocio",
  },
  {
    role: "ADMINISTRADOR",
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
      role === "REPARTIDOR" ||
      role === "VENDEDOR" ||
      role === "ADMINISTRADOR" ||
      role === "ADMIN",
  );

  const visibleCards = CARDS.filter((card) => roles.includes(card.role));

  return (
    <main
      className="min-h-screen bg-fixed bg-cover bg-center"
      style={{ backgroundImage: "url('/portada.jpg')" }}
    >
      <div className="min-h-screen bg-[linear-gradient(180deg,rgba(16,24,19,0.75)_0%,rgba(235,240,231,0.94)_40%,rgba(248,246,238,0.98)_100%)]">
        <section className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-4 py-16 text-gray-900 sm:px-6 lg:px-8">
          <header className="space-y-4 text-white">
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">
              Centro de acceso
            </p>
            <h1 className="text-3xl font-semibold sm:text-4xl">
              Hola,{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-lime-200">
                {user.name}
              </span>
            </h1>
            {roles.length > 0 && (
              <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.25em] text-white/70">
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
            <div className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-2">
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
      className="group relative block overflow-hidden rounded-[28px] border border-white/30 shadow-2xl transition-transform duration-300 ease-out hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-300"
    >
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
      />
      {accent ? (
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${accent}`}
        />
      ) : null}
      <div className="relative flex h-full flex-col items-center justify-between gap-6 p-6 text-white text-center">
        <div className="space-y-4">
          <span
            className={`inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] ${chip}`}
          >
            {chipLabel}
          </span>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold sm:text-xl">{title}</h2>
            <p className="text-sm text-white/80">{description}</p>
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

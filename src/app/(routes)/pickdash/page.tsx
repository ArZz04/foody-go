"use client";

import { type LucideIcon, ShoppingCart, Store } from "lucide-react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import adminImg from "@/../public/admi.jpg";
import deliveryImg from "@/../public/repartidor-2.jpg";
import { useAuth } from "@/context/AuthContext";

type RoleName = "DELIVERY" | "MANAGER" | "OWNER" | "ADMIN";

interface AccessFlags {
  admin?: boolean;
  businessOwner?: boolean;
  businessManager?: boolean;
  customer?: boolean;
  delivery?: boolean;
}

interface AccessCenterResponse {
  success?: boolean;
  access?: Array<{ key: string; title: string; href: string }>;
  accessFlags?: AccessFlags;
}

function normalizeRole(role: string): RoleName | null {
  if (role === "DELIVERY" || role === "REPARTIDOR" || role === "repartidor") {
    return "DELIVERY";
  }
  if (role === "MANAGER" || role === "VENDEDOR" || role === "business_staff") {
    return "MANAGER";
  }
  if (
    role === "OWNER" ||
    role === "ADMIN_NEGOCIO" ||
    role === "business_admin"
  ) {
    return "OWNER";
  }
  if (
    role === "ADMIN" ||
    role === "ADMIN_GENERAL" ||
    role === "admin_general"
  ) {
    return "ADMIN";
  }

  return null;
}

type RoleCard = {
  role: RoleName;
  title: string;
  description: string;
  href: string;
  image?: StaticImageData;
  icon?: LucideIcon;
  accent?: string;
  chip: string;
  chipLabel?: string;
  iconShell?: string;
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
    role: "OWNER",
    title: "Panel de negocio",
    description: "Operación integral del negocio",
    href: "/business",
    icon: Store,
    accent: "from-sky-500/70 via-slate-700/75 to-slate-900/90",
    chip: "text-sky-100",
    chipLabel: "Administrador del negocio",
    iconShell:
      "border-sky-200/50 bg-sky-100/15 text-sky-50 shadow-[0_20px_50px_-20px_rgba(56,189,248,0.75)]",
  },
  {
    role: "MANAGER",
    title: "Panel de Vendedor",
    description: "Gestión de catálogo y promociones",
    href: "/pickdash/seller",
    icon: ShoppingCart,
    accent: "from-orange-500/70 via-orange-700/75 to-orange-900/85",
    chip: "text-orange-100",
    chipLabel: "Vendedores",
    iconShell:
      "border-orange-200/50 bg-orange-100/15 text-orange-50 shadow-[0_20px_50px_-20px_rgba(249,115,22,0.8)]",
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
  const router = useRouter();
  const [accessState, setAccessState] = useState<{
    admin: boolean;
    businessOwner: boolean;
    businessManager: boolean;
    customer: boolean;
    delivery: boolean;
  } | null>(null);
  const [accessItems, setAccessItems] = useState<
    Array<{ key: string; title: string; href: string }>
  >([]);
  const [accessLoading, setAccessLoading] = useState(true);

  const roles: RoleName[] = (
    Array.isArray(user?.roles) ? user.roles : user?.roles ? [user.roles] : []
  )
    .map((role) => normalizeRole(String(role)))
    .filter((role): role is RoleName => Boolean(role));

  useEffect(() => {
    if (!user) {
      setAccessLoading(false);
      return;
    }

    async function fetchAccessCenter() {
  try {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken");

    if (!token) {
      router.push("/login");
      return;
    }

    const endpoint = "/api/auth/access-center";
    const response = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const responseText = await response.text();
    
    // ✅ 1. Usar la interfaz AccessCenterResponse en lugar de Record
    let payload: AccessCenterResponse = {};

    try {
      payload = responseText ? JSON.parse(responseText) : {};
    } catch {
      payload = {};
    }

    if (!response.ok || payload.success === false) {
      console.error("Error cargando accesos:", { status: response.status, payload });
      setAccessState(null);
      setAccessItems([]);
      return;
    }

    // ✅ 2. Validación de seguridad para el log
    if (user) {
      console.log(user.id, user.roles, payload.accessFlags?.businessOwner);
    }

    // ✅ 3. Sincronizar estados usando los datos del payload tipado
    const newAccessItems = Array.isArray(payload.access) ? payload.access : [];
    setAccessItems(newAccessItems);

    const newAccessFlags = payload.accessFlags && typeof payload.accessFlags === "object"
        ? (payload.accessFlags as {
            admin: boolean;
            businessOwner: boolean;
            businessManager: boolean;
            customer: boolean;
            delivery: boolean;
          })
        : null;
    
    setAccessState(newAccessFlags);

    // ✅ 4. Lógica de redirección (ahora TS reconoce todas las propiedades)
    if (
      payload.accessFlags?.customer &&
      !payload.accessFlags?.admin &&
      !payload.accessFlags?.businessOwner &&
      !payload.accessFlags?.businessManager &&
      !payload.accessFlags?.delivery
    ) {
      router.push("/");
    }
  } catch (error) {
    console.error("Error validando centro de acceso:", error);
    setAccessState(null);
  } finally {
    setAccessLoading(false);
  }
}

  const visibleCards = useMemo(() => {
    if (accessItems.length > 0) {
      const allowedHrefs = new Set(accessItems.map((item) => item.href));

      return CARDS.filter((card) => allowedHrefs.has(card.href));
    }

    if (!accessState) return [];

    return CARDS.filter((card) => {
      if (card.role === "ADMIN") {
        return accessState.admin;
      }

      if (card.role === "OWNER") {
        return accessState.admin || accessState.businessOwner;
      }

      if (card.role === "MANAGER") {
        return (
          accessState.admin ||
          accessState.businessManager ||
          accessState.businessOwner
        );
      }

      if (card.role === "DELIVERY") {
        return accessState.admin || accessState.delivery;
      }

      return roles.includes(card.role);
    });
  }, [accessItems, accessState, roles]);

  if (!user) {
    return (
      <main className="grid min-h-screen place-content-center bg-neutral-950 text-white">
        <p className="rounded-2xl border border-white/20 bg-white/5 px-8 py-6 text-center text-lg shadow-xl">
          Inicia sesión para continuar.
        </p>
      </main>
    );
  }

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

          {accessLoading ? (
            <div className="grid flex-1 place-content-center text-center text-sm text-gray-600">
              <p>Validando tus accesos...</p>
            </div>
          ) : visibleCards.length > 0 ? (
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
  icon: Icon,
  accent,
  chip,
  chipLabel = "Acceso rápido",
  iconShell,
}: RoleCard) {
  return (
    <Link
      href={href}
      className="group relative block h-[320px] overflow-hidden rounded-[24px] border border-white/30 bg-white/5 shadow-2xl transition-transform duration-300 ease-out hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 sm:h-[360px] lg:h-[420px]"
    >
      {image ? (
        <>
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/55" />
        </>
      ) : (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(10,15,23,0.12)_45%,rgba(10,15,23,0.48)_100%)]" />
      )}
      {accent ? (
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${accent}`}
        />
      ) : null}
      {!image ? (
        <>
          <div className="pointer-events-none absolute inset-x-10 top-10 h-24 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 top-20 h-40 w-40 rounded-full border border-white/10 bg-white/5" />
          <div className="pointer-events-none absolute -left-8 bottom-24 h-24 w-24 rounded-full border border-white/10 bg-white/5" />
        </>
      ) : null}
      <div
        className={`relative flex h-full flex-col gap-5 p-5 text-white sm:p-6 ${
          image ? "justify-end" : "justify-between"
        }`}
      >
        <div className="space-y-4">
          <span
            className={`inline-flex max-w-full items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[9px] font-semibold uppercase leading-5 tracking-[0.16em] backdrop-blur-sm xl:text-[10px] ${chip}`}>
            {chipLabel}
          </span>

          {!image && Icon ? (
            <div className="flex justify-center pt-1">
              <div
                className={`inline-flex h-20 w-20 items-center justify-center rounded-[26px] border backdrop-blur-sm ${iconShell ?? "border-white/30 bg-white/10 text-white"}`}
              >
                <Icon className="h-9 w-9" strokeWidth={2.1} />
              </div>
            </div>
          ) : null}

          <div className={`space-y-2 ${image ? "" : "text-center"}`}>
            <h2 className="text-xl font-black leading-tight sm:text-2xl lg:text-xl xl:text-[1.75rem]">
              {title}
            </h2>
            <p
              className={`text-sm leading-6 text-white/80 sm:text-base ${
                image ? "max-w-[15rem]" : "mx-auto max-w-[16rem]"
              }`}
            >
              {description}
            </p>
            {!image ? (
              <div className="flex justify-center gap-2 pt-1">
                <span className="h-1.5 w-10 rounded-full bg-white/75" />
                <span className="h-1.5 w-3 rounded-full bg-white/30" />
              </div>
            ) : null}
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

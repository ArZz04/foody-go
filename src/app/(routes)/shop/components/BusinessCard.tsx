"use client";

import { Bike, Clock3, Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo } from "react";

interface BusinessCardProps {
  id: number | string;
  name: string;
  city?: string;
  category?: string;
  rating?: number;
  imagen?: string;
  badge?: string;
  etaMinutes?: number;
  deliveryFee?: number;
  href?: string;
  onClick?: () => void;
}

const formatFee = (fee?: number) => {
  if (fee === undefined) return "Entrega programable";
  if (fee === 0) return "Envío gratis";
  return `$${fee.toFixed(1)} envío`;
};

const CardShell = ({
  children,
  className,
  href,
  onClick,
}: {
  children: ReactNode;
  className: string;
  href?: string;
  onClick?: () => void;
}) => {
  if (href) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
};


export default function BusinessCard({
  id,
  name,
  city,
  category,
  rating = 4.5,
  badge,
  etaMinutes,
  deliveryFee,
  href,
  onClick,
}: BusinessCardProps) {
  const dynamicBadge = useMemo(() => {
    if (badge) return badge;
    const options = ["Top", "Promo", "Nuevo"] as const;
    return options[Math.floor(Math.random() * options.length)];
  }, [badge]);

  const storytellerText = useMemo(() => {
    const base = category?.toLowerCase?.() ?? "aliado";
    if (base.includes("cafe")) return "Tostado lento, servido con historias";
    if (base.includes("pan")) return "Masa madre y horno de adobe";
    if (base.includes("taco")) return "Tortillas calientes y salsas vivas";
    if (base.includes("huerto")) return "De la tierra directo a tu mesa";
    return "Hecho con amor local";
  }, [category]);

  // Thumbnail usando el ID del negocio
  const thumbnailPath = `/thumbnails/shop/${id}.png`;

  // Retiramos letras especiales y espacios para crear una nombre amigable con la fuente 
  function normalizeName(name: string) {
    // 1. Pasamos a minúsculas
    let clean = name.toLowerCase();
    // 2. Normalizamos tildes y diacríticos
    clean = clean.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // 3. Reemplazamos ñ -> n
    clean = clean.replace(/ñ/g, "n");
    // 4. Eliminamos emojis y caracteres raros (todo lo que no sea a-z, 0-9 o espacio)
    clean = clean.replace(/[^a-z0-9 ]/g, "");
    // 5. Eliminamos espacios extra
    clean = clean.trim().replace(/\s+/g, " ");
    // 6. Convertimos a Capital Case
    clean = clean.replace(/\b\w/g, (c) => c.toUpperCase());

    return clean;
  }

  const normalizedName = normalizeName(name);
  const cityLower = city?.toLocaleLowerCase();

  return (
    <CardShell
      href={href}
      onClick={onClick}
      className="group relative flex flex-col rounded-[26px] border border-[#eadfce] bg-gradient-to-br from-[#fdf7ef] via-[#faf2e6] to-[#f6ebdc] p-3 text-left shadow-[0_20px_40px_rgba(85,64,45,0.08)] transition hover:-translate-y-1 hover:border-[#d9c6ad] hover:shadow-[0_25px_50px_rgba(85,64,45,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c29a6a]"
    >
      <div className="relative h-36 w-full overflow-hidden rounded-[22px]">
        <Image src={thumbnailPath} alt={name} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/15" />
        {dynamicBadge ? (
          <span className="absolute left-3 top-3 rounded-full bg-[#fef6ea]/90 px-3 py-1 text-xs font-semibold text-[#a46b3d] shadow">
            {dynamicBadge}
          </span>
        ) : null}
        <button
          type="button"
          className="absolute right-3 top-3 rounded-full bg-black/25 p-1 text-white transition hover:bg-white/80 hover:text-[#9b7e58]"
          aria-label="Guardar favorito"
          onClick={(event) => {
            event.preventDefault();
          }}
        >
          <Heart className="h-4 w-4" fill="currentColor" />
        </button>
        {etaMinutes ? (
          <span className="absolute bottom-3 right-3 rounded-full bg-white/80 px-2 py-0.5 text-xs font-semibold text-[#6d533b] shadow">
            {etaMinutes} min
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex flex-1 flex-col px-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#b38c63]">
              {category ?? "Local aliado"}
            </p>
            <h2 className="font-['Outfit'] text-lg font-semibold text-[#3b2f2f] line-clamp-1">
              {normalizedName}
            </h2>
          </div>
          <div className="inline-flex items-center gap-1 rounded-full bg-[#fff4df] px-2 py-0.5 text-xs font-semibold text-[#c17b2c]">
            <Star className="h-3.5 w-3.5 fill-[#f6c76d] text-[#f6c76d]" />
            {rating.toFixed(1)}
          </div>
        </div>
        <p className="mt-1 font-['Nunito_Sans'] text-sm text-[#5c4c43] line-clamp-1">
          {cityLower?.replace(/\b\w/g, (c) => c.toUpperCase()) ?? "Cerca de ti"}
        </p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4 text-xs text-[#5c4c43]">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 font-medium text-[#3b2f2f]">
            <Bike className="h-4 w-4 text-[#6d8b74]" />
            {formatFee(deliveryFee)}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[#3b2f2f]">
            <Clock3 className="h-4 w-4 text-[#c29a6a]" />
            {etaMinutes ? `${etaMinutes} min` : "Horario extendido"}
          </span>
        </div>

      </div>
    </CardShell>
  );
}

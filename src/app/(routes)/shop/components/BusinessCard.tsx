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
      className="group relative flex flex-col rounded-[24px] border border-[#eadfce] bg-gradient-to-br from-[#fdf7ef] via-[#faf2e6] to-[#f6ebdc] p-2.5 text-left shadow-[0_16px_34px_rgba(85,64,45,0.08)] transition hover:-translate-y-1 hover:border-[#d9c6ad] hover:shadow-[0_24px_46px_rgba(85,64,45,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c29a6a] sm:rounded-[26px] sm:p-3"
    >
      <div className="relative w-full overflow-hidden rounded-[20px] bg-[#f4e8d9] sm:rounded-[22px]">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={thumbnailPath}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
        {dynamicBadge ? (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-[#fef6ea]/95 px-2.5 py-1 text-[11px] font-semibold text-[#a46b3d] shadow sm:left-3 sm:top-3 sm:px-3 sm:text-xs">
            {dynamicBadge}
          </span>
        ) : null}
        <button
          type="button"
          className="absolute right-2.5 top-2.5 rounded-full bg-black/25 p-1.5 text-white transition hover:bg-white/80 hover:text-[#9b7e58] sm:right-3 sm:top-3"
          aria-label="Guardar favorito"
          onClick={(event) => {
            event.preventDefault();
          }}
        >
          <Heart className="h-4 w-4" fill="currentColor" />
        </button>
        {etaMinutes ? (
          <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#6d533b] shadow sm:text-xs">
            {etaMinutes} min
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-1 flex-col px-0.5 sm:mt-4 sm:px-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.32em] text-[#b38c63] sm:text-[0.65rem]">
              {category ?? "Local aliado"}
            </p>
            <h2 className="font-['Outfit'] text-base font-semibold text-[#3b2f2f] line-clamp-1 sm:text-lg">
              {normalizedName}
            </h2>
          </div>
          <div className="inline-flex items-center gap-1 rounded-full bg-[#fff4df] px-2 py-0.5 text-[11px] font-semibold text-[#c17b2c] sm:text-xs">
            <Star className="h-3.5 w-3.5 fill-[#f6c76d] text-[#f6c76d]" />
            {rating.toFixed(1)}
          </div>
        </div>
        <p className="mt-0.5 font-['Nunito_Sans'] text-xs text-[#5c4c43] line-clamp-1 sm:mt-1 sm:text-sm">
          {cityLower?.replace(/\b\w/g, (c) => c.toUpperCase()) ?? "Cerca de ti"}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-3 text-[11px] text-[#5c4c43] sm:pt-4 sm:text-xs">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 font-medium text-[#3b2f2f] sm:px-3.5">
            <Bike className="h-4 w-4 text-[#6d8b74]" />
            {formatFee(deliveryFee)}
          </span>
        </div>

      </div>
    </CardShell>
  );
}

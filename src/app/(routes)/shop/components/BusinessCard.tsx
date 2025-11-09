"use client";

import { Bike, Clock3, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

interface BusinessCardProps {
  nombre: string;
  ciudad?: string;
  giro?: string;
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
  nombre,
  ciudad,
  giro,
  rating = 4.5,
  imagen = "/coffe.png",
  badge,
  etaMinutes,
  deliveryFee,
  href,
  onClick,
}: BusinessCardProps) {
  return (
    <CardShell
      href={href}
      onClick={onClick}
      className="group relative flex flex-col rounded-3xl border border-slate-100 bg-white p-2 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
    >
      <div className="relative h-32 w-full overflow-hidden rounded-2xl">
        <Image src={imagen} alt={nombre} fill className="object-cover" />
        {badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-emerald-700 shadow">
            {badge}
          </span>
        ) : null}
        {etaMinutes ? (
          <span className="absolute bottom-3 right-3 rounded-full bg-slate-900/80 px-2 py-0.5 text-xs font-semibold text-white">
            {etaMinutes} min
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-1 flex-col px-1">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-900 line-clamp-1">
            {nombre}
          </h2>
          <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-600">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {rating.toFixed(1)}
          </div>
        </div>
        <p className="mt-1 text-xs text-slate-500 line-clamp-1">
          {giro ?? "Especialidades"} · {ciudad ?? "Cerca de ti"}
        </p>

        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1 font-medium text-slate-600">
            <Bike className="h-4 w-4 text-emerald-500" />
            {formatFee(deliveryFee)}
          </span>
          <span className="inline-flex items-center gap-1 text-slate-500">
            <Clock3 className="h-4 w-4 text-slate-400" />
            {etaMinutes ? `${etaMinutes} min` : "Horario extendido"}
          </span>
        </div>
      </div>
    </CardShell>
  );
}

"use client";

import { useEffect, useState } from "react";

type Ally = {
  nombre: string;
  giro: string;
  ciudad: string;
  emoji: string;
};

const ALLIES: Ally[] = [
  { nombre: "Cafetería Central", giro: "Cafetería artesanal", ciudad: "Mazamitla", emoji: "☕" },
  { nombre: "Panadería Delicias", giro: "Pan recién horneado", ciudad: "San José de Gracia", emoji: "🥐" },
  { nombre: "Tacos El Güero", giro: "Taquería campirana", ciudad: "Mazamitla", emoji: "🌮" },
  { nombre: "Helados Frosti", giro: "Heladería rural", ciudad: "La Cofradía", emoji: "🍨" },
  { nombre: "Pastelería Dulce Vida", giro: "Repostería casera", ciudad: "Quitupan", emoji: "🍰" },
];

export function ReviewRotator() {
  const [active, setActive] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    let fadeTimeout: number | undefined;
    const interval = window.setInterval(() => {
      setIsFading(true);
      fadeTimeout = window.setTimeout(() => {
        setActive((prev) => (prev + 1) % ALLIES.length);
        setIsFading(false);
      }, 350);
    }, 6000);

    return () => {
      window.clearInterval(interval);
      if (fadeTimeout) window.clearTimeout(fadeTimeout);
    };
  }, []);

  const ally = ALLIES[active];

  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-[28px] border border-[#E2D9D0] bg-white/90 px-6 py-5 text-center text-[#3E2F28] shadow-[0_15px_45px_rgba(0,0,0,0.12)]">
      <p className="text-sm uppercase tracking-[0.5em] text-[#8C766B]">
        Negocios aliados
      </p>
      <p
        className={`mt-3 text-lg font-serif italic text-[#3E2F28]/80 transition-opacity duration-500 ${
          isFading ? "opacity-0" : "opacity-100"
        }`}
      >
        {ally.emoji} {ally.nombre}
      </p>
      <p className="mt-2 text-sm font-semibold text-[#6D4C41]">{ally.giro}</p>
      <p className="text-xs uppercase tracking-[0.4em] text-[#8C766B]">
        {ally.ciudad}
      </p>
      <div className="mt-4 flex items-center justify-center gap-1">
        {ALLIES.map((_, index) => (
          <span
            key={index}
            className={`h-1.5 w-6 rounded-full transition-all ${
              index === active
                ? "bg-[#6D8B74]"
                : "bg-[#E2D9D0]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default ReviewRotator;

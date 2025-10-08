"use client";

import Image from "next/image";
import { Star, MapPin } from "lucide-react";

interface BusinessCardProps {
  id: number;
  nombre: string;
  ciudad: string;
  giro: string;
  rating?: number;
  imagen?: string;
  onClick?: () => void;
}

export default function BusinessCard({
  id,
  nombre,
  ciudad,
  giro,
  rating = 4.5,
  imagen = "/default-business.jpg",
  onClick,
}: BusinessCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-2 cursor-pointer"
    >
      <div className="relative w-full h-32 rounded-xl overflow-hidden">
        <Image src={imagen} alt={nombre} fill className="object-cover" />
      </div>
      <div className="mt-2 px-1">
        <h2 className="font-semibold text-gray-800 text-sm truncate">{nombre}</h2>
        <p className="text-xs text-gray-500 truncate">{giro} — {ciudad}</p>
        <div className="flex items-center mt-1">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="text-xs text-gray-700">{rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

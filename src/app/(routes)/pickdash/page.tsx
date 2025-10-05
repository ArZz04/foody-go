"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

// Tabla de roles y sus rutas
const ROLE_ROUTES = [
  {
    name: "REPARTIDOR",
    path: "/delivery",
    label: "Zona de Delivery 🛵",
    color: "bg-yellow-400",
  },
  {
    name: "VENDEDOR",
    path: "/business/manager",
    label: "Panel de Negocios 💼",
    color: "bg-green-400",
  },
  {
    name: "ADMINISTRADOR",
    path: "/business",
    label: "Panel de Negocios 💼",
    color: "bg-green-500",
  },
  {
    name: "ADMIN",
    path: "/admin",
    label: "Panel Admin ⚙️",
    color: "bg-red-500 text-white",
  },
];

export default function RoleMenu() {
  const { user } = useAuth();

  if (!user) {
    return <p className="text-center mt-10">Inicia sesión para continuar.</p>;
  }

  // Si el usuario tiene múltiples roles, asumimos que `user.role` es string o array
  const userRoles = Array.isArray(user.role)
    ? user.role
    : [user.role]; // para compatibilidad con uno solo

  // Filtra las opciones que aplican al usuario
  const availableRoutes = ROLE_ROUTES.filter((r) =>
    userRoles.includes(r.name)
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Bienvenido, {user.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
        {/* Siempre mostrar inicio */}
        <Link href="/" className="p-4 bg-white rounded shadow text-center hover:bg-gray-50">
          Inicio
        </Link>

        {/* Mostrar dinámicamente las tarjetas de rol */}
        {availableRoutes.map((r) => (
          <Link
            key={r.name}
            href={r.path}
            className={`p-4 rounded shadow text-center hover:opacity-90 transition ${r.color}`}
          >
            {r.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
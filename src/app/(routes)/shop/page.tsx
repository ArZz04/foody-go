"use client";

import { useEffect, useState } from "react";
import { Store, Layers } from "lucide-react";
import BusinessCard from "./components/BusinessCard";
import FilterBar from "./components/FilterBar";

export default function ShopPage() {
  const [negocios, setNegocios] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [filtroGiro, setFiltroGiro] = useState("Todos");
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/prueba/negocios");
        const data = await res.json();
        setNegocios(data.negocios);
        setProductos(data.productos);
        setFiltered(data.negocios);
      } catch (err) {
        console.error("Error al obtener datos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // 🎛️ Filtros dinámicos
  useEffect(() => {
    let result = negocios;

    if (filtroGiro !== "Todos") {
      result = result.filter((n) => n.giro === filtroGiro);
    }

    if (filtroCategoria !== "Todos" && filtroGiro !== "Todos") {
      const prods = productos.filter(
        (p) => p.giro === filtroGiro && p.categoria === filtroCategoria
      );
      const girosPermitidos = new Set(prods.map((p) => p.giro));
      result = result.filter((n) => girosPermitidos.has(n.giro));
    }

    setFiltered(result);
  }, [filtroGiro, filtroCategoria, negocios, productos]);

  const giros = ["Todos", ...new Set(negocios.map((n) => n.giro))];
  const categorias =
    filtroGiro === "Todos"
      ? []
      : ["Todos", ...new Set(productos.filter((p) => p.giro === filtroGiro).map((p) => p.categoria))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

      {/* Barra de giros */}
      <FilterBar
        items={giros}
        selected={filtroGiro}
        onSelect={(g) => {
          setFiltroGiro(g);
          setFiltroCategoria("Todos");
        }}
        title="Giros"
        icon={<Layers className="text-blue-600 w-4 h-4" />}
      />

      {/* Barra de categorías (solo si hay giro) */}
      {filtroGiro !== "Todos" && (
        <FilterBar
          items={categorias}
          selected={filtroCategoria}
          onSelect={setFiltroCategoria}
          title="Categorías"
          icon={<Store className="text-blue-600 w-4 h-4" />}
        />
      )}

      {/* Lista de negocios */}
      <main className="px-4 pb-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-44 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map((negocio) => (
              <BusinessCard
                key={negocio.id}
                id={negocio.id}
                nombre={negocio.nombre}
                ciudad={negocio.ciudad}
                giro={negocio.giro}
                rating={Math.random() * 0.8 + 4.2}
                onClick={() => alert(`Abrir ${negocio.nombre}`)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-8">No hay negocios disponibles.</p>
        )}
      </main>
    </div>
  );
}

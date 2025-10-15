import { NextResponse } from "next/server";

export async function GET() {
  try {
const negocios = [
    { id: 1, nombre: "Cafetería Central", ciudad: "Guadalajara", giro: "Cafetería" },
    { id: 2, nombre: "Tacos El Güero", ciudad: "Zapopan", giro: "Taquería" },
    { id: 3, nombre: "Panadería Delicias", ciudad: "Tlaquepaque", giro: "Panadería" },
    { id: 4, nombre: "Helados Frosti", ciudad: "Tonala", giro: "Heladería" },
    { id: 5, nombre: "Café y Más", ciudad: "Tlajomulco", giro: "Cafetería" },
    { id: 6, nombre: "La Esquina del Taco", ciudad: "Guadalajara", giro: "Taquería" },
    { id: 7, nombre: "Pastelería Dulce Vida", ciudad: "Zapopan", giro: "Pastelería" },
    { id: 8, nombre: "Helados La Michoacana", ciudad: "Tlaquepaque", giro: "Heladería" },
    { id: 9, nombre: "Bistró Café", ciudad: "Tonala", giro: "Restaurante" },
    { id: 10, nombre: "Tacos y Salsas", ciudad: "Tlajomulco", giro: "Taquería" },
    { id: 11, nombre: "Panadería La Espiga", ciudad: "Guadalajara", giro: "Panadería" },
    { id: 12, nombre: "Helados y Postres", ciudad: "Zapopan", giro: "Heladería" },
    { id: 13, nombre: "Verduras Frescas", ciudad: "Guadalajara", giro: "Tienda de abarrotes" },
    { id: 14, nombre: "Farmacia Los Ángeles", ciudad: "Zapopan", giro: "Farmacia" },
    { id: 15, nombre: "Tienda TecnoFix", ciudad: "Tlaquepaque", giro: "Tienda de electrónica" },
    { id: 16, nombre: "Boutique Lunna", ciudad: "Tonala", giro: "Boutique de ropa" },
    { id: 17, nombre: "Llantera El Rayo", ciudad: "Tlajomulco", giro: "Servicio automotriz" },
    { id: 18, nombre: "Papelería Escolar", ciudad: "Guadalajara", giro: "Papelería" },
    { id: 19, nombre: "Barbería Don Juan", ciudad: "Zapopan", giro: "Barbería" },
    { id: 20, nombre: "Spa Zen", ciudad: "Tlaquepaque", giro: "Spa y estética" },
    ];

    const productos = [
      // ☕ Cafetería
      { id: 1, nombre: "Latte", categoria: "Bebidas Calientes", precio: 42, giro: "Cafetería" },
      { id: 2, nombre: "Frappé de Vainilla", categoria: "Bebidas Frías", precio: 55, giro: "Cafetería" },
      { id: 3, nombre: "Brownie", categoria: "Postres", precio: 35, giro: "Cafetería" },

      // 🌮 Taquería
      { id: 4, nombre: "Taco al Pastor", categoria: "Tacos", precio: 20, giro: "Taquería" },
      { id: 5, nombre: "Taco de Asada", categoria: "Tacos", precio: 22, giro: "Taquería" },
      { id: 6, nombre: "Agua de Horchata", categoria: "Bebidas", precio: 25, giro: "Taquería" },

      // 🍞 Panadería
      { id: 7, nombre: "Concha", categoria: "Dulces", precio: 15, giro: "Panadería" },
      { id: 8, nombre: "Cuernito", categoria: "Salados", precio: 18, giro: "Panadería" },
      { id: 9, nombre: "Café Americano", categoria: "Bebidas", precio: 30, giro: "Panadería" },

      // 🍦 Heladería
      { id: 10, nombre: "Helado de Fresa", categoria: "Helados", precio: 40, giro: "Heladería" },
      { id: 11, nombre: "Malteada de Chocolate", categoria: "Bebidas Frías", precio: 55, giro: "Heladería" },
    ];

    return NextResponse.json({ negocios, productos });
  } catch (error) {
    console.error("Error en API:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}

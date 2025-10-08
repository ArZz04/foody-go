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
      { id: 7, nombre: "Pastelería Dulce Vida", ciudad: "Zapopan", giro: "Panadería" },
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

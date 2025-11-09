import { NextResponse } from "next/server";

type ProductoBase = {
  nombre: string;
  categoria: string;
  precio: number;
};

type Producto = ProductoBase & {
  id: number;
  giro: string;
};

const PRODUCT_VARIANTS = [
  "Clásico",
  "Campirano",
  "Premium",
  "de Olla",
  "Signature",
  "Artesanal",
  "Selección",
  "Orgánico",
  "Especiado",
  "Gran Reserva",
];

const PRODUCT_BLUEPRINTS: Record<string, ProductoBase[]> = {
  "Cafetería": [
    { nombre: "Latte de agave", categoria: "Bebidas Calientes", precio: 48 },
    { nombre: "Cold brew floral", categoria: "Bebidas Frías", precio: 55 },
    { nombre: "Mocha de cacao oaxaqueño", categoria: "Bebidas Calientes", precio: 52 },
    { nombre: "Té chai con canela", categoria: "Bebidas Calientes", precio: 44 },
    { nombre: "Panqué de elote", categoria: "Pan artesanal", precio: 36 },
    { nombre: "Granola con miel", categoria: "Snacks", precio: 38 },
  ],
  "Taquería": [
    { nombre: "Taco al pastor", categoria: "Tacos", precio: 21 },
    { nombre: "Taco de asada", categoria: "Tacos", precio: 23 },
    { nombre: "Taco campechano", categoria: "Tacos", precio: 24 },
    { nombre: "Quesadilla de huitlacoche", categoria: "Antojitos", precio: 32 },
    { nombre: "Agua fresca", categoria: "Bebidas", precio: 18 },
    { nombre: "Esquites", categoria: "Guarniciones", precio: 28 },
  ],
  "Panadería": [
    { nombre: "Concha de cacao", categoria: "Dulces", precio: 16 },
    { nombre: "Cuernito de mantequilla", categoria: "Dulces", precio: 18 },
    { nombre: "Birote salado", categoria: "Salados", precio: 14 },
    { nombre: "Garibaldi", categoria: "Dulces", precio: 20 },
    { nombre: "Baguette rústica", categoria: "Salados", precio: 24 },
    { nombre: "Café de olla", categoria: "Bebidas", precio: 28 },
  ],
  "Heladería": [
    { nombre: "Helado de fresa", categoria: "Helados", precio: 42 },
    { nombre: "Helado de mazapán", categoria: "Helados", precio: 45 },
    { nombre: "Malteada cremosa", categoria: "Bebidas Frías", precio: 58 },
    { nombre: "Affogato", categoria: "Postres", precio: 60 },
    { nombre: "Paleta artesanal", categoria: "Helados", precio: 30 },
    { nombre: "Sundae con frutos rojos", categoria: "Postres", precio: 62 },
  ],
  "Pastelería": [
    { nombre: "Cheesecake artesanal", categoria: "Rebanadas", precio: 65 },
    { nombre: "Pastel tres leches", categoria: "Rebanadas", precio: 58 },
    { nombre: "Tarta de frutos", categoria: "Individuales", precio: 54 },
    { nombre: "Mousse de chocolate", categoria: "Individuales", precio: 52 },
    { nombre: "Panqué glaseado", categoria: "Panqué", precio: 48 },
    { nombre: "Cupcake relleno", categoria: "Individuales", precio: 42 },
  ],
  "Restaurante": [
    { nombre: "Salmón a la mantequilla", categoria: "Platos fuertes", precio: 215 },
    { nombre: "Filete en salsa terracota", categoria: "Platos fuertes", precio: 240 },
    { nombre: "Ensalada templada", categoria: "Entradas", precio: 135 },
    { nombre: "Risotto campestre", categoria: "Platos fuertes", precio: 198 },
    { nombre: "Sopa de elote rostizado", categoria: "Entradas", precio: 110 },
    { nombre: "Tostadas de atún", categoria: "Entradas", precio: 145 },
  ],
  "Tienda de abarrotes": [
    { nombre: "Caja de frutas frescas", categoria: "Despensa fresca", precio: 185 },
    { nombre: "Hortalizas orgánicas", categoria: "Despensa fresca", precio: 98 },
    { nombre: "Granos ancestrales", categoria: "Despensa seca", precio: 140 },
    { nombre: "Especias selectas", categoria: "Despensa seca", precio: 90 },
    { nombre: "Miel artesanal", categoria: "Gourmet", precio: 120 },
    { nombre: "Café de cooperativa", categoria: "Gourmet", precio: 160 },
  ],
  "Farmacia": [
    { nombre: "Analgesico 24h", categoria: "Medicamentos", precio: 84 },
    { nombre: "Vitamina C efervescente", categoria: "Suplementos", precio: 150 },
    { nombre: "Kit primeros auxilios", categoria: "Botiquín", precio: 265 },
    { nombre: "Gel antibacterial herbal", categoria: "Cuidado personal", precio: 72 },
    { nombre: "Protector solar familiar", categoria: "Dermocosmética", precio: 210 },
    { nombre: "Omega 3 premium", categoria: "Suplementos", precio: 195 },
  ],
  "Tienda de electrónica": [
    { nombre: "Cargador USB-C", categoria: "Accesorios", precio: 320 },
    { nombre: "Audífonos inalámbricos", categoria: "Audio", precio: 560 },
    { nombre: "Power bank solar", categoria: "Accesorios", precio: 480 },
    { nombre: "Barra de sonido compacta", categoria: "Audio", precio: 890 },
    { nombre: "Smartwatch deportivo", categoria: "Wearables", precio: 1290 },
    { nombre: "Foco inteligente", categoria: "Hogar", precio: 260 },
  ],
  "Boutique de ropa": [
    { nombre: "Vestido lino", categoria: "Damas", precio: 780 },
    { nombre: "Camisa lino orgánico", categoria: "Caballeros", precio: 640 },
    { nombre: "Sombrero palma", categoria: "Accesorios", precio: 420 },
    { nombre: "Blusa bordada", categoria: "Damas", precio: 520 },
    { nombre: "Pantalón relaxed", categoria: "Caballeros", precio: 690 },
    { nombre: "Chal artesanal", categoria: "Accesorios", precio: 560 },
  ],
  "Servicio automotriz": [
    { nombre: "Cambio de aceite", categoria: "Servicios", precio: 420 },
    { nombre: "Alineación y balanceo", categoria: "Servicios", precio: 360 },
    { nombre: "Lavado detallado", categoria: "Detalle", precio: 280 },
    { nombre: "Sanitización interior", categoria: "Detalle", precio: 310 },
    { nombre: "Inspección de frenos", categoria: "Servicios", precio: 450 },
    { nombre: "Carga de aire acondicionado", categoria: "Servicios", precio: 390 },
  ],
  "Papelería": [
    { nombre: "Paquete cuadernos premium", categoria: "Escolar", precio: 118 },
    { nombre: "Kit marcadores pastel", categoria: "Escolar", precio: 95 },
    { nombre: "Set caligrafía", categoria: "Arte", precio: 210 },
    { nombre: "Agenda artesanal", categoria: "Oficina", precio: 150 },
    { nombre: "Caja colores acuarelables", categoria: "Arte", precio: 245 },
    { nombre: "Papel reciclado", categoria: "Oficina", precio: 80 },
  ],
  "Barbería": [
    { nombre: "Corte clásico", categoria: "Servicios", precio: 170 },
    { nombre: "Afeitado con navaja", categoria: "Servicios", precio: 145 },
    { nombre: "Perfilado de barba", categoria: "Servicios", precio: 160 },
    { nombre: "Mascarilla facial", categoria: "Tratamientos", precio: 190 },
    { nombre: "Paquete caballero", categoria: "Servicios", precio: 260 },
    { nombre: "Tratamiento capilar", categoria: "Tratamientos", precio: 230 },
  ],
  "Spa y estética": [
    { nombre: "Facial hidratante", categoria: "Tratamientos", precio: 480 },
    { nombre: "Masaje relajante", categoria: "Tratamientos", precio: 640 },
    { nombre: "Exfoliación corporal", categoria: "Tratamientos", precio: 520 },
    { nombre: "Circuito hidroterapia", categoria: "Experiencias", precio: 780 },
    { nombre: "Mani-pedi herbal", categoria: "Cuidado personal", precio: 420 },
    { nombre: "Ritual de aromaterapia", categoria: "Experiencias", precio: 610 },
  ],
};

const generateProductos = (): Producto[] => {
  let idCounter = 1;
  const productos: Producto[] = [];

  const ensureFifty = (giro: string, templates: ProductoBase[]) => {
    for (let i = 0; i < 50; i += 1) {
      const template = templates[i % templates.length];
      const variant = PRODUCT_VARIANTS[i % PRODUCT_VARIANTS.length];
      const lote = Math.floor(i / PRODUCT_VARIANTS.length) + 1;
      const priceVariation = ((i % 6) * 2.5 + lote).toFixed(2);
      productos.push({
        id: idCounter,
        nombre: `${template.nombre} ${variant} Lote ${lote}`.trim(),
        categoria: template.categoria,
        precio: Number((template.precio + Number(priceVariation)).toFixed(2)),
        giro,
      });
      idCounter += 1;
    }
  };

  Object.entries(PRODUCT_BLUEPRINTS).forEach(([giro, templates]) => {
    ensureFifty(giro, templates);
  });

  return productos;
};

export async function GET() {
  try {
    const negocios = [
      {
        id: 1,
        nombre: "Cafetería Central",
        ciudad: "Guadalajara",
        giro: "Cafetería",
      },
      { id: 2, nombre: "Tacos El Güero", ciudad: "Zapopan", giro: "Taquería" },
      {
        id: 3,
        nombre: "Panadería Delicias",
        ciudad: "Tlaquepaque",
        giro: "Panadería",
      },
      { id: 4, nombre: "Helados Frosti", ciudad: "Tonala", giro: "Heladería" },
      { id: 5, nombre: "Café y Más", ciudad: "Tlajomulco", giro: "Cafetería" },
      {
        id: 6,
        nombre: "La Esquina del Taco",
        ciudad: "Guadalajara",
        giro: "Taquería",
      },
      {
        id: 7,
        nombre: "Pastelería Dulce Vida",
        ciudad: "Zapopan",
        giro: "Pastelería",
      },
      {
        id: 8,
        nombre: "Helados La Michoacana",
        ciudad: "Tlaquepaque",
        giro: "Heladería",
      },
      { id: 9, nombre: "Bistró Café", ciudad: "Tonala", giro: "Restaurante" },
      {
        id: 10,
        nombre: "Tacos y Salsas",
        ciudad: "Tlajomulco",
        giro: "Taquería",
      },
      {
        id: 11,
        nombre: "Panadería La Espiga",
        ciudad: "Guadalajara",
        giro: "Panadería",
      },
      {
        id: 12,
        nombre: "Helados y Postres",
        ciudad: "Zapopan",
        giro: "Heladería",
      },
      {
        id: 13,
        nombre: "Verduras Frescas",
        ciudad: "Guadalajara",
        giro: "Tienda de abarrotes",
      },
      {
        id: 14,
        nombre: "Farmacia Los Ángeles",
        ciudad: "Zapopan",
        giro: "Farmacia",
      },
      {
        id: 15,
        nombre: "Tienda TecnoFix",
        ciudad: "Tlaquepaque",
        giro: "Tienda de electrónica",
      },
      {
        id: 16,
        nombre: "Boutique Lunna",
        ciudad: "Tonala",
        giro: "Boutique de ropa",
      },
      {
        id: 17,
        nombre: "Llantera El Rayo",
        ciudad: "Tlajomulco",
        giro: "Servicio automotriz",
      },
      {
        id: 18,
        nombre: "Papelería Escolar",
        ciudad: "Guadalajara",
        giro: "Papelería",
      },
      {
        id: 19,
        nombre: "Barbería Don Juan",
        ciudad: "Zapopan",
        giro: "Barbería",
      },
      {
        id: 20,
        nombre: "Spa Zen",
        ciudad: "Tlaquepaque",
        giro: "Spa y estética",
      },
    ];

    const productos = generateProductos();

    return NextResponse.json({ negocios, productos });
  } catch (error) {
    console.error("Error en API:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

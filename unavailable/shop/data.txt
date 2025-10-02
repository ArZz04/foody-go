export type Category = {
  slug: string;
  name: string;
  emoji: string;
  description: string;
};

export type Store = {
  name: string;
  category: string;
  blurb: string;
  eta: string;
  price: string;
  rating: number;
  promo: string | null;
  image: string;
  tags: string[];
  labels: string[];
};

export type Promotion = {
  title: string;
  description: string;
  cta: string;
  image: string;
  tag: string;
};

export const IMAGE_BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2N89+7dfwAIbAPC0tDr3QAAAABJRU5ErkJggg==";

export const categories: Category[] = [
  {
    slug: "postres",
    name: "Postres",
    emoji: "🍰",
    description: "Pasteles, helados y antojitos dulces para cualquier antojo.",
  },
  {
    slug: "comidas",
    name: "Comidas",
    emoji: "🍽️",
    description: "Platos fuertes y comfort food para recargar energía.",
  },
  {
    slug: "bebidas",
    name: "Bebidas",
    emoji: "🥤",
    description: "Smoothies, cafés y bebidas refrescantes a cualquier hora.",
  },
  {
    slug: "regalos",
    name: "Regalos",
    emoji: "🎁",
    description: "Detalles especiales para celebrar y sorprender.",
  },
  {
    slug: "flores",
    name: "Flores",
    emoji: "💐",
    description: "Arreglos florales frescos para cada ocasión.",
  },
  {
    slug: "cabanas",
    name: "Cabañas",
    emoji: "🏡",
    description: "Escapadas y hospedajes rodeados de naturaleza.",
  },
  {
    slug: "taxis",
    name: "Taxis",
    emoji: "🚕",
    description: "Traslados seguros y rápidos dentro de la ciudad.",
  },
];

export const promotions: Promotion[] = [
  {
    title: "Delivery verde",
    description:
      "Obtén 30% de descuento en pedidos eco-friendly durante esta semana.",
    cta: "Ordenar ahora",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    tag: "Hasta 30% menos",
  },
  {
    title: "Bebidas refrescantes",
    description: "Dos smoothies por el precio de uno en tiendas seleccionadas.",
    cta: "Descubrir",
    image:
      "https://images.unsplash.com/photo-1527169402691-feff5539e52c?auto=format&fit=crop&w=800&q=80",
    tag: "2x1",
  },
  {
    title: "Escapadas a la montaña",
    description: "Reserva cabañas con 20% de descuento en fechas especiales.",
    cta: "Ver cabañas",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    tag: "Promo limitada",
  },
];

export const stores: Store[] = [
  {
    name: "Chilango Burger",
    category: "Hamburguesas",
    blurb: "Hamburguesas artesanales con ingredientes frescos.",
    eta: "25-40 min",
    price: "MX$28",
    rating: 4.7,
    promo: "Ahorra hasta un 20%",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80",
    tags: ["comidas"],
    labels: ["popular", "promo"],
  },
  {
    name: "Postres y Antojitos",
    category: "Repostería",
    blurb: "Cheesecakes, brownies y postres para compartir.",
    eta: "25-40 min",
    price: "MX$21",
    rating: 4.5,
    promo: null,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    tags: ["postres"],
    labels: ["popular"],
  },
  {
    name: "Pizza Hut Terraza",
    category: "Pizza",
    blurb: "Pizzas clásicas con masa crujiente y toppings premium.",
    eta: "25-40 min",
    price: "MX$32",
    rating: 3.6,
    promo: "Descuentos hasta MX$89",
    image:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80",
    tags: ["comidas"],
    labels: ["promo"],
  },
  {
    name: "A las Flautas",
    category: "Mexicana",
    blurb: "Auténtica comida mexicana con recetas caseras.",
    eta: "20-35 min",
    price: "MX$18",
    rating: 4.4,
    promo: null,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    tags: ["comidas"],
    labels: ["popular"],
  },
  {
    name: "Crepinco",
    category: "Crepas & café",
    blurb: "Crepas dulces, saladas y café de especialidad.",
    eta: "25-40 min",
    price: "MX$18",
    rating: 4.4,
    promo: null,
    image:
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80",
    tags: ["postres", "bebidas"],
    labels: ["vegano", "popular"],
  },
  {
    name: "Bom Porco",
    category: "Carnitas",
    blurb: "Carnitas estilo Michoacán para amantes de lo tradicional.",
    eta: "35-50 min",
    price: "MX$27",
    rating: 4.2,
    promo: "Ahorra hasta un 30%",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80",
    tags: ["comidas"],
    labels: ["popular"],
  },
  {
    name: "Sal Marina Marisquería",
    category: "Mariscos",
    blurb: "Mariscos frescos con sabor a costa.",
    eta: "20-35 min",
    price: "MX$18",
    rating: 4.3,
    promo: null,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    tags: ["comidas"],
    labels: ["popular"],
  },
  {
    name: "El Globo (Arenal)",
    category: "Panadería",
    blurb: "Panadería clásica con pasteles y pan dulce recién horneado.",
    eta: "25-40 min",
    price: "MX$21",
    rating: 4.3,
    promo: "Ahorra hasta un 50%",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    tags: ["postres"],
    labels: ["promo"],
  },
  {
    name: "Huarachería & Caldos",
    category: "Mexicana",
    blurb: "Caldos y huaraches tradicionales.",
    eta: "30-45 min",
    price: "MX$24",
    rating: 4.2,
    promo: null,
    image:
      "https://images.unsplash.com/photo-1600891965059-04f2819d7d5a?auto=format&fit=crop&w=800&q=80",
    tags: ["comidas"],
    labels: [],
  },
  {
    name: "Il Diavolo Rosso",
    category: "Italiana",
    blurb: "Cocina italiana con pasta fresca y vinos seleccionados.",
    eta: "25-40 min",
    price: "MX$34",
    rating: 4.6,
    promo: null,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    tags: ["comidas"],
    labels: ["popular"],
  },
  {
    name: "Alitas & Boneless Fénix",
    category: "Wings",
    blurb: "Alitas, boneless y salsas caseras.",
    eta: "30-45 min",
    price: "MX$26",
    rating: 4.0,
    promo: "2x1 en martes",
    image:
      "https://images.unsplash.com/photo-1604908177085-53053fe5586f?auto=format&fit=crop&w=800&q=80",
    tags: ["comidas"],
    labels: ["promo"],
  },
  {
    name: "Snack's Jailys",
    category: "Snacks",
    blurb: "Antojitos, frappés y snacks a cualquier hora.",
    eta: "20-35 min",
    price: "MX$19",
    rating: 4.1,
    promo: null,
    image:
      "https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=800&q=80",
    tags: ["postres", "bebidas"],
    labels: ["popular"],
  },
  {
    name: "Detallitos Express",
    category: "Regalos a domicilio",
    blurb: "Arreglos y cajas sorpresa listas para regalar.",
    eta: "60-90 min",
    price: "Desde MX$250",
    rating: 4.8,
    promo: "Envío gratis en la primer compra",
    image:
      "https://images.unsplash.com/photo-1487537023671-8dce1a785863?auto=format&fit=crop&w=800&q=80",
    tags: ["regalos"],
    labels: ["promo", "popular"],
  },
  {
    name: "Armonía Floral",
    category: "Floristería",
    blurb: "Ramos personalizados con entrega el mismo día.",
    eta: "90-120 min",
    price: "Desde MX$320",
    rating: 4.9,
    promo: null,
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80",
    tags: ["flores"],
    labels: ["popular"],
  },
  {
    name: "Cabañas del Bosque",
    category: "Escapadas",
    blurb: "Cabañas rústicas con chimenea y vista espectacular.",
    eta: "Reserva",
    price: "Desde MX$1800/noche",
    rating: 4.7,
    promo: "20% de descuento entre semana",
    image:
      "https://images.unsplash.com/photo-1469796466635-455ede028aca?auto=format&fit=crop&w=800&q=80",
    tags: ["cabanas"],
    labels: ["promo", "popular"],
  },
  {
    name: "Taxi Verde",
    category: "Traslados",
    blurb: "Traslados confiables con choferes certificados.",
    eta: "Llegamos en 10-15 min",
    price: "Tarifa inicial MX$35",
    rating: 4.5,
    promo: null,
    image:
      "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=800&q=80",
    tags: ["taxis"],
    labels: ["popular"],
  },
  {
    name: "Cold Brew Lab",
    category: "Cafetería",
    blurb: "Cafés fríos, tés y kombucha en botellas retornables.",
    eta: "30-45 min",
    price: "MX$45",
    rating: 4.6,
    promo: "Segunda bebida al 50%",
    image:
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80",
    tags: ["bebidas"],
    labels: ["vegano", "promo"],
  },
  {
    name: "Smoothie Lab",
    category: "Bebidas saludables",
    blurb: "Smoothies energizantes con superfoods.",
    eta: "20-30 min",
    price: "MX$60",
    rating: 4.4,
    promo: null,
    image:
      "https://images.unsplash.com/photo-1527169402691-feff5539e52c?auto=format&fit=crop&w=800&q=80",
    tags: ["bebidas"],
    labels: ["vegano"],
  },
  {
    name: "Rosas & Eventos",
    category: "Flores premium",
    blurb: "Flores preservadas y arreglos premium.",
    eta: "Reserva",
    price: "Desde MX$420",
    rating: 4.7,
    promo: "10% en pedidos anticipados",
    image:
      "https://images.unsplash.com/photo-1457089328109-e5d9bd499191?auto=format&fit=crop&w=800&q=80",
    tags: ["flores", "regalos"],
    labels: ["promo"],
  },
  {
    name: "Nido Alpino",
    category: "Escapadas",
    blurb: "Cabañas boutique con jacuzzi al aire libre.",
    eta: "Reserva",
    price: "Desde MX$2600/noche",
    rating: 4.9,
    promo: "Incluye desayuno artesanal",
    image:
      "https://images.unsplash.com/photo-1475855581690-80accde3ae2b?auto=format&fit=crop&w=800&q=80",
    tags: ["cabanas"],
    labels: ["popular"],
  },
  {
    name: "CityRide",
    category: "Traslados ejecutivos",
    blurb: "Servicio ejecutivo con seguimiento en vivo.",
    eta: "10-20 min",
    price: "Tarifa inicial MX$45",
    rating: 4.6,
    promo: "10% de descuento después de las 10pm",
    image:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=800&q=80",
    tags: ["taxis"],
    labels: ["promo", "popular"],
  },
];

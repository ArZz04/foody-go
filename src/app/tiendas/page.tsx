const stores = [
  {
    name: "Chilango Burger",
    category: "Hamburguesas",
    eta: "25-40 min",
    price: "MX$28",
    rating: 4.7,
    promo: "Ahorra hasta un 20%",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Postres y Antojitos",
    category: "Dulces & antojos",
    eta: "25-40 min",
    price: "MX$21",
    rating: 4.5,
    promo: null,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Pizza Hut Terraza",
    category: "Pizza",
    eta: "25-40 min",
    price: "MX$32",
    rating: 3.6,
    promo: "Descuentos hasta MX$89",
    image:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "A las Flautas",
    category: "Mexicana",
    eta: "20-35 min",
    price: "MX$18",
    rating: 4.4,
    promo: null,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Crepinco",
    category: "Crepas & café",
    eta: "25-40 min",
    price: "MX$18",
    rating: 4.4,
    promo: null,
    image:
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Bom Porco",
    category: "Carnitas",
    eta: "35-50 min",
    price: "MX$27",
    rating: 4.2,
    promo: "Ahorra hasta un 30%",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Sal Marina Marisquería",
    category: "Mariscos",
    eta: "20-35 min",
    price: "MX$18",
    rating: 4.3,
    promo: null,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "El Globo (Arenal)",
    category: "Panadería",
    eta: "25-40 min",
    price: "MX$21",
    rating: 4.3,
    promo: "Ahorra hasta un 50%",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Huarachería & Caldos",
    category: "Mexicana",
    eta: "30-45 min",
    price: "MX$24",
    rating: 4.2,
    promo: null,
    image:
      "https://images.unsplash.com/photo-1600891965059-04f2819d7d5a?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Il Diavolo Rosso",
    category: "Italiana",
    eta: "25-40 min",
    price: "MX$34",
    rating: 4.6,
    promo: null,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Alitas & Boneless Fénix",
    category: "Wings",
    eta: "30-45 min",
    price: "MX$26",
    rating: 4.0,
    promo: "2x1 en martes",
    image:
      "https://images.unsplash.com/photo-1604908177085-53053fe5586f?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Snack's Jailys",
    category: "Snacks",
    eta: "20-35 min",
    price: "MX$19",
    rating: 4.1,
    promo: null,
    image:
      "https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=800&q=80",
  },
];

const categories = [
  { name: "Postres", emoji: "🍰" },
  { name: "Comidas", emoji: "🍽️" },
  { name: "Bebidas", emoji: "🥤" },
  { name: "Regalos", emoji: "🎁" },
  { name: "Flores", emoji: "💐" },
  { name: "Cabañas", emoji: "🏡" },
  { name: "Taxis", emoji: "🚕" },
];

const promotions = [
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

export default function TiendasPage() {
  return (
    <div className="min-h-screen bg-white/80 text-foreground">
      <header className="border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="container mx-auto flex flex-col gap-2 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Entrega a
            </p>
            <h1 className="text-3xl font-bold text-foreground">
              Todas las tiendas
            </h1>
          </div>
          <div className="flex w-full max-w-md items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-2 shadow-sm">
            <span className="text-muted-foreground">🔍</span>
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
              placeholder="Buscar tiendas o comida"
              aria-label="Buscar"
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <section className="space-y-4">
          <header className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              ¿Qué necesitas hoy?
            </h2>
            <button className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
              Ver todo
            </button>
          </header>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {categories.map((category) => (
              <button
                key={category.name}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-white/80 px-4 py-5 text-sm font-medium text-emerald-800 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
              >
                <span className="text-2xl">{category.emoji}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8 space-y-4">
          <header className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Promociones destacadas
            </h2>
            <button className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
              Ver promociones
            </button>
          </header>
          <div className="grid gap-4 md:grid-cols-3">
            {promotions.map((promo) => (
              <article
                key={promo.title}
                className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-600/90 to-emerald-700 text-white shadow-lg"
              >
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-40"
                  loading="lazy"
                />
                <div className="relative space-y-3 p-6">
                  <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    {promo.tag}
                  </span>
                  <h3 className="text-2xl font-semibold leading-tight drop-shadow-sm">
                    {promo.title}
                  </h3>
                  <p className="text-sm text-white/80 drop-shadow-sm">
                    {promo.description}
                  </p>
                  <button className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-white">
                    {promo.cta}
                    <span aria-hidden>→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {stores.map((store) => (
            <article
              key={store.name}
              className="group rounded-3xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="overflow-hidden rounded-t-3xl">
                <img
                  src={store.image}
                  alt={store.name}
                  className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="space-y-3 px-5 py-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {store.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {store.category}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    ★ {store.rating}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{store.eta}</span>
                  <span>•</span>
                  <span>{store.price}</span>
                </div>
                {store.promo ? (
                  <span className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                    {store.promo}
                  </span>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

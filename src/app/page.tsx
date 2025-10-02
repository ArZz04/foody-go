import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoveRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="relative text-white">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              🚀 Entrega en 30 minutos o menos
            </Badge>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 text-balance drop-shadow-lg">
              Tu comida favorita,{" "}
              <span className="text-primary-foreground">al instante</span>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto text-pretty">
              Descubre miles de restaurantes locales. Ordena con un click y
              disfruta de la mejor comida en la comodidad de tu hogar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 shadow-lg">
                Ordenar ahora
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="group relative overflow-hidden text-lg px-8 py-6 border-white/60 bg-white/10 text-white backdrop-blur transition duration-300 ease-out hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(255,255,255,0.35)]"
              >
                <Link href="/shop" className="flex items-center gap-2">
                  <span className="relative z-10 flex items-center gap-2 font-medium transition-transform duration-300 group-hover:translate-x-1 group-hover:text-foreground">
                    Ver tiendas
                    <MoveRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <span className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-white/40 via-white to-white/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2 drop-shadow">
                500+
              </div>
              <div className="text-white/70">Restaurantes</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2 drop-shadow">
                25min
              </div>
              <div className="text-white/70">Tiempo promedio</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2 drop-shadow">
                50k+
              </div>
              <div className="text-white/70">Clientes felices</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2 drop-shadow">
                4.8★
              </div>
              <div className="text-white/70">Calificación</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              ¿Por qué elegir food-go?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              La experiencia de delivery más rápida y confiable de la ciudad
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-black/50 border-white/10 backdrop-blur">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Súper rápido
                </h3>
                <p className="text-white/80">
                  Entrega garantizada en 30 minutos o tu pedido es gratis
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-white/10 backdrop-blur">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🍕</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Variedad infinita
                </h3>
                <p className="text-white/80">
                  Desde pizza hasta sushi, encuentra exactamente lo que se te
                  antoja
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-white/10 backdrop-blur">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💳</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Pago seguro
                </h3>
                <p className="text-white/80">
                  Múltiples métodos de pago con la máxima seguridad
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl font-bold text-white mb-6 text-balance drop-shadow-lg">
              ¿Listo para tu próxima{" "}
              <span className="text-primary-foreground">comida perfecta?</span>
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Únete a miles de usuarios que ya disfrutan de la mejor experiencia
              de delivery
            </p>
            <Button size="lg" className="text-lg px-12 py-6 shadow-lg">
              Comenzar ahora
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}

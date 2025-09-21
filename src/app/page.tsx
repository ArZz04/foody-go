import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="relative">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              🚀 Entrega en 30 minutos o menos
            </Badge>
            <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6 text-balance">
              Tu comida favorita, <span className="text-primary">al instante</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              Descubre miles de restaurantes locales. Ordena con un click y disfruta de la mejor comida en la comodidad
              de tu hogar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                Ordenar ahora
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
                Ver restaurantes
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Restaurantes</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">25min</div>
              <div className="text-muted-foreground">Tiempo promedio</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50k+</div>
              <div className="text-muted-foreground">Clientes felices</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">4.8★</div>
              <div className="text-muted-foreground">Calificación</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">¿Por qué elegir food-go?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              La experiencia de delivery más rápida y confiable de la ciudad
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Súper rápido</h3>
                <p className="text-muted-foreground">Entrega garantizada en 30 minutos o tu pedido es gratis</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🍕</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Variedad infinita</h3>
                <p className="text-muted-foreground">
                  Desde pizza hasta sushi, encuentra exactamente lo que se te antoja
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💳</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Pago seguro</h3>
                <p className="text-muted-foreground">Múltiples métodos de pago con la máxima seguridad</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl font-bold text-foreground mb-6 text-balance">
              ¿Listo para tu próxima <span className="text-primary">comida perfecta?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Únete a miles de usuarios que ya disfrutan de la mejor experiencia de delivery
            </p>
            <Button size="lg" className="text-lg px-12 py-6">
              Comenzar ahora
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeroStats } from "@/components/home/HeroStats";
import { ReviewRotator } from "@/components/home/ReviewRotator";
import { LiveActivity } from "@/components/home/LiveActivity";
import { HeroActions } from "@/components/home/HeroActions";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-cover bg-center text-[#3E2F28]"
      style={{ backgroundImage: "url('/fondo-bosque.jpg')" }}
    >
      <div className="min-h-screen bg-gradient-to-b from-black/70 via-black/60 to-black/80">
        <main className="relative pb-16">
          <section className="relative w-full pb-16 pt-20">
            <div className="relative overflow-hidden px-6 py-20 shadow-[inset_0_-60px_120px_rgba(0,0,0,0.55)] lg:px-16">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/fondo-bosque.jpg')" }}
              />
              <div className="absolute inset-0 bg-black/35" />

              <LiveActivity />

              <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 text-center text-white">
                <Badge className="mb-6 border border-white/60 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-[#2E5946]">
                  Apoyando aliados locales
                </Badge>
                <h1 className="font-serif text-4xl leading-tight text-white md:text-6xl">
                  Tu comida favorita, al instante
                </h1>
                <p className="mt-4 max-w-2xl text-base text-white/85 md:text-lg">
                  Apoyando a los primeros aliados de Mazamitla y rancherías cercanas.
                  Sabores hechos en casa, entregados con calidez rural y puntualidad moderna.
                </p>
                <HeroActions />
                <HeroStats />
                <ReviewRotator />
              </div>
            </div>
          </section>

          <section className="px-4 py-16">
            <div className="mx-auto max-w-6xl rounded-[36px] border border-white/15 bg-white/90 px-6 py-12 shadow-[0_25px_60px_rgba(0,0,0,0.25)] backdrop-blur">
              <div className="mb-12 text-center">
                <h2 className="font-serif text-4xl text-[#3E2F28]">
                  ¿Por qué elegir Foody Go?
                </h2>
                <p className="mt-3 text-lg text-[#5F5148]">
                  La experiencia gourmet-local que impulsa a los barrios de Jalisco
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-3">
                <Card className="rounded-[28px] border-[#E2D9D0] bg-white/90 shadow-[0_20px_45px_rgba(0,0,0,0.08)]">
                  <CardContent className="p-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F3ECE4] text-2xl">
                      ⚡
                    </div>
                    <h3 className="text-xl font-semibold text-[#3E2F28]">
                      Súper rápido
                    </h3>
                    <p className="mt-3 text-sm text-[#5F5148]">
                      Aliados confirmando pedidos en minutos y rutas optimizadas para tu zona.
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-[28px] border-[#E2D9D0] bg-white/90 shadow-[0_20px_45px_rgba(0,0,0,0.08)]">
                  <CardContent className="p-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F3ECE4] text-2xl">
                      🍕
                    </div>
                    <h3 className="text-xl font-semibold text-[#3E2F28]">
                      Variedad local
                    </h3>
                    <p className="mt-3 text-sm text-[#5F5148]">
                      Cafeterías, panaderías y taquerías familiares reunidas en un mismo lugar.
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-[28px] border-[#E2D9D0] bg-white/90 shadow-[0_20px_45px_rgba(0,0,0,0.08)]">
                  <CardContent className="p-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F3ECE4] text-2xl">
                      💳
                    </div>
                    <h3 className="text-xl font-semibold text-[#3E2F28]">
                      Pago seguro
                    </h3>
                    <p className="mt-3 text-sm text-[#5F5148]">
                      Métodos de pago confiables y soporte cercano para aliados y comensales.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4 py-20 text-center">
            <div className="mx-auto max-w-3xl rounded-[36px] border border-[#E2D9D0] bg-[#F8F5F0] px-6 py-12 shadow-[0_25px_55px_rgba(0,0,0,0.1)]">
              <h2 className="font-serif text-4xl text-[#3E2F28]">
                ¿Listo para apoyar a los aliados locales?
              </h2>
              <p className="mt-3 text-lg text-[#5F5148]">
                Únete a la comunidad Foody Go y descubre el sabor artesanal que tenemos cerca de casa.
              </p>
              <Button className="mt-8 rounded-full bg-[#3E2F28] px-10 py-3 text-base text-white hover:bg-[#2e201b]">
                Comenzar ahora
              </Button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

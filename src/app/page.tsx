import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReviewRotator } from "@/components/home/ReviewRotator";
import { HeroActions } from "@/components/home/HeroActions";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[2px]"
        style={{ backgroundImage: "url('/fondo-bosque.jpg')" }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

      {/* Content */}
      <main className="relative z-10 pb-16">

        {/* HERO SECTION */}
        <section className="relative w-full pb-16">
          <div className="relative overflow-hidden px-6 py-20 lg:px-16">
            <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 text-center text-white">

              <div
                className="
                  mb-5
                  h-20 w-20
                  rounded-full
                  border border-white/40
                  bg-white/90
                  shadow-xl
                  backdrop-blur-sm
                  flex items-center justify-center
                "
              >
                <Image
                  src="/logo-rounded.png"
                  alt="Foody Go Logo"
                  width={68}
                  height={68}
                  className="p-3 object-contain"
                  priority
                />
              </div>
              {/* Badge */}
              <Badge className="mb-6 border border-white/60 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-[#2E5946]">
                Apoyando aliados locales
              </Badge>

              {/* Heading */}
              <h1 className="font-serif text-4xl leading-tight text-white md:text-6xl">
                Tu comida favorita, al instante
              </h1>

              {/* Subheading */}
              <p className="mt-4 max-w-2xl text-base text-white/85 md:text-lg">
                Apoyando a los primeros aliados de zonas rurales y rancherías cercanas.
                Sabores hechos en casa, entregados con calidez de comunidad y puntualidad moderna.
              </p>

              {/* Hero Buttons */}
              <HeroActions />

              {/* Highlights */}
              <div className="mt-10 grid w-full gap-4 text-sm text-white/90 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 shadow-lg backdrop-blur">
                  <p className="font-semibold text-white">
                    Pan recién horneado, directo de los hornos de la sierra
                  </p>
                </div>

                <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 shadow-lg backdrop-blur">
                  <p className="font-semibold text-white">
                    Cocinas rurales verificadas con recetas que no encuentras en la ciudad
                  </p>
                </div>

                <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 shadow-lg backdrop-blur">
                  <p className="font-semibold text-white">
                    Repartidores locales que conocen cada brecha y camino de terracería
                  </p>
                </div>
              </div>

              {/* Rotator */}
              <ReviewRotator />

            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-6xl rounded-[36px] border border-white/15 bg-white/90 px-6 py-12 shadow-[0_25px_60px_rgba(0,0,0,0.25)] backdrop-blur">

            <div className="mb-12 text-center">
              <h2 className="font-serif text-4xl text-[#3E2F28]">
                ¿Por qué elegir Foody Go?
              </h2>
              <p className="mt-3 text-lg text-[#5F5148]">
                La experiencia gourmet-local que conecta cocinas rurales con quienes las disfrutan
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">

              {/* Card 1 */}
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

              {/* Card 2 */}
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

              {/* Card 3 */}
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

        {/* CALL TO ACTION */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="mx-auto max-w-3xl rounded-[36px] border border-[#E2D9D0] bg-[#F8F5F0] px-6 py-12 shadow-[0_25px_55px_rgba(0,0,0,0.1)]">

            <h2 className="font-serif text-4xl text-[#3E2F28]">
              ¿Listo para apoyar a los aliados locales?
            </h2>

            <p className="mt-3 text-lg text-[#5F5148]">
              Únete a la comunidad Foody Go y descubre el sabor artesanal que tenemos cerca de casa.
            </p>

            <Link href="/auth?mode=register">
              <Button className="mt-8 rounded-full bg-[#3E2F28] px-10 py-3 text-base text-white hover:bg-[#2e201b]">
                Comenzar ahora
              </Button>
            </Link>

          </div>
        </section>

      </main>

    </div>
  );
}

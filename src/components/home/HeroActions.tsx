"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function HeroActions() {
  const router = useRouter();
  const { user } = useAuth();

  const handleOrder = () => {
    if (user) {
      router.push("/shop");
      return;
    }
    router.push("/auth?mode=login");
  };

  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
      <Button
        onClick={handleOrder}
        className="rounded-full bg-white/90 px-8 py-3 text-base font-semibold text-[#3E2F28] transition hover:bg-white"
      >
        Ordenar ahora
      </Button>
      <Button
        asChild
        variant="outline"
        className="rounded-full border-white bg-transparent px-8 py-3 text-base text-white transition hover:bg-white/10"
      >
        <Link href="/shop" className="flex items-center gap-2">
          Ver tiendas
          <MoveRight className="h-5 w-5" />
        </Link>
      </Button>
    </div>
  );
}

export default HeroActions;

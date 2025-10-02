"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b border-white/10 bg-black/40 text-white backdrop-blur supports-[backdrop-filter]:bg-black/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                  src="/logo.png"
                  alt="Logo"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-white/80 hover:text-white transition-colors"
            >
              Inicio
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="hidden rounded-full border border-white/30 bg-white/10 text-white hover:bg-white/20 sm:inline-flex"
                >
                  <Link href="/carrito" className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Carrito</span>
                  </Link>
                </Button>
                <span className="text-white/80">Hola, {user.name}</span>
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="text-white hover:bg-white/10"
                >
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  asChild
                  className="text-white hover:bg-white/10"
                >
                  <Link href="/auth?mode=login">Iniciar Sesión</Link>
                </Button>
                <Button
                  asChild
                  className="bg-white text-black hover:bg-white/90"
                >
                  <Link href="/auth?mode=register">Registrarse</Link>
                </Button>
              </>
            )}
            {user ? (
              <Button
                asChild
                variant="ghost"
                className="inline-flex rounded-full border border-white/30 bg-white/10 text-white hover:bg-white/20 sm:hidden"
              >
                <Link href="/carrito" aria-label="Ir al carrito">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}

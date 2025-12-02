"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Menu, X } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"

export default function Navbar() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <nav className="border-b border-white/10 bg-transparent text-white backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop and Mobile Header */}
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                <Image src="/logo-white.png" alt="Logo" fill className="object-contain" priority />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white/80 transition-colors hover:text-white">
              Inicio
            </Link>
            {user && user.roles?.length > 1 && (
              <Link href="/pickdash" className="text-white/80 transition-colors hover:text-white">
                Paneles
              </Link>
            )}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="rounded-full border border-white/30 bg-white/10 text-white hover:bg-white/20"
                >
                  <Link href="/carrito" className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Carrito</span>
                  </Link>
                </Button>
                <span className="text-white/70 text-sm">Hola, {user.name}</span>
                <Button variant="ghost" onClick={logout} className="text-white hover:bg-white/10">
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="text-white hover:bg-white/10">
                  <Link href="/auth?mode=login">Iniciar Sesión</Link>
                </Button>
                <Button asChild className="bg-white text-black hover:bg-white/90">
                  <Link href="/auth?mode=register">Registrarse</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Header Actions */}
          <div className="flex md:hidden items-center gap-3">
            {user && (
              <Button asChild variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Link href="/carrito" aria-label="Carrito de compras">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-white hover:bg-white/10"
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 pt-4">
            {/* Navigation Links */}
            <div className="flex flex-col space-y-3 mb-4">
              <Link
                href="/"
                className="text-white/80 hover:text-white transition-colors px-2 py-2"
                onClick={closeMobileMenu}
              >
                Inicio
              </Link>
              {user && user.roles?.length > 1 && (
                <Link
                  href="/pickdash"
                  className="text-white/80 hover:text-white transition-colors px-2 py-2"
                  onClick={closeMobileMenu}
                >
                  Paneles
                </Link>
              )}
            </div>

            {/* Mobile Auth Section */}
            <div className="border-t border-white/10 pt-4">
              {user ? (
                <div className="flex flex-col space-y-2">
                  <div className="text-white/70 text-sm px-2 py-2">Hola, {user.name}</div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      logout()
                      closeMobileMenu()
                    }}
                    className="text-white hover:bg-white/10 w-full justify-start"
                  >
                    Cerrar sesión
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button variant="ghost" asChild className="text-white hover:bg-white/10 w-full justify-start">
                    <Link href="/auth?mode=login" onClick={closeMobileMenu}>
                      Iniciar Sesión
                    </Link>
                  </Button>
                  <Button asChild className="bg-white text-black hover:bg-white/90 w-full">
                    <Link href="/auth?mode=register" onClick={closeMobileMenu}>
                      Registrarse
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

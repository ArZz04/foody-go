import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">L</span>
              </div>
              <span className="font-bold text-xl text-foreground">Logo</span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-muted-foreground hover:text-foreground transition-colors">
              Características
            </Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Precios
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              Acerca de
            </Link>
          </div>

          {/* Auth Buttons */}
<div className="flex items-center space-x-4">
  <Button variant="ghost" asChild>
    <Link href="/auth?mode=login">Iniciar Sesión</Link>
  </Button>
  <Button asChild>
    <Link href="/auth?mode=register">Registrarse</Link>
  </Button>
</div>
        </div>
      </div>
    </nav>
  )
}

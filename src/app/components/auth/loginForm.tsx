"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function LoginForm() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [userType, setUserType] = useState("Usuario")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login attempt:", { phoneNumber, password, userType, acceptTerms })
  }

  return (
    <div className="bg-black rounded-2xl p-8 shadow-2xl">
      <h1 className="text-white text-2xl font-semibold mb-8 text-center">Inicio de sesión</h1>


      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Phone Number Field */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-white text-sm">
            Número de teléfono
          </Label>
          <div className="flex gap-2">
            <Select defaultValue="+52">
              <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="+52" className="text-white">
                  +52 México
                </SelectItem>
                <SelectItem value="+1" className="text-white">
                  +1 USA
                </SelectItem>
                <SelectItem value="+34" className="text-white">
                  +34 España
                </SelectItem>
              </SelectContent>
            </Select>
            <Input
              id="phone"
              type="tel"
              placeholder="3312726618"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-emerald-500"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white text-sm">
            Contraseña
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-emerald-500"
            required
          />
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-lg"
          disabled={!acceptTerms}
        >
          Iniciar sesión
        </Button>

        {/* Register Link */}
        <div className="text-center">
          <span className="text-gray-400 text-sm">
            ¿No tienes cuenta?{" "}
            <Link href="/auth?mode=register" className="text-emerald-400 hover:text-emerald-300">
              Regístrate
            </Link>
          </span>
        </div>
      </form>
    </div>
  )
}

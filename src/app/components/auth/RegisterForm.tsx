"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function RegisterForm() {
  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Register attempt:", { name, phoneNumber, password, confirmPassword, acceptTerms })
  }

  return (
    <div className="bg-black rounded-2xl p-8 shadow-2xl">
      <h1 className="text-white text-2xl font-semibold mb-8 text-center">Registro</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white text-sm">
            Nombre completo
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Tu nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-emerald-500"
            required
          />
        </div>

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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-white text-sm">
            Confirmar contraseña
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-emerald-500"
            required
          />
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(checked) => setAcceptTerms(checked === true)} />
          <Label htmlFor="terms" className="text-gray-300 text-sm">
            Acepto Términos de uso y política de privacidad
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-lg"
          disabled={!acceptTerms}
        >
          Registrarse
        </Button>

        <div className="text-center">
          <span className="text-gray-400 text-sm">
            ¿Ya tienes cuenta?{" "}
            <Link href="/auth?mode=login" className="text-emerald-400 hover:text-emerald-300">
              Inicia sesión
            </Link>
          </span>
        </div>
      </form>
    </div>
  )
}

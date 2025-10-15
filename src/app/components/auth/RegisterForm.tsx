"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // 👈 estado para errores
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone: phoneNumber,
          email,
          password,
          role: role || undefined,
        }),
      });

      if (res.ok) {
        router.push("/"); // 👈 redirige al home si fue exitoso
      } else {
        const data = await res.json();
        setErrorMessage(data.error || "Error en el registro");
      }
    } catch (err) {
      console.error("Error en la petición:", err);
      setErrorMessage("Error de conexión con el servidor");
    }
  };

  return (
    <div className="bg-black rounded-2xl p-8 shadow-2xl">
      <h1 className="text-white text-2xl font-semibold mb-8 text-center">
        Registro
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 👇 mensaje de error */}
        {errorMessage && (
          <p className="text-red-500 text-sm text-center">{errorMessage}</p>
        )}

        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-white text-sm">
            Nombre
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Tu nombre"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-emerald-500"
            required
          />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-white text-sm">
            Apellido
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Tu apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-emerald-500"
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white text-sm">
            Correo electrónico
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-emerald-500"
            required
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-white text-sm">
            Número de teléfono
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Tu número de contacto"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-emerald-500"
            required
          />
        </div>

        {/* Password */}
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

        {/* Confirm Password */}
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

        {/* Terms */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked === true)}
          />
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
            <Link
              href="/auth?mode=login"
              className="text-emerald-400 hover:text-emerald-300"
            >
              Inicia sesión
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}

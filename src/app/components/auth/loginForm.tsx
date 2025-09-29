"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        login(
          { id: data.user.id, name: data.user.name, role: data.user.role },
          data.token,
        );
        // Redirigir según rol
        router.push(data.redirectTo);
      } else {
        setErrorMessage(data.error || "Error en el inicio de sesión");
      }
    } catch (err) {
      console.error("Error en la petición:", err);
      setErrorMessage("Error de conexión con el servidor");
    }
  };

  return (
    <div className="bg-black rounded-2xl p-8 shadow-2xl">
      <h1 className="text-white text-2xl font-semibold mb-8 text-center">
        Inicio de sesión
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mensaje de error */}
        {errorMessage && (
          <p className="text-red-500 text-sm text-center">{errorMessage}</p>
        )}

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

        {/* Login Button */}
        <Button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-lg"
        >
          Iniciar sesión
        </Button>

        {/* Register Link */}
        <div className="text-center">
          <span className="text-gray-400 text-sm">
            ¿No tienes cuenta?{" "}
            <Link
              href="/auth?mode=register"
              className="text-emerald-400 hover:text-emerald-300"
            >
              Regístrate
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}

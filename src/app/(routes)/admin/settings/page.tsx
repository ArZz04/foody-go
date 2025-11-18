"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Device = {
  id: number;
  name: string;
  location: string;
  lastActive: string;
};

type Business = {
  id: number;
  name: string;
  category: string;
  active: boolean;
};

const INITIAL_DEVICES: Device[] = [
  {
    id: 1,
    name: "MacBook Pro 16”",
    location: "CDMX",
    lastActive: "Hace 2 horas",
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    location: "Querétaro",
    lastActive: "Hace 15 minutos",
  },
  {
    id: 3,
    name: "iPad Air",
    location: "Guadalajara",
    lastActive: "Hace 3 días",
  },
];

const INITIAL_BUSINESSES: Business[] = [
  {
    id: 1,
    name: "Taquería El Primo",
    category: "Comida Mexicana",
    active: true,
  },
  { id: 2, name: "Green Bowls", category: "Saludable", active: true },
  { id: 3, name: "Café Aurora", category: "Cafetería", active: false },
];

const PAYMENT_METHODS = [
  "Tarjeta de crédito o débito",
  "PayPal",
  "Transferencia bancaria",
  "Pago en efectivo",
];

export default function AdminSettingsPage() {
  const [language, setLanguage] = useState("es");
  const [timeZone, setTimeZone] = useState("america-mexico-city");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [businesses, setBusinesses] = useState(INITIAL_BUSINESSES);

  const handleToggleBusiness = (id: number) => {
    setBusinesses((prev) =>
      prev.map((business) =>
        business.id === id
          ? { ...business, active: !business.active }
          : business,
      ),
    );
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
      <div className="rounded-3xl border border-red-200/60 bg-white/80 px-6 py-6 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-white/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              Panel administrativo
            </p>
            <h1 className="text-3xl font-semibold text-red-600">
              ⚙️ Ajustes del Sistema
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-300">
              Administra preferencias, seguridad y operaciones clave del
              ecosistema FoodyGo.
            </p>
          </div>
          <Button variant="destructive" className="rounded-lg px-5">
            Guardar cambios rápidos
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-2 border-red-200/60 bg-white/90 shadow-lg dark:border-white/10 dark:bg-white/10">
          <CardHeader className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl text-red-600">
                Perfil del administrador
              </CardTitle>
              <CardDescription>
                Controla tu información personal y la seguridad del acceso.
              </CardDescription>
            </div>
            <Button variant="destructive" className="rounded-lg">
              Editar perfil
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4 rounded-2xl bg-rose-50/60 p-4 sm:flex-row sm:items-center sm:justify-between dark:bg-white/5">
              <div className="flex items-center gap-4">
                <div className="relative size-16 overflow-hidden rounded-2xl ring-2 ring-red-200/60">
                  <Image
                    src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&auto=format"
                    alt="Foto de perfil del administrador"
                    width={80}
                    height={80}
                    className="size-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">
                    Administrador general
                  </p>
                  <h2 className="text-lg font-semibold text-red-600">
                    Yaritza Chávez
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-300">
                    admin@foodygo.mx
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="rounded-lg border-red-200/60 text-red-600 hover:bg-red-100"
              >
                Cambiar foto
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-[1.4fr,1fr]">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del administrador</Label>
                <Input
                  id="nombre"
                  defaultValue="Yaritza Chávez"
                  className="rounded-lg border-red-200/60 bg-white/80 focus-visible:ring-red-400 dark:border-white/10 dark:bg-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="correo">Correo electrónico</Label>
                <Input
                  id="correo"
                  type="email"
                  defaultValue="admin@foodygo.mx"
                  className="rounded-lg border-red-200/60 bg-white/80 focus-visible:ring-red-400 dark:border-white/10 dark:bg-transparent"
                />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-[1.4fr,1fr]">
              <div className="space-y-2">
                <Label htmlFor="contrasena">Cambiar contraseña</Label>
                <Input
                  id="contrasena"
                  type="password"
                  placeholder="Ingresa una nueva contraseña segura"
                  className="rounded-lg border-red-200/60 bg-white/80 focus-visible:ring-red-400 dark:border-white/10 dark:bg-transparent"
                />
              </div>
              <div className="flex items-end gap-3">
                <Button variant="destructive" className="flex-1 rounded-lg">
                  Actualizar contraseña
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded-lg border-red-200/60 text-red-600 hover:bg-red-100"
                >
                  Cerrar sesión
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200/60 bg-white/90 shadow-lg dark:border-white/10 dark:bg-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-red-600">
              Preferencias del sistema
            </CardTitle>
            <CardDescription>
              Configura cómo se muestra y notifica la información clave.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Idioma</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full rounded-lg border-red-200/60 bg-white/80 focus-visible:ring-red-400 dark:border-white/10 dark:bg-transparent">
                  <SelectValue placeholder="Selecciona un idioma" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-red-200/60 bg-white/95 dark:border-white/10 dark:bg-zinc-900">
                  <SelectItem value="es">Español (MX)</SelectItem>
                  <SelectItem value="en">Inglés (US)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Zona horaria</Label>
              <Select value={timeZone} onValueChange={setTimeZone}>
                <SelectTrigger className="w-full rounded-lg border-red-200/60 bg-white/80 focus-visible:ring-red-400 dark:border-white/10 dark:bg-transparent">
                  <SelectValue placeholder="Selecciona zona horaria" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-red-200/60 bg-white/95 dark:border-white/10 dark:bg-zinc-900">
                  <SelectItem value="america-mexico-city">
                    América/México City (CDMX)
                  </SelectItem>
                  <SelectItem value="america-guadalajara">
                    América/Guadalajara (GDL)
                  </SelectItem>
                  <SelectItem value="america-monterrey">
                    América/Monterrey (MTY)
                  </SelectItem>
                  <SelectItem value="america-los_angeles">
                    América/Los Ángeles (PST)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <PreferenceToggle
              title="Notificaciones en tiempo real"
              description="Recibe alertas sobre pedidos, repartidores y soporte."
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
            <PreferenceToggle
              title="Modo oscuro"
              description="Activa un contraste cálido para trabajar de noche."
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </CardContent>
        </Card>

        <Card className="border-red-200/60 bg-white/90 shadow-lg dark:border-white/10 dark:bg-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-red-600">Seguridad</CardTitle>
            <CardDescription>
              Gestiona accesos y dispositivos conectados a tu cuenta.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PreferenceToggle
              title="Autenticación en dos pasos"
              description="Solicita un código adicional al iniciar sesión."
              checked={twoFactorAuth}
              onCheckedChange={setTwoFactorAuth}
            />
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-100">
                Dispositivos activos
              </p>
              <ul className="space-y-2">
                {INITIAL_DEVICES.map((device) => (
                  <li
                    key={device.id}
                    className="rounded-xl border border-red-100/60 bg-white/70 px-4 py-3 text-sm shadow-sm dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-zinc-700 dark:text-zinc-100">
                          {device.name}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {device.location} · {device.lastActive}
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-600">
                        Activo
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <Button
              variant="outline"
              className="w-full rounded-lg border-red-200/60 text-red-600 hover:bg-red-100"
            >
              Cerrar sesión en todos los dispositivos
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-red-200/60 bg-white/90 shadow-lg dark:border-white/10 dark:bg-white/10">
          <CardHeader className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle className="text-lg text-red-600">Negocios</CardTitle>
              <CardDescription>
                Controla la actividad de los aliados comerciales dentro de la
                plataforma.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="rounded-lg border-red-200/60 text-red-600 hover:bg-red-100"
              >
                Editar negocio
              </Button>
              <Button variant="destructive" className="rounded-lg">
                Agregar negocio
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              {businesses.map((business) => (
                <div
                  key={business.id}
                  className="flex flex-col gap-3 rounded-2xl border border-red-100/60 bg-white/70 p-4 shadow-sm md:flex-row md:items-center md:justify-between dark:border-white/10 dark:bg-white/5"
                >
                  <div>
                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-100">
                      {business.name}
                    </p>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                      {business.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {business.active ? "Activo" : "Inactivo"}
                    </span>
                    <ToggleSwitch
                      checked={business.active}
                      onCheckedChange={() => handleToggleBusiness(business.id)}
                      ariaLabel={`Cambiar estado de ${business.name}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-red-200/60 bg-white/90 shadow-lg dark:border-white/10 dark:bg-white/10">
          <CardHeader className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg text-red-600">
                Pagos y comisiones
              </CardTitle>
              <CardDescription>
                Ajusta los porcentajes y métodos de pago disponibles para la
                operación.
              </CardDescription>
            </div>
            <Button variant="destructive" className="rounded-lg">
              Guardar configuración
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="comision-repartidores">
                  Comisión para repartidores (%)
                </Label>
                <Input
                  id="comision-repartidores"
                  type="number"
                  defaultValue={20}
                  min={0}
                  max={100}
                  step={0.5}
                  className="rounded-lg border-red-200/60 bg-white/80 focus-visible:ring-red-400 dark:border-white/10 dark:bg-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comision-negocios">
                  Comisión para negocios (%)
                </Label>
                <Input
                  id="comision-negocios"
                  type="number"
                  defaultValue={12}
                  min={0}
                  max={100}
                  step={0.5}
                  className="rounded-lg border-red-200/60 bg-white/80 focus-visible:ring-red-400 dark:border-white/10 dark:bg-transparent"
                />
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-100">
                Métodos de pago activos
              </p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {PAYMENT_METHODS.map((method) => (
                  <li
                    key={method}
                    className="rounded-xl border border-red-100/60 bg-white/70 px-4 py-3 text-sm shadow-sm dark:border-white/10 dark:bg-white/5"
                  >
                    {method}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-red-200/60 bg-white/90 shadow-lg dark:border-white/10 dark:bg-white/10">
          <CardHeader className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg text-red-600">
                Soporte y ayuda
              </CardTitle>
              <CardDescription>
                Conecta con el equipo de soporte o envía retroalimentación
                rápida.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              className="rounded-lg border-red-200/60 text-red-600 hover:bg-red-100"
            >
              Contactar soporte
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <Link
              href="#"
              className="inline-flex items-center gap-2 text-sm font-medium text-red-600 underline decoration-red-400/60 decoration-dashed underline-offset-4 hover:text-red-500"
            >
              Centro de ayuda →
            </Link>
            <form className="grid gap-4 rounded-2xl border border-red-100/60 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
              <div className="space-y-2">
                <Label htmlFor="tipo-solicitud">Tipo de solicitud</Label>
                <Select defaultValue="sugerencia">
                  <SelectTrigger className="w-full rounded-lg border-red-200/60 bg-white/80 focus-visible:ring-red-400 dark:border-white/10 dark:bg-transparent">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-red-200/60 bg-white/95 dark:border-white/10 dark:bg-zinc-900">
                    <SelectItem value="sugerencia">Sugerencia</SelectItem>
                    <SelectItem value="problema">
                      Reporte de incidente
                    </SelectItem>
                    <SelectItem value="facturacion">
                      Duda sobre facturación
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mensaje">Mensaje</Label>
                <textarea
                  id="mensaje"
                  rows={4}
                  placeholder="Cuéntanos brevemente qué necesitas…"
                  className="rounded-lg border border-red-200/60 bg-white/80 px-3 py-2 text-sm text-zinc-700 shadow-xs outline-none transition focus:border-red-300 focus:ring-2 focus:ring-red-200 dark:border-white/10 dark:bg-transparent dark:text-zinc-100"
                />
              </div>
              <Button variant="destructive" className="rounded-lg">
                Enviar solicitud
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type PreferenceToggleProps = {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
};

function PreferenceToggle({
  title,
  description,
  checked,
  onCheckedChange,
}: PreferenceToggleProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-red-100/60 bg-white/70 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-white/5">
      <div>
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-100">
          {title}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </div>
      <ToggleSwitch
        checked={checked}
        onCheckedChange={onCheckedChange}
        ariaLabel={title}
      />
    </div>
  );
}

type ToggleSwitchProps = {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  ariaLabel: string;
};

function ToggleSwitch({
  checked,
  onCheckedChange,
  ariaLabel,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-red-500 shadow-inner shadow-red-300" : "bg-zinc-300"
      }`}
    >
      <span
        className={`absolute left-1 inline-block size-5 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

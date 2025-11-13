"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CirclePower,
  LogOut,
  MapPin,
  MessageCircle,
  PackageSearch,
  PauseCircle,
} from "lucide-react";

interface DeliveryHeaderProps {
  driverName?: string;
  serviceArea?: string;
  pendingOrders?: number;
  lastSync?: string;
  onLogout?: () => void;
  onReportIncident?: (payload: { type: string; notes: string }) => void;
  onChatMessage?: (message: string) => void;
}

export function DeliveryHeader({
  driverName = "Repartidor",
  serviceArea = "Zona Norte",
  pendingOrders = 0,
  lastSync = "Hace 2 min",
  onLogout,
  onReportIncident,
  onChatMessage,
}: DeliveryHeaderProps) {
  const [isActive, setIsActive] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const [reportType, setReportType] = useState("clima");
  const [reportNotes, setReportNotes] = useState("");
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const availabilityLabel = useMemo(
    () => (isActive ? "Activo" : "Inactivo"),
    [isActive],
  );

  const handlePauseToggle = () => {
    setIsPaused((prev) => !prev);
    setActionMessage(
      !isPaused
        ? "Pausaste las entregas por 10 minutos. Recuerda reanudar cuando estés listo."
        : "Has reanudado tus entregas."
    );
  };

  const handleReportSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reportNotes.trim()) {
      setActionMessage("Describe brevemente la incidencia.");
      return;
    }
    onReportIncident?.({ type: reportType, notes: reportNotes.trim() });
    setActionMessage(
      `Incidencia enviada: ${reportType}. Soporte fue notificado.`,
    );
    setReportNotes("");
    setReportOpen(false);
  };

  const handleChatSend = () => {
    if (!chatMessage.trim()) {
      setActionMessage("Escribe un mensaje para soporte.");
      return;
    }
    onChatMessage?.(chatMessage.trim());
    setActionMessage("Mensaje enviado a soporte. Te responderán pronto.");
    setChatMessage("");
    setChatOpen(false);
  };

  return (
    <header className="relative overflow-hidden rounded-[28px] border border-white/20 bg-white/10 p-6 shadow-2xl shadow-emerald-900/10 backdrop-blur-lg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(74,222,128,0.45)_0%,rgba(20,40,32,0.6)_55%,rgba(15,28,23,0.85)_100%)]" />
      <div className="relative space-y-4 text-white">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.35em] text-emerald-100/70">
          <span>Página repartidores</span>
        </div>
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Hola, {driverName}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-emerald-50/80">
            Revisa tus entregas asignadas, confirma ubicaciones y mantén tu
            estado de servicio al día durante el turno.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-emerald-50/90">
          <Badge
            variant="secondary"
            className="flex items-center gap-2 rounded-full border border-emerald-300/60 bg-emerald-500/30 text-emerald-50 backdrop-blur"
          >
            <PackageSearch className="h-3.5 w-3.5" />
            {pendingOrders} pedidos
          </Badge>
          <Badge
            variant="secondary"
            className="flex items-center gap-2 rounded-full border border-emerald-200/60 bg-white/10 text-emerald-50 backdrop-blur"
          >
            <MapPin className="h-3.5 w-3.5" />
            Zona: {serviceArea}
          </Badge>
          <Badge
            variant="outline"
            className="rounded-full border border-white/30 bg-white/10 text-xs uppercase tracking-[0.3em] text-emerald-50/80 backdrop-blur"
          >
            Última sync {lastSync}
          </Badge>
        </div>
      </div>

      <div className="relative mt-6 flex flex-col gap-3 text-sm text-white">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsActive((prev) => !prev)}
          className={cn(
            "flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold shadow-lg transition backdrop-blur",
            isActive
              ? "border-emerald-400 bg-emerald-500/80 text-white hover:bg-emerald-500"
              : "border-rose-400 bg-transparent text-rose-100 hover:bg-rose-500/20",
          )}
        >
          <CirclePower className="h-4 w-4" />
          {availabilityLabel}
        </Button>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Button
            type="button"
            className={cn(
              "flex items-center justify-center gap-2 rounded-full border border-amber-300/70 px-4 py-2 text-sm font-semibold text-white shadow-lg transition",
              isPaused
                ? "bg-amber-500/90 hover:bg-amber-500"
                : "bg-amber-400/80 hover:bg-amber-400",
            )}
            onClick={handlePauseToggle}
          >
            <PauseCircle className="h-4 w-4" />
            {isPaused ? "Reanudar" : "Pausar entregas"}
          </Button>
          <Button
            type="button"
            className="flex items-center justify-center gap-2 rounded-full border border-emerald-300/60 bg-emerald-500/80 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-500"
            onClick={() => {
              setChatOpen((prev) => !prev);
              setReportOpen(false);
            }}
          >
            <MessageCircle className="h-4 w-4" />
            Chat con soporte
          </Button>
          <Button
            type="button"
            className="flex items-center justify-center gap-2 rounded-full border border-rose-300/70 bg-rose-500/80 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-rose-500"
            onClick={() => {
              setReportOpen((prev) => !prev);
              setChatOpen(false);
            }}
          >
            <AlertTriangle className="h-4 w-4" />
            Reportar incidencia
          </Button>
        </div>
        <Button
          variant="destructive"
          className="flex items-center gap-2 rounded-full border border-rose-400 bg-rose-500/80 px-5 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur hover:bg-rose-500"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>

      {actionMessage ? (
        <p className="mt-4 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-xs text-white/90">
          {actionMessage}
        </p>
      ) : null}

      {chatOpen ? (
        <div className="mt-4 rounded-2xl border border-emerald-200/60 bg-white/80 p-4 text-sm text-emerald-900 shadow-inner">
          <p className="font-semibold">Chat con soporte</p>
          <p className="text-xs text-emerald-800/70">
            Soporte Foody Go responde en menos de 3 minutos.
          </p>
          <div className="mt-3 space-y-2 rounded-xl border border-emerald-100 bg-white p-3 text-xs text-emerald-900">
            <p className="font-semibold">Equipo Foody Go</p>
            <p>Hola {driverName}, ¿todo bien en tu ruta?</p>
          </div>
          <textarea
            className="mt-3 w-full rounded-xl border border-emerald-200 bg-white p-2 text-sm text-emerald-900 outline-none focus:border-emerald-400"
            rows={2}
            placeholder="Escribe un mensaje rápido..."
            value={chatMessage}
            onChange={(event) => setChatMessage(event.target.value)}
          />
          <Button
            type="button"
            className="mt-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
            onClick={handleChatSend}
          >
            Enviar
          </Button>
        </div>
      ) : null}

      {reportOpen ? (
        <form
          onSubmit={handleReportSubmit}
          className="mt-4 space-y-3 rounded-2xl border border-rose-200/60 bg-white/80 p-4 text-sm text-rose-900 shadow-inner"
        >
          <p className="font-semibold">Reportar incidencia</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="text-xs font-semibold text-rose-800">
              Motivo
              <select
                value={reportType}
                onChange={(event) => setReportType(event.target.value)}
                className="mt-1 w-full rounded-xl border border-rose-200 bg-white p-2 text-sm text-rose-900 focus:border-rose-400"
              >
                <option value="clima">Clima</option>
                <option value="trafico">Tráfico</option>
                <option value="cliente">Cliente</option>
                <option value="vehiculo">Vehículo</option>
                <option value="restaurante">Restaurante / Sucursal</option>
                <option value="cliente-no-quiso">Cliente no recibió</option>
                <option value="otro">Otro</option>
              </select>
            </label>
          </div>
          <label className="text-xs font-semibold text-rose-800">
            Detalles
            <textarea
              value={reportNotes}
              onChange={(event) => setReportNotes(event.target.value)}
              rows={3}
              className="mt-1 w-full rounded-xl border border-rose-200 bg-white p-2 text-sm text-rose-900 focus:border-rose-400"
              placeholder="Describe brevemente la incidencia"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              className="rounded-full bg-rose-600 text-white hover:bg-rose-700"
            >
              Enviar reporte
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="rounded-full text-rose-600 hover:bg-rose-100"
              onClick={() => setReportOpen(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      ) : null}
    </header>
  );
}

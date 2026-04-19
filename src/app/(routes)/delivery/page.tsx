"use client";

import { CurrentDeliveriesCard } from "@/components/delivery/current-deliveries-card";
import { EarningsCard } from "@/components/delivery/earnings-card";
import { DeliveryHeader } from "@/components/delivery/header";
import { LocationCard } from "@/components/delivery/location-card";
import { NotificationsCard } from "@/components/delivery/notifications-card";
import { ScheduleCard } from "@/components/delivery/schedule-card";
import type {
  DeliveryEarnings,
  DeliveryNotification,
  DeliveryOrder,
  DeliverySchedule,
} from "@/components/delivery/types";
import { useAuth } from "@/context/AuthContext";

const currentOrders: DeliveryOrder[] = [
  {
    id: "FG-1024",
    status: "En camino",
    eta: "12:20",
    paymentMethod: "Efectivo",
    amount: 245.75,
    address: {
      street: "Calle Hidalgo 24, Zona Centro",
      neighborhood: "Centro",
      city: "Mazamitla, JAL 49500",
      references:
        "Casa con portón negro frente a la plaza; timbre rojo a la derecha. Dejar en recepción si no contestan.",
    },
    contact: {
      name: "Mariana López",
      phone: "331 234 5678",
    },
    notes: "Cliente prefiere entrega sin contacto.",
  },
  {
    id: "FG-1025",
    status: "Listo para recoger",
    eta: "12:45",
    paymentMethod: "Tarjeta",
    amount: 156.5,
    address: {
      street: "Av. La Abuela 890, Interior 5",
      neighborhood: "Zona Centro",
      city: "Mazamitla, JAL",
      references: "Restaurante La Abuela, puerta lateral para repartidores.",
    },
    contact: {
      name: "Óscar Morales",
      phone: "331 789 4560",
    },
  },
  {
    id: "FG-1026",
    status: "Pendiente",
    eta: "13:05",
    paymentMethod: "Transferencia",
    amount: 189.9,
    address: {
      street: "Av. Juárez 184, Oficina 4B",
      neighborhood: "Centro",
      city: "Mazamitla, JAL",
      references:
        "Edificio blanco, subir al segundo piso y preguntar por recepción.",
    },
    contact: {
      name: "Carla Ruiz",
      phone: "331 650 1020",
    },
  },
];

const nextSchedule: DeliverySchedule = {
  shiftLabel: "Turno matutino",
  shiftWindow: "09:00 - 17:00",
  startTime: "08:00 a.m.",
  endTime: "06:00 p.m.",
  hoursWorked: "5h 20m",
  breakWindow: "Descanso sugerido: 13:30 - 14:00",
  nextCheckIn: "12:45 en Hub Mazamitla",
  coverageZone: "Mazamitla Centro y colonias cercanas",
};

const earningsSummary: DeliveryEarnings = {
  currency: "MXN",
  today: 850,
  weekToDate: 3745,
  tips: 315,
  goal: 4500,
};

const recentNotifications: DeliveryNotification[] = [
  {
    id: "n-1",
    title: "Nueva orden asignada #FG-1024",
    message: "Hace 2 min · Restaurante La Abuela → Calle Hidalgo 24.",
    timestamp: "Hace 2 min",
    unread: true,
  },
  {
    id: "n-2",
    title: "Cambio de ruta sugerido",
    message: "Evita Av. Juárez por tráfico. Usa Calle Reforma.",
    timestamp: "Hace 10 min",
  },
  {
    id: "n-3",
    title: "Propina recibida",
    message: "Cliente Mariana López agregó una propina de $25.00 MXN.",
    timestamp: "Hace 35 min",
  },
];

export default function DeliveryDashboardPage() {
  const { user, logout } = useAuth();
  const notifications = recentNotifications;
  const highlightedOrder = currentOrders[0];
  const driverName = user?.name ?? "Repartidor Gogi";

  return (
    <main className="min-h-screen bg-[#f4f6f3] text-[#17231d]">
      <div className="min-h-screen bg-[linear-gradient(180deg,#e9f3ed_0%,#f8faf7_38%,#f4f6f3_100%)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <DeliveryHeader
            driverName={driverName}
            serviceArea="Zona Centro"
            pendingOrders={currentOrders.length}
            lastSync="Hace 3 min"
            onLogout={logout}
          />

          <div className="grid gap-6 xl:grid-cols-[1.65fr,1fr]">
            <CurrentDeliveriesCard orders={currentOrders} />

            <div className="space-y-6">
              {highlightedOrder ? (
                <LocationCard order={highlightedOrder} />
              ) : (
                <div className="rounded-[26px] border border-dashed border-white/30 bg-white/10 p-6 text-sm text-white/80 shadow-inner backdrop-blur">
                  No hay entregas para mostrar ubicación.
                </div>
              )}
              <ScheduleCard schedule={nextSchedule} />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.95fr,1.05fr]">
            <EarningsCard earnings={earningsSummary} />
            <NotificationsCard notifications={notifications} />
          </div>
        </div>
      </div>
    </main>
  );
}

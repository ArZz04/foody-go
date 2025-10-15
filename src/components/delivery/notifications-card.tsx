import { Bell, CheckCircle2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { DeliveryNotification } from "./types";

interface NotificationsCardProps {
  notifications: DeliveryNotification[];
}

export function NotificationsCard({
  notifications,
}: NotificationsCardProps) {
  return (
    <Card className="overflow-hidden rounded-[26px] border border-white/20 bg-white/10 text-[#1f2d27] shadow-xl backdrop-blur-lg">
      <CardHeader className="border-b border-white/10 bg-gradient-to-r from-emerald-400/30 via-emerald-600/25 to-emerald-900/25 pb-6 text-white">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Bell className="h-5 w-5" />
          Notificaciones
        </CardTitle>
        <CardDescription className="text-sm text-white/80">
          Actualizaciones importantes de tus pedidos y recordatorios del turno.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-emerald-300/60 bg-emerald-50/60 p-6 text-center text-sm text-emerald-800/80 shadow-inner">
            <CheckCircle2 className="h-5 w-5" />
            Sin notificaciones pendientes.
          </div>
        ) : (
          <ul className="space-y-3">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className="flex items-start gap-3 rounded-2xl border border-white/40 bg-white/70 p-4 shadow-lg backdrop-blur"
              >
                <span
                  className={`mt-1 h-2 w-2 rounded-full ${
                    notification.unread ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                />
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-emerald-900">
                      {notification.title}
                    </p>
                    {notification.unread ? (
                      <Badge
                        variant="outline"
                        className="border-emerald-200/70 bg-emerald-50/60 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700"
                      >
                        Nuevo
                      </Badge>
                    ) : null}
                  </div>
                  <p className="text-xs text-emerald-800/70">
                    {notification.message}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-900/50">
                    {notification.timestamp}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

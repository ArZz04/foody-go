import { PiggyBank, TrendingUp, Wallet } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import type { DeliveryEarnings } from "./types";

interface EarningsCardProps {
  earnings: DeliveryEarnings;
}

const formatterCache = new Map<string, Intl.NumberFormat>();

function formatCurrency(amount: number, currency: string) {
  if (!formatterCache.has(currency)) {
    formatterCache.set(
      currency,
      new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }),
    );
  }

  const formatter = formatterCache.get(currency)!;
  return formatter.format(amount);
}

export function EarningsCard({ earnings }: EarningsCardProps) {
  const progress = Math.min(
    100,
    Math.round((earnings.weekToDate / earnings.goal) * 100),
  );

  return (
    <Card className="overflow-hidden rounded-[26px] border border-white/20 bg-white/10 text-[#1f2d27] shadow-xl backdrop-blur-lg">
      <CardHeader className="border-b border-white/10 bg-gradient-to-r from-emerald-400/30 via-emerald-600/25 to-emerald-900/25 pb-6 text-white">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Wallet className="h-5 w-5" />
          Ganancias
        </CardTitle>
        <CardDescription className="text-sm text-white/80">
          Seguimiento rápido de tus ingresos diarios, propinas y avance semanal.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200/60 bg-white/70 p-4 shadow-inner">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-900/60">
              Hoy
            </p>
            <p className="mt-2 flex items-baseline gap-2 text-3xl font-semibold text-emerald-700">
              {formatCurrency(earnings.today, earnings.currency)}
            </p>
            <p className="mt-1 flex items-center gap-2 text-xs text-emerald-700">
              <TrendingUp className="h-3 w-3" />
              +12% vs ayer
            </p>
          </div>

          <div className="rounded-2xl border border-white/30 bg-white/70 p-4 shadow-lg backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-900/60">
              Propinas
            </p>
            <p className="mt-2 flex items-baseline gap-2 text-2xl font-semibold text-emerald-900">
              {formatCurrency(earnings.tips, earnings.currency)}
            </p>
            <p className="mt-1 flex items-center gap-2 text-xs text-emerald-800/70">
              <PiggyBank className="h-3 w-3 text-amber-500" />
              Acumulado semana
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-800/70">
            <span>Semana actual</span>
            <span>
              {formatCurrency(earnings.weekToDate, earnings.currency)} /{" "}
              {formatCurrency(earnings.goal, earnings.currency)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full border border-white/30 bg-white/40 shadow-inner">
            <div
              className="h-full rounded-full bg-emerald-500/90 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-emerald-800/70">
            Objetivo semanal alcanzado al {progress}%.
          </p>
        </div>

        <Button
          type="button"
          className="w-full rounded-full border border-emerald-500/60 bg-emerald-500/80 text-sm font-semibold text-white shadow-lg backdrop-blur hover:bg-emerald-500"
        >
          Ver historial
        </Button>
      </CardContent>
    </Card>
  );
}

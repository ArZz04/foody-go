import Link from "next/link";

import EditUsersList from "./components/EditUsersList";

const USERS = [
  { id: 1, name: "Yaritza Chávez", role: "Administrador", email: "yaritza@empresa.com", image: "/avatars/1.png" },
  { id: 2, name: "Ramiro Chávez", role: "Vendedor", email: "ramiro@empresa.com", image: "/avatars/2.png" },
  { id: 3, name: "Daniela Pérez", role: "Repartidor", email: "daniela@empresa.com", image: "/avatars/3.png" },
  { id: 4, name: "Carlos Torres", role: "Administrador", email: "carlos@empresa.com", image: "/avatars/4.png" },
  { id: 5, name: "Andrea López", role: "Vendedor", email: "andrea@empresa.com", image: "/avatars/5.png" },
  { id: 6, name: "Luis Martínez", role: "Repartidor", email: "luis@empresa.com", image: "/avatars/6.png" },
  { id: 7, name: "María Núñez", role: "Vendedor", email: "maria@empresa.com", image: "/avatars/7.png" },
  { id: 8, name: "David Gómez", role: "Administrador", email: "david@empresa.com", image: "/avatars/8.png" },
];

const BAR_DATA = [2, 5, 7, 6, 8, 9, 11, 13, 10, 12, 9, 8];
const RECENT_BUSINESSES = [
  { id: 1, nombre: "Cafetería Central", ciudad: "Guadalajara", giro: "Cafetería", status: "Verificado" },
  { id: 2, nombre: "Tacos El Güero", ciudad: "Zapopan", giro: "Taquería", status: "Activo" },
  { id: 3, nombre: "Panadería Delicias", ciudad: "Tlaquepaque", giro: "Panadería", status: "Verificado" },
  { id: 4, nombre: "Helados Frosti", ciudad: "Tonalá", giro: "Heladería", status: "Verificado" },
];
const ACTIVITY = [
  { title: "Nuevo pedido #1234 por $250.00", time: "Hace 10 minutos" },
  { title: "Usuario Ramiro Chávez se registró", time: "Hace 30 minutos" },
  { title: "Negocio 'Tacos El Güero' verificado", time: "Hace 1 hora" },
  { title: "Pedido #1233 entregado por Daniela Pérez", time: "Hace 2 horas" },
];

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-6 sm:px-6 md:py-10">
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-rose-500 via-red-500 to-red-600 p-6 text-white shadow-[0px_32px_80px_-32px_rgba(244,63,94,0.7)] ring-1 ring-white/20 sm:p-9">
        <div className="absolute -right-16 -top-20 size-48 rounded-full bg-white/25 blur-3xl" />
        <div className="absolute -bottom-16 left-[-48px] size-60 rounded-full bg-red-300/35 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.28),transparent_65%)]" />
        <div className="relative z-10 space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
            Panel Admin
          </span>
          <h2 className="text-3xl font-bold md:text-4xl">¡Hola, Admin!</h2>
          <p className="max-w-2xl text-white/85">
            Este es tu panel de control. Revisa el rendimiento, acciones rápidas y actividad reciente.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <DashButton>+ Crear negocio</DashButton>
            <DashButton variant="secondary">Invitar usuario</DashButton>
            <DashButton variant="ghost" href="/admin/usuarios">
              Ver usuarios
            </DashButton>
          </div>
        </div>
      </div>

      <section aria-label="Indicadores clave">
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          <KPI label="Ingresos (30d)" value="$128,450" delta="+12.4%" />
          <KPI label="Pedidos hoy" value="572" delta="+4.1%" />
          <KPI label="Negocios activos" value="24" delta="+2" />
          <KPI label="Tasa de éxito" value="97.3%" delta="+0.6%" />
        </div>
      </section>

      <section aria-label="Resúmenes" className="grid gap-6 md:grid-cols-[1.6fr_1fr]">
        <Card title="Rendimiento diario">
          <div className="grid gap-6 lg:grid-cols-[1fr,300px]">
            <div className="space-y-4">
              <div className="rounded-[22px] border border-white/70 bg-white/95 p-4 shadow-md ring-1 ring-white/60 dark:border-white/10 dark:bg-white/10 dark:ring-white/10">
                <p className="text-sm font-medium text-red-600">Tráfico en vivo</p>
                <p className="mt-1 text-3xl font-bold">+32%</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  vs promedio de la última semana
                </p>
              </div>
              <div className="rounded-[22px] border border-white/70 bg-white/95 p-4 shadow-md ring-1 ring-white/60 dark:border-white/10 dark:bg-white/10 dark:ring-white/10">
                <p className="text-sm font-medium text-emerald-600">Tiempo promedio de entrega</p>
                <p className="mt-1 text-3xl font-bold">28 min</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Meta: 30 min
                </p>
              </div>
            </div>
            <div className="space-y-4 rounded-[22px] border border-white/70 bg-white/95 p-4 shadow-md ring-1 ring-white/60 dark:border-white/10 dark:bg-white/10 dark:ring-white/10">
              <p className="text-sm font-medium text-red-600">Pedidos por hora</p>
              <div className="grid grid-cols-12 gap-1">
                {BAR_DATA.map((value, index) => (
                  <div key={index} className="space-y-1 text-center">
                    <div
                      className="mx-auto w-3 rounded-full bg-gradient-to-t from-red-400 to-rose-300"
                      style={{ height: `${value * 8}px` }}
                    />
                    <span className="text-[10px] text-zinc-400">{index}h</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4 md:space-y-6">
          <Card title="Equipo activo">
            <ul className="space-y-3 text-sm">
              {USERS.slice(0, 4).map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between rounded-[18px] border border-white/70 bg-white/95 p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs opacity-70">{user.role}</p>
                  </div>
                  <button className="rounded-lg bg-gradient-to-r from-rose-500/15 to-red-500/20 px-3 py-1 text-xs font-semibold text-red-600 transition hover:from-rose-500/30 hover:to-red-500/30 dark:text-red-200">
                    Contactar
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Negocios recientes">
            <div className="overflow-hidden rounded-[22px] border border-white/70 bg-white/95 shadow-md dark:border-white/10 dark:bg-white/5">
              <table className="min-w-full divide-y divide-white/70 text-sm dark:divide-white/10">
                <thead className="bg-gradient-to-r from-rose-50/90 to-red-50/50 text-left text-[11px] font-semibold uppercase tracking-[0.3em] text-red-500 dark:from-white/5 dark:to-white/5 dark:text-red-200">
                  <tr>
                    <th className="px-4 py-2">Negocio</th>
                    <th className="px-4 py-2">Ciudad</th>
                    <th className="px-4 py-2">Giro</th>
                    <th className="px-4 py-2">Estado</th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/70 bg-white/95 text-zinc-700 dark:divide-white/10 dark:bg-white/5 dark:text-zinc-200">
                  {RECENT_BUSINESSES.map((business) => (
                    <tr key={business.id}>
                      <td className="px-4 py-2 font-medium">{business.nombre}</td>
                      <td className="px-4 py-2 text-sm">{business.ciudad}</td>
                      <td className="px-4 py-2 text-sm">{business.giro}</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                          {business.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button className="text-red-600 hover:underline">Ver</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <Card title="Actividad reciente">
          <ul className="space-y-3 text-sm">
            {ACTIVITY.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-3 rounded-[18px] border border-white/70 bg-white/95 p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                <span className="mt-1 inline-flex size-3 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-red-500 text-[10px] text-white">
                  ●
                </span>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs opacity-70">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-4">
          <Card title="Acciones rápidas">
            <div className="grid grid-cols-2 gap-2">
              <QuickAction>Generar reporte</QuickAction>
              <QuickAction>Nuevo cupón</QuickAction>
              <QuickAction>Revisión KYC</QuickAction>
              <QuickAction>Configurar tarifas</QuickAction>
            </div>
          </Card>

          <Card title="Salud del sistema">
            <div className="flex items-center gap-4">
              <div className="relative size-16">
                <div className="absolute inset-0 rounded-full border-8 border-emerald-500/80" />
                <div className="absolute inset-1 rounded-full bg-emerald-100/40 dark:bg-emerald-500/10" />
              </div>
              <div className="text-sm">
                <p className="font-medium">99.96% uptime</p>
                <p className="opacity-70">Todo funcionando correctamente</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section id="usuarios" className="pt-6 md:pt-8">
        <h2 className="mb-3 text-lg font-semibold md:text-xl">Gestión de usuarios</h2>
        <EditUsersList />
      </section>
    </div>
  );
}

function DashButton({
  children,
  href,
  variant = "primary",
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const base =
    "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-1";
  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg shadow-red-500/25 hover:shadow-xl"
      : variant === "secondary"
        ? "bg-white/95 text-red-600 shadow-sm ring-1 ring-red-200/60 hover:-translate-y-0.5 hover:shadow-md"
        : "bg-white/10 text-white backdrop-blur ring-1 ring-white/30 hover:-translate-y-0.5 hover:bg-white/20";
  const Comp = href ? Link : "button";
  // @ts-ignore
  return <Comp href={href} className={`${base} ${styles}`}>{children}</Comp>;
}

function KPI({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-rose-100/80 via-red-200/70 to-red-300/40 p-[1px] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
      <div className="relative h-full rounded-[20px] bg-white/95 p-4 shadow-lg ring-1 ring-white/70 backdrop-blur-sm dark:bg-zinc-900/80 dark:ring-white/10">
        <div className="pointer-events-none absolute -top-10 right-0 h-16 w-16 rounded-full bg-rose-200/60 blur-3xl" />
        <p className="text-xs uppercase tracking-[0.3em] text-red-400">{label}</p>
        <div className="mt-2 text-3xl font-semibold text-zinc-800 dark:text-white md:text-[2.25rem]">
          {value}
        </div>
        {delta ? (
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
            <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-300" />
            {delta}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-[26px] bg-white/95 p-6 shadow-xl ring-1 ring-white/70 backdrop-blur-sm dark:bg-zinc-900/80 dark:ring-white/10">
      <div className="pointer-events-none absolute inset-x-6 top-0 h-24 rounded-full bg-gradient-to-br from-red-100/40 via-transparent to-transparent blur-3xl" />
      <div className="relative z-10">
        <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-100">{title}</h3>
        <div className="mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-rose-400/70 to-red-400/70" />
      </div>
      <div className="relative z-10 mt-5">{children}</div>
    </div>
  );
}

function QuickAction({ children }: { children: React.ReactNode }) {
  return (
    <button className="group rounded-xl border border-white/70 bg-white/95 px-3 py-2 text-sm font-semibold text-zinc-600 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:text-red-600 hover:shadow-md dark:border-white/10 dark:bg-white/10 dark:text-zinc-200 dark:hover:text-red-200">
      <span className="transition group-hover:opacity-100 group-hover:brightness-110">
        {children}
      </span>
    </button>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ChatEntityType } from "@/types/chat";

type ThreadType = ChatEntityType;

type ChatMessage = {
  id: string;
  author: "admin" | "contact";
  content: string;
  timestamp: string;
};

type ChatThread = {
  id: string;
  name: string;
  type: ThreadType;
  reference: string;
  priority?: "normal" | "alerta";
  unread?: boolean;
  messages: ChatMessage[];
};

const INITIAL_THREADS: ChatThread[] = [
  {
    id: "t-user-01",
    name: "Ana Martínez",
    type: "usuario",
    reference: "Reporte: retraso en Mazamitla",
    priority: "alerta",
    unread: true,
    messages: [
      {
        id: "m1",
        author: "contact",
        content: "Hola admin, mi pedido FG-1042 no ha llegado y la app marca entregado.",
        timestamp: "Hace 3 min",
      },
      {
        id: "m2",
        author: "admin",
        content: "Hola Ana, ya escalé al repartidor para confirmar. Te escribo en breve.",
        timestamp: "Hace 1 min",
      },
    ],
  },
  {
    id: "t-store-01",
    name: "Café El Roble",
    type: "negocio",
    reference: "Inventario agotado",
    messages: [
      {
        id: "m1",
        author: "contact",
        content: "Necesitamos pausar 3 bebidas porque se acabó la leche de almendra.",
        timestamp: "Hace 12 min",
      },
    ],
  },
  {
    id: "t-rider-01",
    name: "Daniela Pérez",
    type: "repartidor",
    reference: "Cliente no recibió",
    messages: [
      {
        id: "m1",
        author: "contact",
        content: "Cliente en Col. Centro rechazó el pedido, dice que ya ordenó en sucursal.",
        timestamp: "Hace 20 min",
      },
    ],
  },
];

const FILTERS: { key: "todos" | ThreadType; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "usuario", label: "Usuarios" },
  { key: "negocio", label: "Tiendas" },
  { key: "repartidor", label: "Delivery" },
];

interface AdminChatPanelProps {
  focusToken?: number;
}

export function AdminChatPanel({ focusToken }: AdminChatPanelProps) {
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [activeId, setActiveId] = useState(threads[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState<"todos" | ThreadType>("todos");
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    if (!focusToken) return;
    setHighlight(true);
    const timeout = setTimeout(() => setHighlight(false), 1200);
    return () => clearTimeout(timeout);
  }, [focusToken]);


  const filteredThreads = useMemo(() => {
    if (filter === "todos") return threads;
    return threads.filter((thread) => thread.type === filter);
  }, [threads, filter]);

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeId) ?? threads[0],
    [threads, activeId],
  );

  const handleSend = () => {
    if (!message.trim() || !activeThread) return;
    const newMessage: ChatMessage = {
      id: `admin-${Date.now()}`,
      author: "admin",
      content: message.trim(),
      timestamp: "Ahora",
    };
    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === activeThread.id
          ? {
              ...thread,
              unread: false,
              messages: [...thread.messages, newMessage],
            }
          : thread,
      ),
    );
    setMessage("");
  };

  const handleMarkResolved = (id: string) => {
    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === id ? { ...thread, priority: "normal", unread: false } : thread,
      ),
    );
  };

  return (
    <section
      className={cn(
        "space-y-4 rounded-[26px] border border-white/40 bg-white/90 p-4 shadow-xl ring-1 ring-white/70 transition dark:border-white/10 dark:bg-white/10 dark:ring-white/10",
        highlight ? "ring-rose-300" : "",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-400">
            Comunicaciones
          </p>
          <h3 className="text-xl font-semibold text-zinc-800">
            Chat con usuarios, tiendas y repartidores
          </h3>
        </div>
        <Badge className="rounded-full bg-rose-500/10 text-rose-600">
          Alertas activas: {threads.filter((t) => t.priority === "alerta").length}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2 text-sm text-zinc-600">
        {FILTERS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setFilter(item.key)}
            className={cn(
              "rounded-full border px-3 py-1 transition",
              filter === item.key
                ? "border-rose-400 bg-rose-500/10 text-rose-600"
                : "border-zinc-200 bg-white",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <div className="space-y-3">
          {filteredThreads.map((thread) => (
            <button
              key={thread.id}
              type="button"
              onClick={() => setActiveId(thread.id)}
              className={cn(
                "w-full rounded-2xl border px-3 py-3 text-left shadow-sm transition",
                thread.id === activeThread?.id
                  ? "border-rose-400 bg-rose-50"
                  : "border-zinc-200 bg-white",
              )}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-[0.2em] text-zinc-400">
                  {thread.type}
                </span>
                {thread.unread ? (
                  <Badge className="rounded-full bg-emerald-500/15 text-emerald-700">
                    Nuevo
                  </Badge>
                ) : null}
              </div>
              <p className="mt-1 text-sm font-semibold text-zinc-800">
                {thread.name}
              </p>
              <p className="text-xs text-zinc-500">{thread.reference}</p>
              {thread.priority === "alerta" ? (
                <p className="mt-1 text-xs font-semibold text-rose-600">⚠ Reporte urgente</p>
              ) : null}
            </button>
          ))}
        </div>

        {activeThread ? (
          <div className="flex h-full flex-col rounded-[22px] border border-zinc-200 bg-white p-4 shadow-inner">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  {activeThread.name}
                </p>
                <p className="text-xs text-zinc-500">{activeThread.reference}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleMarkResolved(activeThread.id)}
                className="rounded-full border-rose-200 text-rose-500"
              >
                Marcar resuelto
              </Button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto py-4 text-sm">
              {activeThread.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow",
                    msg.author === "admin"
                      ? "ml-auto bg-rose-500/15 text-rose-700"
                      : "bg-zinc-100 text-zinc-700",
                  )}
                >
                  <p>{msg.content}</p>
                  <span className="mt-1 block text-[10px] uppercase tracking-[0.3em] text-zinc-400">
                    {msg.author === "admin" ? "Tú" : msg.timestamp}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-zinc-200 bg-white p-3 text-sm text-zinc-800 outline-none focus:border-rose-400"
                placeholder="Escribe una actualización para este contacto..."
              />
              <div className="flex flex-wrap justify-between gap-2">
                <Button
                  type="button"
                  onClick={handleSend}
                  className="rounded-full bg-rose-600 text-white hover:bg-rose-500"
                >
                  Enviar mensaje
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full text-zinc-600 hover:bg-zinc-100"
                  onClick={() => setMessage("")}
                >
                  Limpiar
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center rounded-[22px] border border-zinc-200 bg-white/70 p-8 text-sm text-zinc-500">
            Selecciona una conversación para ver los mensajes.
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminChatPanel;

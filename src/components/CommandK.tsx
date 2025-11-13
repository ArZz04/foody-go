"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api";

const UserLite = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string().optional(),
});

const StoreLite = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
});

type User = z.infer<typeof UserLite>;
type Store = z.infer<typeof StoreLite>;

export default function CommandK() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const { data: users = [] } = useQuery({
    queryKey: ["users-lite"],
    queryFn: async () => UserLite.array().parse(await api.get("/users?lite=1")),
  });

  const { data: stores = [] } = useQuery({
    queryKey: ["stores-lite"],
    queryFn: async () => StoreLite.array().parse(await api.get("/stores?lite=1")),
  });

  const fuse = useMemo(
    () =>
      new Fuse<[User | Store]>([...users, ...stores], {
        keys: ["name", "phone", "slug"],
        threshold: 0.3,
      }),
    [users, stores],
  );

  const results = q ? fuse.search(q).map((match) => match.item) : [];

  const go = (result: User | Store) => {
    setOpen(false);
    if ("phone" in result) {
      router.push(`/chat/${result.id}`);
    } else {
      router.push(`/negocios/${result.id}`);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-start bg-black/30 p-4 md:place-items-center">
      <div className="w-full max-w-xl rounded-2xl bg-white p-3 shadow-lg">
        <input
          autoFocus
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Buscar usuarios o tiendas…"
          className="w-full rounded-lg border border-zinc-200 p-3 text-sm outline-none focus:border-emerald-400"
        />
        <div className="mt-2 divide-y">
          {results.map((result, index) => (
            <button
              key={`${result.id}-${index}`}
              type="button"
              onClick={() => go(result)}
              className="w-full rounded-lg p-3 text-left transition hover:bg-zinc-50"
            >
              <div className="text-sm font-medium text-zinc-800">{result.name}</div>
              {"phone" in result && result.phone ? (
                <div className="text-xs text-zinc-500">{result.phone}</div>
              ) : null}
              {"slug" in result && result.slug ? (
                <div className="text-xs text-zinc-500">/{result.slug}</div>
              ) : null}
            </button>
          ))}
          {!results.length && q ? (
            <div className="p-3 text-sm text-zinc-500">Sin resultados</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

import { BusinessList } from "../components/BusinessList";

export default function AdminNegociosPage() {
  return (
    <main className="space-y-8 px-4 py-10 sm:px-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Negocios</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-300">
          Gestiona comercios aliados, inspecciona ubicaciones y revisa el historial de pedidos.
        </p>
      </header>
      <BusinessList />
    </main>
  );
}

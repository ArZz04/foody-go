import EditUsersList from "../components/EditUsersList";

export default function AdminUsuariosPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold">Usuarios</h1>
      <EditUsersList />
    </div>
  );
}

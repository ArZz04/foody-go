export default function LoadingRow() {
  return (
    <tr>
      <td colSpan={6} className="px-4 py-6">
        <div className="flex items-center justify-center gap-3 text-sm text-zinc-400">
          <span className="inline-flex size-4 animate-spin rounded-full border-2 border-red-200 border-t-transparent" />
          Cargando Usuarios...
        </div>
      </td>
    </tr>
  );
}

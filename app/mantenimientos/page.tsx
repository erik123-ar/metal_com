import Link from "next/link";
import { listarMantenimientos } from "@/app/controllers/mantenimiento.controller";
import { listarMaquinasParaMantenimiento } from "@/app/controllers/maquina.controller";
import { registrarMantenimientoAction } from "./actions";
import { ErrorBanner } from "@/app/components/error-banner";

export const instant = false;

export default async function MantenimientosPage(
  props: PageProps<"/mantenimientos">,
) {
  const { error } = await props.searchParams;
  const [mantenimientos, maquinas] = await Promise.all([
    listarMantenimientos(),
    listarMaquinasParaMantenimiento(),
  ]);
  const hoy = new Date().toISOString().slice(0, 10);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <h1 className="text-2xl font-bold">Mantenimientos</h1>
      <p className="mt-1 text-sm text-ink">
        Historial de mantenimiento de los equipos.
      </p>

      <ErrorBanner mensaje={typeof error === "string" ? error : undefined} />

      {maquinas.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-steel/20 bg-white px-5 py-8 text-sm text-ink">
          Registra una máquina antes de añadir un mantenimiento.
          <Link className="ml-1 font-medium text-industrial hover:underline" href="/maquinas">
            Ver máquinas
          </Link>
        </div>
      ) : (
        <form
          action={registrarMantenimientoAction}
          className="mt-6 rounded-2xl border border-steel/10 bg-white p-6"
        >
          <h2 className="font-semibold">Registrar mantenimiento</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Máquina</span>
              <select
                className="w-full rounded-lg border border-steel/15 bg-white px-3 py-2 text-sm outline-none focus:border-industrial focus:ring-2 focus:ring-industrial/20"
                name="id_maquina"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Selecciona una máquina
                </option>
                {maquinas.map((maquina) => (
                  <option key={maquina.id_maquina} value={maquina.id_maquina}>
                    {maquina.nombre} ({maquina.codigo})
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Fecha</span>
              <input
                className="w-full rounded-lg border border-steel/15 bg-white px-3 py-2 text-sm outline-none focus:border-industrial focus:ring-2 focus:ring-industrial/20"
                type="date"
                name="fecha_mantenimiento"
                defaultValue={hoy}
                required
              />
            </label>
          </div>
          <label className="mt-5 block">
            <span className="mb-1.5 block text-sm font-medium">Descripción</span>
            <textarea
              className="min-h-24 w-full rounded-lg border border-steel/15 bg-white px-3 py-2 text-sm outline-none focus:border-industrial focus:ring-2 focus:ring-industrial/20"
              name="descripcion"
              placeholder="Describe el trabajo realizado"
            />
          </label>
          <button
            className="mt-5 rounded-lg bg-industrial px-5 py-2 text-sm font-medium text-white transition hover:bg-industrial/90"
            type="submit"
          >
            Guardar mantenimiento
          </button>
        </form>
      )}

      {mantenimientos.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-steel/20 bg-white px-5 py-12 text-center text-sm text-ink">
          No hay mantenimientos registrados todavía.
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-steel/10 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-steel/10 text-xs font-medium tracking-wide text-ink uppercase">
                  <th className="px-5 py-3">Fecha</th>
                  <th className="px-5 py-3">Máquina</th>
                  <th className="px-5 py-3">Descripción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel/10">
                {mantenimientos.map((mantenimiento) => (
                  <tr key={mantenimiento.id_mantenimiento}>
                    <td className="px-5 py-4 whitespace-nowrap font-medium">
                      {mantenimiento.fecha_mantenimiento.toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-5 py-4">
                      {mantenimiento.maquinas.nombre}
                      <span className="ml-2 text-xs text-ink">
                        {mantenimiento.maquinas.codigo}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-ink">
                      {mantenimiento.descripcion ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </main>
  );
}

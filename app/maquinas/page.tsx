import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import { listarMaquinas } from "@/app/controllers/maquina.controller";
import { StatusBadge } from "@/app/components/status-badge";
import { ErrorBanner } from "@/app/components/error-banner";
import { DeleteMaquinaButton } from "@/app/components/delete-maquina-button";
import { NuevaMaquinaModal } from "@/app/components/nueva-maquina-modal";

export const instant = false;

export default async function MaquinasPage(props: PageProps<"/maquinas">) {
  const { error } = await props.searchParams;
  const maquinas = await listarMaquinas();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Máquinas</h1>
          <p className="mt-1 text-sm text-ink">Inventario de equipos registrados.</p>
        </div>
        <NuevaMaquinaModal />
      </div>

      <ErrorBanner mensaje={typeof error === "string" ? error : undefined} />

      {maquinas.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-steel/20 bg-white px-5 py-12 text-center text-sm text-ink">
          No hay máquinas registradas todavía.
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-steel/10 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-steel/10 text-xs font-medium tracking-wide text-ink uppercase">
                  <th className="px-5 py-3">Máquina</th>
                  <th className="px-5 py-3">Tipo</th>
                  <th className="px-5 py-3">Ubicación</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3 text-right">Acciones</th>

                </tr>
              </thead>
              <tbody className="divide-y divide-steel/10">
                {maquinas.map((maquina) => (
                  <tr key={maquina.id_maquina} className="hover:bg-canvas/60">
                    <td className="px-5 py-4">
                      <Link
                        className="font-medium transition hover:text-industrial"
                        href={`/maquinas/${maquina.id_maquina}`}
                      >
                        {maquina.nombre}
                      </Link>
                      <p className="text-xs text-ink">{maquina.codigo}</p>
                    </td>
                    <td className="px-5 py-4 text-ink">{maquina.tipo ?? "—"}</td>
                    <td className="px-5 py-4 text-ink">{maquina.ubicacion ?? "—"}</td>
                    <td className="px-5 py-4">
                      <StatusBadge estado={maquina.estado} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          className="rounded-lg p-2 text-ink transition hover:bg-canvas hover:text-steel"
                          href={`/maquinas/${maquina.id_maquina}`}
                          title="Ver detalle"
                          aria-label={`Ver ${maquina.nombre}`}
                        >
                          <Eye className="size-4" />
                        </Link>
                        <Link
                          className="rounded-lg p-2 text-ink transition hover:bg-canvas hover:text-steel"
                          href={`/maquinas/${maquina.id_maquina}/editar`}
                          title="Editar"
                          aria-label={`Editar ${maquina.nombre}`}
                        >
                          <Pencil className="size-4" />
                        </Link>
                        <DeleteMaquinaButton
                          id={maquina.id_maquina}
                          nombre={maquina.nombre}
                        />
                      </div>
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

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { obtenerMaquina } from "@/app/controllers/maquina.controller";
import { StatusBadge } from "@/app/components/status-badge";
import { DeleteMaquinaButton } from "@/app/components/delete-maquina-button";

export const instant = false;

export default async function MaquinaDetallePage(
  props: PageProps<"/maquinas/[id]">,
) {
  const { id } = await props.params;
  const idMaquina = Number(id);

  if (!Number.isInteger(idMaquina) || idMaquina <= 0) {
    notFound();
  }

  const maquina = await obtenerMaquina(idMaquina);

  if (!maquina) {
    notFound();
  }

  const detalles = [
    { label: "Tipo", valor: maquina.tipo },
    { label: "Marca", valor: maquina.marca },
    { label: "Modelo", valor: maquina.modelo },
    { label: "Número de serie", valor: maquina.numero_serie },
    { label: "Ubicación", valor: maquina.ubicacion },
    {
      label: "Registrada",
      valor: maquina.creado_en
        ? new Date(maquina.creado_en).toLocaleDateString("es-ES")
        : null,
    },
  ];

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-8">
      <Link
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink transition hover:text-steel"
        href="/maquinas"
      >
        <ArrowLeft className="size-4" />
        Máquinas
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold">{maquina.nombre}</h1>
            <StatusBadge estado={maquina.estado} />
          </div>
          <p className="mt-1 text-sm text-ink">Código {maquina.codigo}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            className="flex items-center gap-2 rounded-lg bg-steel px-4 py-2 text-sm font-medium text-white transition hover:bg-steel/90"
            href={`/maquinas/${maquina.id_maquina}/editar`}
          >
            <Pencil className="size-4" />
            Editar
          </Link>
          <DeleteMaquinaButton
            id={maquina.id_maquina}
            nombre={maquina.nombre}
            variante="texto"
          />
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-steel/10 bg-white p-6">
        <h2 className="font-semibold">Información del equipo</h2>
        <dl className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {detalles.map((detalle) => (
            <div key={detalle.label}>
              <dt className="text-xs font-medium tracking-wide text-ink uppercase">
                {detalle.label}
              </dt>
              <dd className="mt-1 text-sm">{detalle.valor ?? "—"}</dd>
            </div>
          ))}
        </dl>
        {maquina.observaciones && (
          <div className="mt-6 border-t border-steel/10 pt-4">
            <p className="text-xs font-medium tracking-wide text-ink uppercase">
              Observaciones
            </p>
            <p className="mt-1 text-sm whitespace-pre-line">
              {maquina.observaciones}
            </p>
          </div>
        )}
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-steel/10 bg-white">
        <div className="border-b border-steel/10 px-5 py-4">
          <h2 className="font-semibold">Mantenimientos</h2>
        </div>
        {maquina.mantenimientos.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ink">
            Esta máquina no tiene mantenimientos registrados.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs font-medium tracking-wide text-ink uppercase">
                  <th className="px-5 py-3">Fecha</th>
                  <th className="px-5 py-3">Descripción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel/10">
                {maquina.mantenimientos.map((mantenimiento) => (
                  <tr key={mantenimiento.id_mantenimiento}>
                    <td className="px-5 py-4 whitespace-nowrap font-medium">
                      {mantenimiento.fecha_mantenimiento.toLocaleDateString(
                        "es-ES",
                      )}
                    </td>
                    <td className="px-5 py-4 text-ink">
                      {mantenimiento.descripcion ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

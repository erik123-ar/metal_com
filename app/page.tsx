import Link from "next/link";
import { Plus } from "lucide-react";
import { listarMaquinas } from "@/app/controllers/maquina.controller";
import { contarMantenimientos } from "@/app/controllers/mantenimiento.controller";
import { StatusBadge } from "@/app/components/status-badge";

export const instant = false;

export default async function Home() {
  const [maquinas, mantenimientos] = await Promise.all([
    listarMaquinas(),
    contarMantenimientos(),
  ]);

  const resumen = [
    {
      label: "Total máquinas",
      value: maquinas.length,
      dot: "bg-steel",
    },
    {
      label: "Operativas",
      value: maquinas.filter((m) => m.estado === "operativa").length,
      dot: "bg-ok",
    },
    {
      label: "En mantenimiento",
      value: maquinas.filter((m) => m.estado === "mantenimiento").length,
      dot: "bg-warn",
    },
    {
      label: "Fuera de servicio",
      value: maquinas.filter((m) => m.estado === "fuera_de_servicio").length,
      dot: "bg-danger",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Panel de control</h1>
          <p className="mt-1 text-sm text-ink">Estado del inventario de máquinas.</p>
        </div>
       
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {resumen.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-steel/10 bg-white p-5"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-ink">
              <span className={`size-2 rounded-full ${item.dot}`} />
              {item.label}
            </div>
            <p className="mt-3 text-3xl font-semibold">{item.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl border border-steel/10 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-steel/10 px-5 py-4">
          <h2 className="font-semibold">Máquinas</h2>
          <Link
            className="text-sm font-medium text-industrial hover:underline"
            href="/maquinas"
          >
            Ver todas
          </Link>
        </div>

        {maquinas.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-ink">
            No hay máquinas registradas todavía.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs font-medium tracking-wide text-ink uppercase">
                  <th className="px-5 py-3">Máquina</th>
                  <th className="px-5 py-3">Ubicación</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3 text-right">Mant.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel/10">
                {maquinas.slice(0, 6).map((maquina) => (
                  <tr key={maquina.id_maquina}>
                    <td className="px-5 py-4">
                      <Link
                        className="font-medium transition hover:text-industrial"
                        href={`/maquinas/${maquina.id_maquina}`}
                      >
                        {maquina.nombre}
                      </Link>
                      <p className="text-xs text-ink">{maquina.codigo}</p>
                    </td>
                    <td className="px-5 py-4 text-ink">{maquina.ubicacion ?? "—"}</td>
                    <td className="px-5 py-4">
                      <StatusBadge estado={maquina.estado} />
                    </td>
                    <td className="px-5 py-4 text-right text-ink">
                      {maquina._count.mantenimientos}
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

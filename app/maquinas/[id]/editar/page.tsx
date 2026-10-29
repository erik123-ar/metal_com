import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { obtenerMaquina } from "@/app/controllers/maquina.controller";
import { actualizarMaquinaAction } from "@/app/maquinas/actions";
import { MaquinaForm } from "@/app/components/maquina-form";
import { ErrorBanner } from "@/app/components/error-banner";

export const instant = false;

export default async function EditarMaquinaPage(
  props: PageProps<"/maquinas/[id]/editar">,
) {
  const { id } = await props.params;
  const { error } = await props.searchParams;
  const idMaquina = Number(id);

  if (!Number.isInteger(idMaquina) || idMaquina <= 0) {
    notFound();
  }

  const maquina = await obtenerMaquina(idMaquina);

  if (!maquina) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-8">
      <Link
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink transition hover:text-steel"
        href={`/maquinas/${maquina.id_maquina}`}
      >
        <ArrowLeft className="size-4" />
        {maquina.nombre}
      </Link>

      <h1 className="mt-4 text-2xl font-bold">Editar máquina</h1>
      <p className="mt-1 text-sm text-ink">
        Actualiza la información del equipo {maquina.codigo}.
      </p>

      <ErrorBanner mensaje={typeof error === "string" ? error : undefined} />

      <MaquinaForm
        action={actualizarMaquinaAction}
        id={maquina.id_maquina}
        valores={maquina}
        textoBoton="Guardar cambios"
        cancelHref={`/maquinas/${maquina.id_maquina}`}
      />
    </main>
  );
}

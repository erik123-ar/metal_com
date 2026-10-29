import { crearMaquinaAction } from "@/app/maquinas/actions";
import { MaquinaForm } from "@/app/components/maquina-form";
import { ErrorBanner } from "@/app/components/error-banner";

export const instant = false;

export default async function NuevaMaquinaPage(
  props: PageProps<"/maquinas/nueva">,
) {
  const { error } = await props.searchParams;

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-bold">Nueva máquina</h1>
      <p className="mt-1 text-sm text-ink">Registra un equipo en el inventario.</p>

      <ErrorBanner mensaje={typeof error === "string" ? error : undefined} />

      <MaquinaForm
        action={crearMaquinaAction}
        textoBoton="Guardar máquina"
        cancelHref="/maquinas"
      />
    </main>
  );
}

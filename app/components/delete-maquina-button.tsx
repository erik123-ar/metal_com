"use client";

import { Trash } from "lucide-react";
import { eliminarMaquinaAction } from "@/app/maquinas/actions";

type Props = {
  id: number;
  nombre: string;
  variante?: "icono" | "texto";
};

export function DeleteMaquinaButton({ id, nombre, variante = "icono" }: Props) {
  return (
    <form
      action={eliminarMaquinaAction}
      onSubmit={(event) => {
        if (
          !window.confirm(
            `¿Eliminar la máquina "${nombre}"? Esta acción no se puede deshacer.`,
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      {variante === "icono" ? (
        <button
          type="submit"
          title="Eliminar"
          aria-label={`Eliminar ${nombre}`}
          className="rounded-lg p-2 text-ink transition hover:bg-danger/10 hover:text-danger"
        >
          <Trash className="size-4" />
        </button>
      ) : (
        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg border border-danger/25 px-4 py-2 text-sm font-medium text-danger transition hover:bg-danger/10"
        >
          <Trash className="size-4" />
          Eliminar
        </button>
      )}
    </form>
  );
}

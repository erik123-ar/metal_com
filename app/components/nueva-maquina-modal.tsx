"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Plus, X } from "lucide-react";
import { crearMaquinaModalAction } from "@/app/maquinas/actions";
import { ErrorBanner } from "@/app/components/error-banner";
import { MaquinaForm } from "@/app/components/maquina-form";

type FormState = {
  key: number;
  error: string | null;
};

const estadoInicial: FormState = { key: 0, error: null };

export function NuevaMaquinaModal() {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-industrial/90"
      >
        <Plus className="size-4" />
        Nueva máquina
      </button>

      {abierto && <MaquinaModal onCerrar={() => setAbierto(false)} />}
    </>
  );
}

function MaquinaModal({ onCerrar }: { onCerrar: () => void }) {
  const tituloId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  const [state, formAction, pending] = useActionState(
    async (prev: FormState, formData: FormData): Promise<FormState> => {
      const resultado = await crearMaquinaModalAction(formData);

      if (resultado.error) {
        return { key: prev.key, error: resultado.error };
      }

      startTransition(onCerrar);
      return { key: prev.key + 1, error: null };
    },
    estadoInicial,
  );

  useEffect(() => {
    dialogRef.current?.focus();

    function alPresionarTecla(event: KeyboardEvent) {
      if (event.key === "Escape") onCerrar();
    }

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", alPresionarTecla);

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", alPresionarTecla);
    };
  }, [onCerrar]);

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto bg-steel/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCerrar();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        tabIndex={-1}
        className="mx-auto my-8 w-full max-w-3xl rounded-2xl bg-white shadow-2xl outline-none"
      >
        <header className="flex items-start justify-between gap-4 border-b border-steel/10 px-6 py-4">
          <div>
            <h2 id={tituloId} className="text-lg font-semibold">
              Nueva máquina
            </h2>
            <p className="mt-0.5 text-sm text-ink">
              Registra un equipo en el inventario.
            </p>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-lg p-1.5 text-ink transition hover:bg-canvas hover:text-steel"
            aria-label="Cerrar"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="px-6 py-5">
          <ErrorBanner mensaje={state.error ?? undefined} />

          <div key={state.key} className={state.error ? "mt-4" : undefined}>
            <MaquinaForm
              action={formAction}
              variante="modal"
              pending={pending}
              textoBoton={pending ? "Guardando…" : "Guardar máquina"}
              onCancel={onCerrar}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

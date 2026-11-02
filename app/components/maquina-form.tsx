import Link from "next/link";

export type MaquinaValores = {
  codigo?: string | null;
  nombre?: string | null;
  tipo?: string | null;
  marca?: string | null;
  modelo?: string | null;
  numero_serie?: string | null;
  ubicacion?: string | null;
  estado?: string | null;
  observaciones?: string | null;
};

const campos = [
  { name: "codigo", label: "Código", required: true },
  { name: "nombre", label: "Nombre", required: true },
  { name: "tipo", label: "Tipo", required: false },
  { name: "marca", label: "Marca", required: false },
  { name: "modelo", label: "Modelo", required: false },
  { name: "numero_serie", label: "Número de serie", required: false },
  { name: "ubicacion", label: "Ubicación", required: false },
] as const;

const inputClass =
  "w-full rounded-lg border border-steel/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-industrial focus:ring-2 focus:ring-industrial/20";

type Props = {
  action: (formData: FormData) => Promise<void> | void;
  valores?: MaquinaValores;
  id?: number;
  textoBoton: string;
  cancelHref?: string;
  onCancel?: () => void;
  pending?: boolean;
  variante?: "pagina" | "modal";
};

export function MaquinaForm({
  action,
  valores = {},
  id,
  textoBoton,
  cancelHref,
  onCancel,
  pending = false,
  variante = "pagina",
}: Props) {
  return (
    <form
      action={action}
      className={
        variante === "modal"
          ? "space-y-5"
          : "mt-6 space-y-5 rounded-2xl border border-steel/10 bg-white p-6"
      }
    >
      {id != null && <input type="hidden" name="id" value={id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        {campos.map(({ name, label, required }) => (
          <label className="block" key={name}>
            <span className="mb-1.5 block text-sm font-medium">{label}</span>
            <input
              className={inputClass}
              name={name}
              required={required}
              defaultValue={valores[name] ?? ""}
            />
          </label>
        ))}
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Estado</span>
          <select
            className={inputClass}
            defaultValue={valores.estado ?? "operativa"}
            name="estado"
          >
            <option value="operativa">Operativa</option>
            <option value="mantenimiento">En mantenimiento</option>
            <option value="fuera_de_servicio">Fuera de servicio</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Observaciones</span>
        <textarea
          className={`${inputClass} min-h-28`}
          name="observaciones"
          defaultValue={valores.observaciones ?? ""}
        />
      </label>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          className="rounded-lg bg-industrial px-5 py-2 text-sm font-medium text-white transition hover:bg-industrial/90 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={pending}
        >
          {textoBoton}
        </button>
        {onCancel ? (
          <button
            className="rounded-lg px-4 py-2 text-sm font-medium text-ink transition hover:bg-canvas hover:text-steel"
            type="button"
            onClick={onCancel}
          >
            Cancelar
          </button>
        ) : (
          cancelHref && (
            <Link
              className="rounded-lg px-4 py-2 text-sm font-medium text-ink transition hover:bg-canvas hover:text-steel"
              href={cancelHref}
            >
              Cancelar
            </Link>
          )
        )}
      </div>
    </form>
  );
}

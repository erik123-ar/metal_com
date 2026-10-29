const ESTADOS: Record<string, { label: string; tone: string; dot: string }> = {
  operativa: { label: "Operativa", tone: "bg-ok/10 text-ok", dot: "bg-ok" },
  mantenimiento: {
    label: "En mantenimiento",
    tone: "bg-warn/15 text-[#92400e]",
    dot: "bg-warn",
  },
  fuera_de_servicio: {
    label: "Fuera de servicio",
    tone: "bg-danger/10 text-danger",
    dot: "bg-danger",
  },
};

export function StatusBadge({ estado }: { estado: string }) {
  const meta = ESTADOS[estado] ?? {
    label: estado,
    tone: "bg-canvas text-ink",
    dot: "bg-ink",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${meta.tone}`}
    >
      <span className={`size-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

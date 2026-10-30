import type { MaquinaInput } from "@/app/models/maquina.model";

const ESTADOS = ["operativa", "mantenimiento", "fuera_de_servicio"];

const CAMPOS_TEXTO: (keyof MaquinaInput)[] = [
  "tipo",
  "marca",
  "modelo",
  "numero_serie",
  "imagen",
  "ubicacion",
  "observaciones",
];

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

function texto(valor: unknown) {
  return typeof valor === "string" ? valor : "";
}

export async function leerMaquinaInput(request: Request): Promise<MaquinaInput> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw new ApiError("El cuerpo de la petición debe ser JSON válido.", 400);
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new ApiError("El cuerpo debe ser un objeto JSON.", 400);
  }

  const datos = body as Record<string, unknown>;
  const codigo = texto(datos.codigo).trim();
  const nombre = texto(datos.nombre).trim();
  const estado = texto(datos.estado).trim() || "operativa";

  if (!codigo || !nombre) {
    throw new ApiError("El código y el nombre son obligatorios.", 400);
  }

  if (!ESTADOS.includes(estado)) {
    throw new ApiError(
      `Estado inválido. Usa uno de: ${ESTADOS.join(", ")}.`,
      400,
    );
  }

  const input: MaquinaInput = { codigo, nombre, estado };

  for (const campo of CAMPOS_TEXTO) {
    input[campo] = texto(datos[campo]);
  }

  return input;
}

function tieneCodigo(error: unknown, codigo: string) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === codigo
  );
}

export function manejarError(error: unknown) {
  if (error instanceof ApiError) {
    return jsonError(error.message, error.status);
  }

  if (tieneCodigo(error, "P2025")) {
    return jsonError("Máquina no encontrada.", 404);
  }

  if (error instanceof Error) {
    const esConflicto =
      error.message.startsWith("Ya existe") ||
      error.message.includes("mantenimientos registrados");

    return jsonError(error.message, esConflicto ? 409 : 400);
  }

  return jsonError("Error inesperado en el servidor.", 500);
}

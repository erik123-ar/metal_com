import {
  actualizarMaquina,
  eliminarMaquina,
  obtenerMaquina,
} from "@/app/controllers/maquina.controller";
import { ApiError, leerMaquinaInput, manejarError } from "../lib";

function leerId(id: string) {
  const valor = Number(id);

  if (!Number.isInteger(valor) || valor <= 0) {
    throw new ApiError("El id de la máquina no es válido.", 400);
  }

  return valor;
}

export async function GET(_request: Request, ctx: RouteContext<"/api/maquinas/[id]">) {
  try {
    const { id } = await ctx.params;
    const maquina = await obtenerMaquina(leerId(id));

    if (!maquina) {
      throw new ApiError("Máquina no encontrada.", 404);
    }

    return Response.json({ data: maquina });
  } catch (error) {
    return manejarError(error);
  }
}

async function actualizar(
  request: Request,
  ctx: RouteContext<"/api/maquinas/[id]">,
) {
  try {
    const { id } = await ctx.params;
    const input = await leerMaquinaInput(request);
    const maquina = await actualizarMaquina(leerId(id), input);

    return Response.json({ data: maquina });
  } catch (error) {
    return manejarError(error);
  }
}

export const PUT = actualizar;
export const PATCH = actualizar;

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/maquinas/[id]">,
) {
  try {
    const { id } = await ctx.params;
    const maquina = await eliminarMaquina(leerId(id));

    return Response.json({ data: maquina });
  } catch (error) {
    return manejarError(error);
  }
}

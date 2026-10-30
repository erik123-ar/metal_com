import type { NextRequest } from "next/server";
import {
  listarMaquinas,
  registrarMaquina,
} from "@/app/controllers/maquina.controller";
import { leerMaquinaInput, manejarError } from "./lib";

export async function GET(request: NextRequest) {
  try {
    const estado = request.nextUrl.searchParams.get("estado");
    const maquinas = await listarMaquinas();
    const data = estado
      ? maquinas.filter((maquina) => maquina.estado === estado)
      : maquinas;

    return Response.json({ data });
  } catch (error) {
    return manejarError(error);
  }
}

export async function POST(request: Request) {
  try {
    const input = await leerMaquinaInput(request);
    const maquina = await registrarMaquina(input);

    return Response.json({ data: maquina }, { status: 201 });
  } catch (error) {
    return manejarError(error);
  }
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  actualizarMaquina,
  eliminarMaquina,
  registrarMaquina,
} from "@/app/controllers/maquina.controller";
import type { MaquinaInput } from "@/app/models/maquina.model";

function texto(formData: FormData, campo: string) {
  return String(formData.get(campo) ?? "");
}

function leerMaquina(formData: FormData): MaquinaInput {
  return {
    codigo: texto(formData, "codigo"),
    nombre: texto(formData, "nombre"),
    tipo: texto(formData, "tipo"),
    marca: texto(formData, "marca"),
    modelo: texto(formData, "modelo"),
    numero_serie: texto(formData, "numero_serie"),
    ubicacion: texto(formData, "ubicacion"),
    estado: texto(formData, "estado") || "operativa",
    observaciones: texto(formData, "observaciones"),
  };
}

function leerId(formData: FormData) {
  const id = Number(formData.get("id"));
  return Number.isInteger(id) && id > 0 ? id : null;
}

function mensajeDe(error: unknown, porDefecto: string) {
  return error instanceof Error ? error.message : porDefecto;
}

export async function crearMaquinaAction(formData: FormData) {
  try {
    await registrarMaquina(leerMaquina(formData));
  } catch (error) {
    redirect(
      `/maquinas/nueva?error=${encodeURIComponent(
        mensajeDe(error, "No se pudo guardar la máquina."),
      )}`,
    );
  }

  revalidatePath("/maquinas");
  revalidatePath("/");
  redirect("/maquinas");
}

export type CrearMaquinaModalResult = {
  error: string | null;
};

export async function crearMaquinaModalAction(
  formData: FormData,
): Promise<CrearMaquinaModalResult> {
  try {
    await registrarMaquina(leerMaquina(formData));
  } catch (error) {
    return {
      error: mensajeDe(error, "No se pudo guardar la máquina."),
    };
  }

  revalidatePath("/maquinas");
  revalidatePath("/");

  return { error: null };
}

export async function actualizarMaquinaAction(formData: FormData) {
  const id = leerId(formData);

  if (!id) {
    redirect("/maquinas?error=Máquina%20no%20válida.");
  }

  try {
    await actualizarMaquina(id, leerMaquina(formData));
  } catch (error) {
    redirect(
      `/maquinas/${id}/editar?error=${encodeURIComponent(
        mensajeDe(error, "No se pudo actualizar la máquina."),
      )}`,
    );
  }

  revalidatePath("/maquinas");
  revalidatePath(`/maquinas/${id}`);
  revalidatePath("/");
  redirect(`/maquinas/${id}`);
}

export async function eliminarMaquinaAction(formData: FormData) {
  const id = leerId(formData);

  try {
    if (!id) {
      throw new Error("Máquina no válida.");
    }

    await eliminarMaquina(id);
  } catch (error) {
    redirect(
      `/maquinas?error=${encodeURIComponent(
        mensajeDe(error, "No se pudo eliminar la máquina."),
      )}`,
    );
  }

  revalidatePath("/maquinas");
  revalidatePath("/");
  redirect("/maquinas");
}

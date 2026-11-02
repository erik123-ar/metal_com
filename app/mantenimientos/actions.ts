"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { registrarMantenimiento } from "@/app/controllers/mantenimiento.controller";
import { cambiarEstadoMaquina } from "@/app/controllers/maquina.controller";

function texto(formData: FormData, campo: string) {
  return String(formData.get(campo) ?? "").trim();
}

function leerIdMaquina(formData: FormData) {
  const id = Number(formData.get("id_maquina"));
  return Number.isInteger(id) && id > 0 ? id : null;
}

function leerFecha(fecha: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return null;

  const resultado = new Date(`${fecha}T00:00:00`);
  const [year, month, day] = fecha.split("-").map(Number);

  if (
    Number.isNaN(resultado.getTime()) ||
    resultado.getFullYear() !== year ||
    resultado.getMonth() + 1 !== month ||
    resultado.getDate() !== day
  ) {
    return null;
  }

  return resultado;
}

function mensajeDe(error: unknown) {
  return error instanceof Error
    ? error.message
    : "No se pudo registrar el mantenimiento.";
}

export async function registrarMantenimientoAction(formData: FormData) {
  const idMaquina = leerIdMaquina(formData);
  const fecha = leerFecha(texto(formData, "fecha_mantenimiento"));

  try {
    if (!idMaquina) throw new Error("Selecciona una máquina.");
    if (!fecha) throw new Error("La fecha de mantenimiento no es válida.");

    await registrarMantenimiento({
      id_maquina: idMaquina,
      fecha_mantenimiento: fecha,
      descripcion: texto(formData, "descripcion"),
    });
  } catch (error) {
    redirect(`/mantenimientos?error=${encodeURIComponent(mensajeDe(error))}`);
  }

  revalidatePath("/mantenimientos");
  revalidatePath("/");
  revalidatePath(`/maquinas/${idMaquina}`);
  redirect("/mantenimientos");
}

export async function finalizarMantenimientoAction(formData: FormData) {
  const idMaquina = leerIdMaquina(formData);

  try {
    if (!idMaquina) throw new Error("La máquina seleccionada no es válida.");
    await cambiarEstadoMaquina(idMaquina, "operativa");
  } catch (error) {
    redirect(
      `/maquinas/${idMaquina ?? ""}?error=${encodeURIComponent(mensajeDe(error))}`,
    );
  }

  revalidatePath("/");
  revalidatePath("/maquinas");
  revalidatePath(`/maquinas/${idMaquina}`);
  redirect(`/maquinas/${idMaquina}`);
}

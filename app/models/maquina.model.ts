import { prisma } from "@/app/lib/prisma";

export type MaquinaInput = {
  codigo: string;
  nombre: string;
  tipo?: string;
  marca?: string;
  modelo?: string;
  numero_serie?: string;
  imagen?: string;
  ubicacion?: string;
  estado?: string;
  observaciones?: string;
};

function optionalText(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed || null;
}

async function codigoEnUso(codigo: string, exceptoId?: number) {
  const existente = await prisma.maquinas.findUnique({
    where: { codigo },
    select: { id_maquina: true },
  });

  return existente !== null && existente.id_maquina !== exceptoId;
}

export async function listarMaquinas() {
  return prisma.maquinas.findMany({
    orderBy: { nombre: "asc" },
    include: { _count: { select: { mantenimientos: true } } },
  });
}

export async function listarMaquinasParaMantenimiento() {
  return prisma.maquinas.findMany({
    orderBy: { nombre: "asc" },
    select: { id_maquina: true, codigo: true, nombre: true },
  });
}

export async function obtenerMaquina(id: number) {
  return prisma.maquinas.findUnique({
    where: { id_maquina: id },
    include: { mantenimientos: { orderBy: { fecha_mantenimiento: "desc" } } },
  });
}

export async function cambiarEstadoMaquina(id: number, estado: string) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("La máquina seleccionada no es válida.");
  }

  const estadosValidos = ["operativa", "mantenimiento", "fuera_de_servicio"];
  if (!estadosValidos.includes(estado)) {
    throw new Error("El estado de la máquina no es válido.");
  }

  return prisma.maquinas.update({
    where: { id_maquina: id },
    data: { estado },
  });
}

export async function contarMaquinas() {
  return prisma.maquinas.count();
}

export async function crearMaquina(input: MaquinaInput) {
  const codigo = input.codigo.trim();
  const nombre = input.nombre.trim();

  if (!codigo || !nombre) {
    throw new Error("El código y el nombre de la máquina son obligatorios.");
  }

  if (await codigoEnUso(codigo)) {
    throw new Error(`Ya existe una máquina con el código "${codigo}".`);
  }

  return prisma.maquinas.create({
    data: {
      codigo,
      nombre,
      tipo: optionalText(input.tipo),
      marca: optionalText(input.marca),
      modelo: optionalText(input.modelo),
      numero_serie: optionalText(input.numero_serie),
      imagen: optionalText(input.imagen),
      ubicacion: optionalText(input.ubicacion),
      estado: input.estado?.trim() || "operativa",
      observaciones: optionalText(input.observaciones),
    },
  });
}

export async function actualizarMaquina(id: number, input: MaquinaInput) {
  const codigo = input.codigo.trim();
  const nombre = input.nombre.trim();

  if (!codigo || !nombre) {
    throw new Error("El código y el nombre de la máquina son obligatorios.");
  }

  if (await codigoEnUso(codigo, id)) {
    throw new Error(`Ya existe una máquina con el código "${codigo}".`);
  }

  return prisma.maquinas.update({
    where: { id_maquina: id },
    data: {
      codigo,
      nombre,
      tipo: optionalText(input.tipo),
      marca: optionalText(input.marca),
      modelo: optionalText(input.modelo),
      numero_serie: optionalText(input.numero_serie),
      imagen: optionalText(input.imagen),
      ubicacion: optionalText(input.ubicacion),
      estado: input.estado?.trim() || "operativa",
      observaciones: optionalText(input.observaciones),
    },
  });
}

export async function eliminarMaquina(id: number) {
  const mantenimientos = await prisma.mantenimientos.count({
    where: { id_maquina: id },
  });

  if (mantenimientos > 0) {
    throw new Error(
      "No se puede eliminar la máquina porque tiene mantenimientos registrados.",
    );
  }

  return prisma.maquinas.delete({ where: { id_maquina: id } });
}
export async function listarMaquinaConFecha(){
  return prisma.maquinas.findMany({
      select: {
        creado_en: true,
      },
});
  }

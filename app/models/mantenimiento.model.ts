import { prisma } from "@/app/lib/prisma";

export type MantenimientoInput = {
  id_maquina: number;
  fecha_mantenimiento: Date;
  descripcion?: string;
};

export async function listarMantenimientos() {
  return prisma.mantenimientos.findMany({
    orderBy: { fecha_mantenimiento: "desc" },
    include: { maquinas: { select: { codigo: true, nombre: true } } },
  });
}

export async function contarMantenimientos() {
  return prisma.mantenimientos.count();
}

export async function crearMantenimiento(input: MantenimientoInput) {
  if (!Number.isInteger(input.id_maquina) || input.id_maquina <= 0) {
    throw new Error("La máquina seleccionada no es válida.");
  }

  if (Number.isNaN(input.fecha_mantenimiento.getTime())) {
    throw new Error("La fecha de mantenimiento no es válida.");
  }

  const maquina = await prisma.maquinas.findUnique({
    where: { id_maquina: input.id_maquina },
    select: { id_maquina: true },
  });

  if (!maquina) {
    throw new Error("La máquina seleccionada no existe.");
  }

  const [mantenimiento] = await prisma.$transaction([
    prisma.mantenimientos.create({
      data: {
        id_maquina: input.id_maquina,
        fecha_mantenimiento: input.fecha_mantenimiento,
        descripcion: input.descripcion?.trim() || null,
      },
    }),
    prisma.maquinas.update({
      where: { id_maquina: input.id_maquina },
      data: { estado: "mantenimiento" },
    }),
  ]);

  return mantenimiento;
}

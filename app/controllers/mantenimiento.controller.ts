import {
  contarMantenimientos,
  crearMantenimiento,
  listarMantenimientos,
  type MantenimientoInput,
} from "@/app/models/mantenimiento.model";

export { contarMantenimientos, listarMantenimientos };

export async function registrarMantenimiento(input: MantenimientoInput) {
  return crearMantenimiento(input);
}

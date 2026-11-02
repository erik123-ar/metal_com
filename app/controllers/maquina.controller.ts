import {
  actualizarMaquina,
  cambiarEstadoMaquina,
  contarMaquinas,
  crearMaquina,
  eliminarMaquina,
  listarMaquinas,
  listarMaquinasParaMantenimiento,
  obtenerMaquina,
  type MaquinaInput,
} from "@/app/models/maquina.model";

export {
  actualizarMaquina,
  cambiarEstadoMaquina,
  contarMaquinas,
  eliminarMaquina,
  listarMaquinas,
  listarMaquinasParaMantenimiento,
  obtenerMaquina,
};

export async function registrarMaquina(input: MaquinaInput) {
  return crearMaquina(input);
}

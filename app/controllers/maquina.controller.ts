import {
  actualizarMaquina,
  contarMaquinas,
  crearMaquina,
  eliminarMaquina,
  listarMaquinas,
  obtenerMaquina,
  type MaquinaInput,
} from "@/app/models/maquina.model";

export {
  actualizarMaquina,
  contarMaquinas,
  eliminarMaquina,
  listarMaquinas,
  obtenerMaquina,
};

export async function registrarMaquina(input: MaquinaInput) {
  return crearMaquina(input);
}

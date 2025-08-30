import type { BaseResponse } from './common';

export interface DatosLogisticos {
  distancia: number;
  tiempoEstimado: number;
  costoEnvio: number;
  tiempoEstimadoFormateado?: string;
  costoEnvioFormateado?: string;
  distanciaFormateada?: string;
}

export interface VendedorDTO {
  vendedorId: number;
  nombre: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  activo?: boolean;
  datosLogisticos?: DatosLogisticos;
}

export interface VisualizarVendedoresResponse extends BaseResponse {
  vendedores: VendedorDTO[];
}
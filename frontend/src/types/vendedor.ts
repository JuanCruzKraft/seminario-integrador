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
  calificacionPromedio?: number;
  cantidadCalificaciones?: number;
}

export interface VisualizarVendedoresResponse extends BaseResponse {
  vendedores: VendedorDTO[];
}

// Tipos para calificaciones
export interface CalificacionDTO {
  id: number;
  puntaje: number;
  comentario: string;
  nombreCliente: string;
}

export interface VisualizarCalificacionVendedorRequest {
  vendedorId: number;
}

export interface VisualizarCalificacionVendedorResponse extends BaseResponse {
  nombreVendedor: string;
  calificacionPromedio: number;
  cantidadCalificaciones: number;
  calificaciones: CalificacionDTO[];
}
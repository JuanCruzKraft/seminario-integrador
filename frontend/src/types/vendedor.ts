import type { BaseResponse } from './common';

export interface VendedorDTO {
  vendedorid: number;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
}

export interface VisualizarVendedoresResponse extends BaseResponse {
  vendedores: VendedorDTO[];
}
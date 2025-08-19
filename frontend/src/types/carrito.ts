import type { BaseResponse } from './common';

export interface AgregarItemRequest {
  clienteid: number;
  vendedorid: number;
  itemMenuId: number;
  cantidad: number;
}

export interface AgregarItemResponse extends BaseResponse {
  // Campos adicionales si los hay
}

export interface CrearCarritoRequest {
  clienteid: number;
  vendedorid: number;
}

export interface CrearCarritoResponse extends BaseResponse {
  pedidoId?: number;
}
import type { BaseResponse } from './common';

export enum MetodoPago {
  TARJETA_CREDITO = 'TARJETA_CREDITO',
  TARJETA_DEBITO = 'TARJETA_DEBITO',
  TRANSFERENCIA = 'TRANSFERENCIA'
}

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

export interface ItemPedidoDTO {
  itemPedidoId: number;
  itemMenuId: number;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

export interface VisualizarCarritoResponse extends BaseResponse {
  costoEnvio: number;
  distancia: number;
  tiempo: number;
  items: ItemPedidoDTO[];
  subtotalTotal: number;
  direccionEntrega: string;
}

export interface EliminarCarritoResponse extends BaseResponse {
  // Sin campos adicionales específicos
}

export interface ModificarCantidadRequest {
  itemPedidoId: number;
  itemMenuId: number;
  nuevaCantidad: number;
}

export interface ModificarCantidadResponse extends BaseResponse {
  // Sin campos adicionales específicos
}

export interface EliminarItemRequest {
  itemPedidoId: number;
}

export interface EliminarItemResponse extends BaseResponse {
  // Sin campos adicionales específicos
}
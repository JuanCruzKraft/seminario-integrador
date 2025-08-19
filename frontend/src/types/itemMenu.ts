import type { BaseResponse } from './common';

export interface VisualizarItemMenuRequest {
  vendedorid: number;
}

export interface ItemMenuDTO {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  tipo: 'PLATO' | 'BEBIDA';
  vendedorid: number;
}

export interface VisualizarItemMenuResponse extends BaseResponse {
  itemMenus: ItemMenuDTO[];
}
import type { BaseResponse } from './common';

export interface VisualizarItemMenuRequest {
  vendedorid: number;
}

export interface ItemMenuDTO {
  itemMenuId: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  esBebida: boolean;
  vendedorid: number;
  activo?: boolean;
  peso?: number;
  tamanio?: number; // Solo para bebidas
  graduacionAlcoholica?: number; // Solo para bebidas
  calorias?: number; // Solo para comidas
}

export interface VisualizarItemMenuResponse extends BaseResponse {
  itemMenus: ItemMenuDTO[];
}
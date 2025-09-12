import type { BaseResponse } from './common';

export interface EstablecerDireccionRequest {
  direccion: string
}

export interface EstablecerDireccionResponse extends BaseResponse {
  latitud: number;
  longitud: number;
}
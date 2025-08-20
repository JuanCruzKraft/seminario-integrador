import type { BaseResponse } from './common';

export interface RegistrarClienteRequest {
  nombre: string;
  apellido: string;
  cuit: number;
  email: string;
  direccion: string;
  username: string;
  password: string;
  confirmarPassword: string;
}

export interface RegistrarClienteResponse extends BaseResponse {
  clienteid?: number;
}

export interface EstablecerDireccionRequest {
  direccion: string
}

export interface EstablecerDireccionResponse extends BaseResponse {
  latitud: number;
  longitud: number;
}
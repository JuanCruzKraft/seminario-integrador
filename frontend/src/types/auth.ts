import type { BaseResponse } from './common';

export interface IniciarSesionRequest {
  username: string;
  password: string;
}

export interface IniciarSesionResponse extends BaseResponse {
  idCliente: number;
}

export interface UserSession {
  idCliente: number;
  username: string;
  nombre?: string;     // ✅ Agregar como opcional
  apellido?: string;   // ✅ Agregar como opcional
  tipoUsuario?: string; // ✅ Agregar como opcional
  isLoggedIn: boolean;
}

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

export interface RegistrarClienteResponse extends BaseResponse{

}
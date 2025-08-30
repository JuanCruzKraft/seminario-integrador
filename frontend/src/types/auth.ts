import type { BaseResponse } from './common';

export interface Coordenada {
  latitud: number;
  longitud: number;
}

export interface IniciarSesionRequest {
  username: string;
  password: string;
}

export interface IniciarSesionResponse extends BaseResponse {
  idCliente: number;
  username: string;
  nombre: string;    
  apellido: string; 
  email: string;   
  direccion?: string; 
  tipoUsuario?: string; 
  cuit: number;
  coordenadas?: Coordenada;
}

export interface UserSession {
  idCliente: number;
  username: string;
  nombre: string;    
  apellido: string; 
  email: string;   
  direccion?: string; 
  tipoUsuario?: string; 
  cuit: number;
  coordenadas?: Coordenada;
  isLoggedIn: boolean;
}

export interface RegistrarClienteRequest {
    nombre: string;
    apellido: string;
    cuit: number;
    email: string;
    direccion?: string;
    username: string;
    password: string;
    confirmarPassword: string;
}

export interface RegistrarClienteResponse extends BaseResponse{

}
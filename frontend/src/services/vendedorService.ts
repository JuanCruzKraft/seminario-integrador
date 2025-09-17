import axios from 'axios';
import { VendedorDTO } from '../types/vendedor';

export const getVendedores = async (): Promise<VendedorDTO[]> => {
  const res = await axios.get('http://localhost:8080/vendedores/listar');
  return res.data.vendedores;
};

export const buscarVendedoresPorComida = async (nombreProducto: string): Promise<VendedorDTO[]> => {
  const res = await axios.post('http://localhost:8080/vendedores/listar-menu-contiene', {
    nombreProducto
  });
  return res.data.vendedores;
};

// TODO: Implementar en el backend
// Endpoint sugerido: POST /vendedores/buscar-por-nombre
// Request body: { nombreVendedor: string }
// Response: mismo formato que los otros endpoints (VisualizarVendedoresResponseDTO)
export const buscarVendedoresPorNombre = async (nombreVendedor: string): Promise<VendedorDTO[]> => {
  const res = await axios.post('http://localhost:8080/vendedores/buscar-por-nombre', {
    nombreVendedor
  });
  return res.data.vendedores;
};

import { ApiService } from './api';
import { API_ENDPOINTS } from '@/constants/api';
import type { VisualizarVendedoresResponse, VisualizarCalificacionVendedorRequest, VisualizarCalificacionVendedorResponse } from '@/types/vendedor';

export class VendedorService {
  static async listarVendedores(): Promise<VisualizarVendedoresResponse> {
    return ApiService.get<VisualizarVendedoresResponse>(API_ENDPOINTS.VENDEDORES_LISTAR);
  }

  static async obtenerCalificaciones(vendedorId: number): Promise<VisualizarCalificacionVendedorResponse> {
    const request: VisualizarCalificacionVendedorRequest = { vendedorId };
    return ApiService.post<VisualizarCalificacionVendedorResponse>('/vendedores/calificaciones', request);
  }
}
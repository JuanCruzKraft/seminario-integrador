import axios from 'axios';
import { VendedorDTO } from '../types/vendedor';

export const getVendedores = async (): Promise<VendedorDTO[]> => {
  const res = await axios.get('http://localhost:8080/vendedores/listar');
  return res.data.vendedores;
};
import { ApiService } from './api';
import { API_ENDPOINTS } from '@/constants/api';
import type { VisualizarVendedoresResponse } from '@/types/vendedor';

export class VendedorService {
  static async listarVendedores(): Promise<VisualizarVendedoresResponse> {
    return ApiService.get<VisualizarVendedoresResponse>(API_ENDPOINTS.VENDEDORES_LISTAR);
  }
}
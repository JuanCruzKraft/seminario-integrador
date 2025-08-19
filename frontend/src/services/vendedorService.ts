import { ApiService } from './api';
import { API_ENDPOINTS } from '@/constants/api';
import type { VisualizarVendedoresResponse } from '@/types/vendedor';

export class VendedorService {
  static async listarVendedores(): Promise<VisualizarVendedoresResponse> {
    return ApiService.get<VisualizarVendedoresResponse>(API_ENDPOINTS.VENDEDORES_LISTAR);
  }
}
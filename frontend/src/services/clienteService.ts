import { ApiService } from './api';
import { API_ENDPOINTS } from '@/constants/api';
import type { RegistrarClienteRequest, RegistrarClienteResponse } from '@/types/cliente';

export class ClienteService {
  static async registrar(cliente: RegistrarClienteRequest): Promise<RegistrarClienteResponse> {
    return ApiService.post<RegistrarClienteResponse>(API_ENDPOINTS.CLIENTE_REGISTRAR, cliente);
  }
}


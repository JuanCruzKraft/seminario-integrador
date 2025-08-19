import { ApiService } from './api';
import { API_ENDPOINTS } from '@/constants/api';
import type { 
  IniciarSesionRequest, 
  IniciarSesionResponse, 
  UserSession, 
  RegistrarClienteRequest, 
  RegistrarClienteResponse 
} from '@/types/auth';

export class AuthService {
  static async login(credentials: IniciarSesionRequest): Promise<IniciarSesionResponse> {
    return ApiService.post<IniciarSesionResponse>(API_ENDPOINTS.LOGIN, credentials);
  }

  static async register(cliente: RegistrarClienteRequest): Promise<RegistrarClienteResponse> {
    return ApiService.post<RegistrarClienteResponse>(API_ENDPOINTS.CLIENTE_REGISTRAR, cliente);
  }

  static logout(): void {
    localStorage.removeItem('user');
  }

  static getCurrentUser(): UserSession | null {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  static saveUser(user: UserSession): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  static isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    return user?.isLoggedIn ?? false;
  }
}
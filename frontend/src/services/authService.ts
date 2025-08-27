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

  // ✅ Nuevo método que maneja todo el flujo de login
  static async loginAndSaveSession(credentials: IniciarSesionRequest): Promise<UserSession> {
    const response = await this.login(credentials);
    
    // Crear el UserSession con los datos del backend
    const userSession: UserSession = {
      idCliente: response.idCliente,
      username: credentials.username, // Username del form
      nombre: response.nombre, // ✅ Nombre del backend
      apellido: response.apellido,
      email: response.email,
      direccion: response.direccion,
      cuit: response.cuit,


      isLoggedIn: true
    };
      this.saveUser(userSession);
    // Guardar en localStorage
    const savedUser = this.getCurrentUser();
    console.log('🔍 User saved in localStorage:', savedUser);
    
    return userSession;
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
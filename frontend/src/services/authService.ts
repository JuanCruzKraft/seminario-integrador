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
    if(response.resultado.status !==0){
      throw new Error(response.resultado.mensaje || 'Login failed');
    }
    // Crear el UserSession con los datos del backend
    const userSession: UserSession = {
      idCliente: response.idCliente,
      username: credentials.username, // Username del form
      nombre: response.nombre, // ✅ Nombre del backend
      apellido: response.apellido,
      email: response.email,
      direccion: response.direccion,
      cuit: response.cuit,
      coordenadas: response.coordenadas, // ✅ Coordenadas del backend

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
    localStorage.removeItem('carrito');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('carrito');
  }

  static getCurrentUser(): UserSession | null {
    try {
      const userData = sessionStorage.getItem('user');
      if (!userData) return null;
      
      const user = JSON.parse(userData);
      
      // Validar que el objeto tenga las propiedades mínimas requeridas
      if (!user.idCliente || !user.isLoggedIn) {
        this.logout(); // Limpiar datos inválidos
        return null;
      }
      
      return user;
    } catch {
      this.logout(); // Limpiar datos corruptos
      return null;
    }
  }

  static saveUser(user: UserSession): void {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  static isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    return !!(user?.isLoggedIn && user?.idCliente);
  }
}
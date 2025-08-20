export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',
  TIMEOUT: 10000,
} as const;

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/cliente/login',
  
  // Cliente
  CLIENTE_REGISTRAR: '/cliente/registrar',
  
  // Carrito
  CARRITO_AGREGAR: '/carrito/agregar-item',
  CARRITO_CREAR: '/carrito/crear',
  
  // Item Menu
  ITEM_MENU_VISUALIZAR: '/itemMenu/visualizar',
  
  // Vendedor
  VENDEDORES_LISTAR: '/vendedores/listar',

  ESTABLECER_DIRECCION: '/cliente/establecer-direccion',

} as const;
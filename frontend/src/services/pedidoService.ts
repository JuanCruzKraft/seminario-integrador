import { API_CONFIG } from '@/constants/api'

export interface EstadoPedidoResponse {
  pedidoId: number
  estado: string
  estadoTexto: string
  tiempoRestante: number
  tiempoTotal: number
  progreso: number
  siguienteEstado: string
  resultado: {
    status: number
    mensaje: string
  }
}

export const pedidoService = {
  async obtenerEstadoPedido(pedidoId: number): Promise<EstadoPedidoResponse> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/pedido/${pedidoId}/estado`, {
      method: 'GET',
      credentials: 'include',
    })
    
    if (!response.ok) {
      throw new Error('Error al obtener el estado del pedido')
    }
    
    return response.json()
  }
}

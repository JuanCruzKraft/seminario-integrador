import { API_CONFIG } from '@/constants/api'
import { EstadoPedidoResponse, VerPedidosResponseDTO, CalificarPedidoRequest, CalificarPedidoResponse } from '@/types/pedido'

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
  },

  async verHistorialPedidos(): Promise<VerPedidosResponseDTO> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/pedido/historial`, {
      method: 'GET',
      credentials: 'include',
    })
    
    if (!response.ok) {
      throw new Error('Error al obtener el historial de pedidos')
    }
    
    return response.json()
  },

  async verPedidosEnCurso(): Promise<VerPedidosResponseDTO> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/pedido/curso`, {
      method: 'GET',
      credentials: 'include',
    })
    
    if (!response.ok) {
      throw new Error('Error al obtener los pedidos en curso')
    }
    
    return response.json()
  },

  async calificarPedido(calificacionData: CalificarPedidoRequest): Promise<CalificarPedidoResponse> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/pedido/calificar`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(calificacionData),
    })
    
    if (!response.ok) {
      throw new Error('Error al calificar el pedido')
    }
    
    return response.json()
  }
}

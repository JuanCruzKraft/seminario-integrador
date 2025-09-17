import { ItemPedidoDTO } from './carrito'
import type { BaseResponse } from './common'

export interface PedidoDTO {
  pedidoID: number
  estado: string
  fechaConfirmacion: string
  items: ItemPedidoDTO[]
  nombreVendedor: string
  precio: number
  costoEnvio: number
  subtotalItems: number
  calificado?: boolean
}

export interface VerPedidosResponseDTO {
  pedidos: PedidoDTO[]
  resultado: {
    status: number
    mensaje: string
  }
}

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

// Tipos para calificación
export interface CalificarPedidoRequest {
  pedidoId: number
  calificacion: number // De 1 a 5
  comentario: string
}

export interface CalificarPedidoResponse extends BaseResponse {
  // No hay campos adicionales específicos según el DTO del backend
}

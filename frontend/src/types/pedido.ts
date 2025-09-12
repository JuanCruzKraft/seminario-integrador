import { ItemPedidoDTO } from './carrito'

export interface PedidoDTO {
  pedidoID: number
  estado: string
  fechaConfirmacion: string
  items: ItemPedidoDTO[]
  nombreVendedor: string
  precio: number
  costoEnvio: number
  subtotalItems: number
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

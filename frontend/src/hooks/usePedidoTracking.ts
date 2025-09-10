'use client'

import { useState, useEffect, useCallback } from 'react'
import { pedidoService, EstadoPedidoResponse } from '@/services/pedidoService'

export const usePedidoTracking = (pedidoId: number | null) => {
  const [estadoPedido, setEstadoPedido] = useState<EstadoPedidoResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const obtenerEstado = useCallback(async () => {
    if (!pedidoId) return

    try {
      setLoading(true)
      setError(null)
      const response = await pedidoService.obtenerEstadoPedido(pedidoId)
      
      if (response.resultado.status === 0) {
        setEstadoPedido(response)
      } else {
        setError(response.resultado.mensaje)
      }
    } catch (err) {
      setError('Error al obtener el estado del pedido')
      console.error('Error obteniendo estado:', err)
    } finally {
      setLoading(false)
    }
  }, [pedidoId])

  // Polling cada 10 segundos para ver las transiciones rápidas
  useEffect(() => {
    if (!pedidoId) return

    obtenerEstado()
    
    const interval = setInterval(obtenerEstado, 10000) // 10 segundos
    
    return () => clearInterval(interval)
  }, [pedidoId, obtenerEstado])

  return {
    estadoPedido,
    loading,
    error,
    refrescar: obtenerEstado
  }
}

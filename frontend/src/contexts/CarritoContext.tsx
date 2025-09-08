'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { visualizarCarrito } from '@/services/carritoService'
import type { ItemPedidoDTO } from '@/types/carrito'

interface CarritoState {
  items: ItemPedidoDTO[]
  costoEnvio: number
  distancia: number
  tiempo: number
  subtotalTotal: number
  direccionEntrega: string
  loading: boolean
  error: string | null
}

interface CarritoContextType {
  carrito: CarritoState
  refreshCarrito: () => Promise<void>
  getTotalItems: () => number
  getSubtotalItems: () => number
}

const initialState: CarritoState = {
  items: [],
  costoEnvio: 0,
  distancia: 0,
  tiempo: 0,
  subtotalTotal: 0,
  direccionEntrega: '',
  loading: false,
  error: null
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined)

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useState<CarritoState>(initialState)

  const refreshCarrito = useCallback(async () => {
    setCarrito(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await visualizarCarrito()
      
      if (response.resultado.status === 0) {
        setCarrito({
          items: response.items || [],
          costoEnvio: response.costoEnvio || 0,
          distancia: response.distancia || 0,
          tiempo: response.tiempo || 0,
          subtotalTotal: response.subtotalTotal || 0,
          direccionEntrega: response.direccionEntrega || '',
          loading: false,
          error: null
        })
      } else {
        // Carrito vacío o no encontrado
        setCarrito({
          ...initialState,
          loading: false,
          error: null // No mostrar error para carrito vacío
        })
      }
    } catch (error) {
      setCarrito(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error al cargar el carrito'
      }))
    }
  }, [])

  const getTotalItems = useCallback(() => {
    return carrito.items.reduce((total, item) => total + item.cantidad, 0)
  }, [carrito.items])

  const getSubtotalItems = useCallback(() => {
    return carrito.items.reduce((total, item) => total + item.subtotal, 0)
  }, [carrito.items])

  const value = {
    carrito,
    refreshCarrito,
    getTotalItems,
    getSubtotalItems
  }

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  )
}

export function useCarrito() {
  const context = useContext(CarritoContext)
  if (context === undefined) {
    throw new Error('useCarrito must be used within a CarritoProvider')
  }
  return context
}

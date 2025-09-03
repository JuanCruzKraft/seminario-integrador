import { useState, useEffect } from 'react'

interface CarritoItem {
  id: number
  nombre: string
  precio: number
  cantidad: number
}

interface Carrito {
  items: CarritoItem[]
  total: number
}

export const useCarrito = () => {
  const [carrito, setCarrito] = useState<Carrito>({ items: [], total: 0 })

  const calcularTotal = (items: CarritoItem[]) => {
    return items.reduce((total, item) => total + (item.precio * item.cantidad), 0)
  }

  const actualizarCarrito = (nuevosItems: CarritoItem[]) => {
    const nuevoCarrito = {
      items: nuevosItems,
      total: calcularTotal(nuevosItems)
    }
    setCarrito(nuevoCarrito)
  }

  return {
    carrito,
    setCarrito: actualizarCarrito
  }
}
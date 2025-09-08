'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useCarrito } from '@/contexts/CarritoContext'

interface CarritoDropdownProps {
  className?: string
}

export default function CarritoDropdown({ className = '' }: CarritoDropdownProps) {
  const { carrito, getTotalItems, getSubtotalItems } = useCarrito()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const totalItems = getTotalItems()
  const subtotalItems = getSubtotalItems()

  const handleVerDetalle = () => {
    setIsOpen(false)
    router.push('/carrito')
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Botón del carrito */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 4m1.8-4L10 17m4 0h6m-6 0a2 2 0 11-4 0m4 0a2 2 0 104 0" />
        </svg>
        
        {/* Badge con número de items */}
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
        
        <span className="ml-2 font-medium">Carrito</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Tu Carrito</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {carrito.loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : carrito.error && carrito.items.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🛒</div>
                <p className="text-gray-500 text-sm">Tu carrito está vacío</p>
              </div>
            ) : carrito.items.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🛒</div>
                <p className="text-gray-500 text-sm">Tu carrito está vacío</p>
              </div>
            ) : (
              <>
                {/* Lista de items */}
                <div className="max-h-64 overflow-y-auto">
                  {carrito.items.map((item) => (
                    <div key={item.itemPedidoId || item.itemMenuId} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.nombre}
                        </h4>
                        <p className="text-xs text-gray-500">
                          ${item.precioUnitario.toFixed(2)} x {item.cantidad}
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        ${item.subtotal.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal */}
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal productos:</span>
                    <span className="font-semibold text-gray-900">
                      ${subtotalItems.toFixed(2)}
                    </span>
                  </div>
                  {carrito.costoEnvio > 0 && (
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-600">Costo de envío:</span>
                      <span className="font-semibold text-gray-900">
                        ${carrito.costoEnvio.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-base font-semibold border-t border-gray-200 pt-2 mt-2">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-indigo-600">
                      ${carrito.subtotalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Botón ver detalle */}
                <button
                  onClick={handleVerDetalle}
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Ver carrito en detalle
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { useCarrito } from '@/contexts/CarritoContext'
import { eliminarCarrito, modificarCantidadItem, eliminarItem } from '@/services/carritoService'
import type { ItemPedidoDTO } from '@/types/carrito'

export default function CarritoPage() {
  const { user, loading, isAuthenticated } = useAuth()
  const { carrito, refreshCarrito } = useCarrito()
  const router = useRouter()
  
  const [eliminandoCarrito, setEliminandoCarrito] = useState(false)
  const [confirmandoCarrito, setConfirmandoCarrito] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      refreshCarrito()
    }
  }, [isAuthenticated, refreshCarrito])

  const handleEliminarCarrito = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar todo el carrito?')) {
      return
    }

    setEliminandoCarrito(true)
    setError(null)

    try {
      const response = await eliminarCarrito()
      
      if (response.resultado.status === 0) {
        setSuccess('Carrito eliminado exitosamente')
        await refreshCarrito()
        setTimeout(() => {
          router.push('/vendedores')
        }, 2000)
      } else {
        setError(response.resultado.mensaje || 'No se pudo eliminar el carrito')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el carrito')
    } finally {
      setEliminandoCarrito(false)
    }
  }

  const handleConfirmarCarrito = async () => {
    // Redirect to payment page instead of processing immediately
    router.push('/pago')
  }

  const handleModificarCantidad = async (item: ItemPedidoDTO, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      await handleEliminarItem(item);
      return;
    }

    setError(null);
    
    try {
      const response = await modificarCantidadItem({
        itemPedidoId: item.itemPedidoId,
        itemMenuId: item.itemMenuId,
        nuevaCantidad: nuevaCantidad
      });
      
      if (response.resultado.status === 0) {
        setSuccess('Cantidad modificada exitosamente');
        await refreshCarrito();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.resultado.mensaje || 'No se pudo modificar la cantidad');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al modificar la cantidad');
    }
  }

  const handleEliminarItem = async (item: ItemPedidoDTO) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar "${item.nombre}" del carrito?`)) {
      return;
    }
    
    setError(null);
    
    try {
      const response = await eliminarItem({
        itemPedidoId: item.itemPedidoId
      });
      
      if (response.resultado.status === 0) {
        setSuccess('Producto eliminado del carrito');
        await refreshCarrito();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.resultado.mensaje || 'No se pudo eliminar el producto');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el producto');
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Logo en esquina superior izquierda */}
      <div className="fixed top-4 left-4 z-50">
        <Image
          src="/Logo.png"
          alt="Logo"
          width={50}
          height={50}
          className="object-contain opacity-80 hover:opacity-100 transition-opacity"
        />
      </div>

      {/* Header/Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/menu')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Seguir comprando
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Mi Carrito</h1>
            </div>
            <div className="flex items-center">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Bienvenido, {user?.nombre}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          </div>
        )}

        {/* Loading State */}
        {carrito.loading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando carrito...</p>
            </div>
          </div>
        ) : carrito.items.length === 0 ? (
          /* Empty State */
          <div className="bg-white shadow rounded-lg p-12">
            <div className="text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-gray-500 mb-6">
                Agrega algunos productos para continuar con tu pedido.
              </p>
              <button
                onClick={() => router.push('/vendedores')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                Explorar Vendedores
              </button>
            </div>
          </div>
        ) : (
          /* Cart Content */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items del carrito */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Productos en tu carrito ({carrito.items.length})
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {carrito.items.map((item) => (
                    <div key={item.itemPedidoId || item.itemMenuId} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {item.nombre}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Precio unitario: ${item.precioUnitario.toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="ml-4 text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            ${item.subtotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      {/* Controles de cantidad */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <label className="text-sm font-medium text-gray-700 mr-4">
                            Cantidad:
                          </label>
                          <div className="flex items-center border rounded-md">
                            <button
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-l-md"
                              onClick={() => handleModificarCantidad(item, item.cantidad - 1)}
                              disabled={item.cantidad <= 1}
                            >
                              -
                            </button>
                            <span className="px-4 py-1 bg-white border-l border-r">
                              {item.cantidad}
                            </span>
                            <button
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-r-md"
                              onClick={() => handleModificarCantidad(item, item.cantidad + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        {/* Botón eliminar item */}
                        <button
                          onClick={() => handleEliminarItem(item)}
                          className="flex items-center text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Resumen del carrito */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg p-6 sticky top-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Resumen del pedido
                </h2>
                
                {/* Dirección de entrega */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Dirección de entrega:
                  </h3>
                  <p className="text-sm text-gray-600">
                    {carrito.direccionEntrega || 'No especificada'}
                  </p>
                </div>

                {/* Detalles del envío */}
                {carrito.distancia > 0 && (
                  <div className="mb-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distancia:</span>
                      <span className="text-gray-900">
                        {(carrito.distancia).toFixed(2)} km
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tiempo estimado:</span>
                      <span className="text-gray-900">{carrito.tiempo} min</span>
                    </div>
                  </div>
                )}

                {/* Totales */}
                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal productos:</span>
                    <span className="text-gray-900">
                      ${carrito.items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)}
                    </span>
                  </div>
                  
                  {carrito.costoEnvio > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Costo de envío:</span>
                      <span className="text-gray-900">${carrito.costoEnvio.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-indigo-600">${carrito.subtotalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleConfirmarCarrito}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Proceder al Pago
                  </button>
                  
                  <button
                    onClick={handleEliminarCarrito}
                    disabled={eliminandoCarrito}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                  >
                    {eliminandoCarrito ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Eliminando...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Eliminar Carrito
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

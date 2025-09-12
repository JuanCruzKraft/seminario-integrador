'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { pedidoService } from '@/services/pedidoService'
import { PedidoDTO } from '@/types/pedido'

export default function HistorialPage() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [pedidos, setPedidos] = useState<PedidoDTO[]>([])
  const [loadingPedidos, setLoadingPedidos] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedPedidos, setExpandedPedidos] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  // Cargar historial cuando el usuario esté autenticado
  useEffect(() => {
    if (isAuthenticated) {
      setLoadingPedidos(true)
      setError(null)
      pedidoService.verHistorialPedidos()
        .then(response => {
          // Independientemente del status, si hay pedidos los mostramos
          if (response.pedidos && Array.isArray(response.pedidos)) {
            setPedidos(response.pedidos)
          } else {
            // Si no hay pedidos, establecemos array vacío
            setPedidos([])
          }
          
          // Solo mostramos error si hay un problema real (no cuando simplemente no hay pedidos)
          if (response.resultado.status !== 0 && response.pedidos?.length === undefined) {
            setError(response.resultado.mensaje || 'Error al cargar el historial')
          }
        })
        .catch((error) => {
          console.error('Error al cargar historial de pedidos:', error)
          setError('No se pudo cargar el historial de pedidos.')
          setPedidos([])
        })
        .finally(() => setLoadingPedidos(false))
    }
  }, [isAuthenticated])

  const formatFecha = (fechaString: string) => {
    try {
      const fecha = new Date(fechaString)
      return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return fechaString
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'confirmado':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'en_preparacion':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'en_camino':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'entregado':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelado':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatEstado = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'confirmado':
        return 'Confirmado'
      case 'en_preparacion':
        return 'En Preparación'
      case 'en_camino':
        return 'En Camino'
      case 'entregado':
        return 'Entregado'
      case 'cancelado':
        return 'Cancelado'
      default:
        return estado
    }
  }

  const togglePedidoExpanded = (pedidoId: number) => {
    const newExpanded = new Set(expandedPedidos)
    if (newExpanded.has(pedidoId)) {
      newExpanded.delete(pedidoId)
    } else {
      newExpanded.add(pedidoId)
    }
    setExpandedPedidos(newExpanded)
  }

  // Mostrar loading mientras verificamos autenticación
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

  // Si no está autenticado, no mostrar nada (se redirige a login)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Historial de Pedidos
              </h1>
            </div>
            <div className="flex items-center">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{user?.nombre}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900">Tu Historial de Pedidos</h2>
                <p className="text-gray-600">Revisa todos tus pedidos anteriores</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white shadow rounded-lg">
          {/* Error Message */}
          {error && (
            <div className="m-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          <div className="p-6">
            {/* Loading State */}
            {loadingPedidos ? (
              <div className="flex justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando historial...</p>
                </div>
              </div>
            ) : pedidos.length === 0 && !error ? (
              /* Empty State */
              <div className="text-center py-16">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No tienes pedidos anteriores
                </h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Cuando realices tu primer pedido, aparecerá aquí. ¡Es un buen momento para comenzar a explorar los restaurantes disponibles!
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Hacer mi primer pedido
                </button>
              </div>
            ) : (
              /* Pedidos List */
              <div className="space-y-6">
                {pedidos.map((pedido) => {
                  const isExpanded = expandedPedidos.has(pedido.pedidoID)
                  return (
                    <div
                      key={pedido.pedidoID}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Header del pedido - Clickeable */}
                      <div 
                        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => togglePedidoExpanded(pedido.pedidoID)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-semibold text-gray-900">
                                Pedido #{pedido.pedidoID}
                              </h3>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getEstadoColor(pedido.estado)}`}>
                                {formatEstado(pedido.estado)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {formatFecha(pedido.fechaConfirmacion)}
                            </p>
                            <p className="text-sm font-medium text-gray-700 mt-1">
                              {pedido.nombreVendedor}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {pedido.items.length} item{pedido.items.length !== 1 ? 's' : ''} • Click para ver detalles
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">
                                ${pedido.precio.toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-500">
                                Total con envío
                              </p>
                            </div>
                            <div className="flex items-center">
                              <svg 
                                className={`w-5 h-5 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contenido expandible */}
                      {isExpanded && (
                        <div className="border-t border-gray-200">
                          {/* Items del pedido */}
                          <div className="p-6 bg-gray-50">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Items del pedido:</h4>
                            <div className="space-y-3">
                              {pedido.items.map((item, index) => (
                                <div 
                                  key={item.itemPedidoId || `item-${pedido.pedidoID}-${index}`} 
                                  className="flex justify-between items-center bg-white p-3 rounded-md"
                                >
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{item.nombre}</p>
                                    <p className="text-xs text-gray-500">
                                      ${item.precioUnitario.toFixed(2)} x {item.cantidad}
                                    </p>
                                  </div>
                                  <p className="text-sm font-medium text-gray-900">
                                    ${item.subtotal.toFixed(2)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Resumen de costos */}
                          <div className="p-6 bg-white border-t border-gray-200">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal items:</span>
                                <span className="text-gray-900">${pedido.subtotalItems.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Costo de envío:</span>
                                <span className="text-gray-900">${Number(pedido.costoEnvio).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-base font-semibold border-t border-gray-200 pt-2">
                                <span className="text-gray-900">Total:</span>
                                <span className="text-gray-900">${pedido.precio.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Stats Footer */}
            {pedidos.length > 0 && (
              <div className="mt-8 text-center border-t border-gray-200 pt-6">
                <p className="text-gray-500">
                  {pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''} en tu historial
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

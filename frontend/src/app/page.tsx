'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { useCarrito } from '@/contexts/CarritoContext'
import { getVendedores } from '@/services/vendedorService'
import { pedidoService } from '@/services/pedidoService'
import { VendedorDTO } from '@/types/vendedor'
import { PedidoDTO } from '@/types/pedido'

export default function Home() {
  const { user, loading, logout, isAuthenticated } = useAuth()
  const { getTotalItems, refreshCarrito } = useCarrito()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [pedidosEnCurso, setPedidosEnCurso] = useState<PedidoDTO[]>([])
  const [loadingPedidos, setLoadingPedidos] = useState(false)
  const [pedidosError, setPedidosError] = useState<string | null>(null)
  const [expandedPedidos, setExpandedPedidos] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  // Cargar carrito cuando el usuario esté autenticado
  useEffect(() => {
    if (isAuthenticated) {
      refreshCarrito()
    }
  }, [isAuthenticated, refreshCarrito])

  // Cargar pedidos en curso cuando el usuario esté autenticado
  useEffect(() => {
    if (isAuthenticated) {
      setLoadingPedidos(true)
      setPedidosError(null)
      pedidoService.verPedidosEnCurso()
        .then(response => {
          // Independientemente del status, si hay pedidos los mostramos
          if (response.pedidos && Array.isArray(response.pedidos)) {
            setPedidosEnCurso(response.pedidos)
          } else {
            // Si no hay pedidos, establecemos array vacío
            setPedidosEnCurso([])
          }
          
          // Solo mostramos error si hay un problema real (no cuando simplemente no hay pedidos)
          if (response.resultado.status !== 0 && response.pedidos?.length === undefined) {
            setPedidosError(response.resultado.mensaje || 'Error al cargar pedidos en curso')
          }
        })
        .catch((error) => {
          console.error('Error al cargar pedidos en curso:', error)
          setPedidosError('No se pudieron cargar los pedidos en curso.')
          setPedidosEnCurso([])
        })
        .finally(() => setLoadingPedidos(false))
    }
  }, [isAuthenticated])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleProfile = () => {
    router.push('/perfil')
    setDropdownOpen(false)
  }

  const handleVendedores = () => {  
    router.push('/vendedores')
  }

  const handleHistorial = () => {
    router.push('/historial')
  }

  const handleVerMenu = (vendedor: VendedorDTO) => {
    router.push(`/menu?vendedorId=${vendedor.vendedorId}&vendedorNombre=${encodeURIComponent(vendedor.nombre)}`)
  }

  const handleVerCarrito = () => {
    router.push('/carrito')
  }

  const handleVerPedido = (pedidoId: number) => {
    router.push(`/pago/resumen?pedidoId=${pedidoId}`)
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

  const formatFecha = (fechaString: string) => {
    try {
      const fecha = new Date(fechaString)
      return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
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

  const totalItemsCarrito = getTotalItems()

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('user-dropdown')
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

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

  // Usuario autenticado - mostrar dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Image
                src="/logo_fixed.png"
                alt="SantaFOOD"
                width={100}
                height={28}
                className="object-contain mr-3"
              />
              <h1 className="text-xl font-bold text-gray-900">
                SantaFood
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Bienvenido, {user?.nombre}</span>
                <span className="ml-2 text-xs text-gray-400">
                  ID: {user?.username}
                </span>
              </div>
              
              {/* Dropdown del usuario */}
              <div className="relative" id="user-dropdown">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <div className="h-6 w-6 bg-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold">
                      {user?.nombre?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span>Mi Cuenta</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Menú desplegable */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <button
                      onClick={handleProfile}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Ver Perfil
                    </button>
                    
                    <div className="border-t border-gray-100 my-1"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Cerrar Sesión
                    </button>
                  </div>
                )}
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
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {user?.nombre?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-900">¡Hola, {user?.nombre}!</h2>
                  <p className="text-gray-600">Explora los restaurantes disponibles y realiza tu pedido</p>
                </div>
              </div>
              {user?.direccion && (
                <div className="text-right">
                  <p className="text-sm text-gray-500">Tu dirección:</p>
                  <p className="text-sm font-medium text-gray-900">{user.direccion}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <button
            onClick={handleVendedores}
             className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
          >
          {/* <div className="bg-white overflow-hidden shadow rounded-lg"> */}
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white">🏪</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">
                    Ver Restaurantes
                  </p>
                  <p className="text-sm text-gray-500">Explora y haz un nuevo pedido</p>
                </div>
                      <div className="ml-auto">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          {/* </div> */}
          </button>

          <button
            onClick={handleHistorial}
            className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white">�</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">
                    Historial de Pedidos
                  </p>
                  <p className="text-sm text-gray-500">Revisa todos tus pedidos anteriores</p>
                </div>
                <div className="ml-auto">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={handleVerCarrito}
            className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white">🛒</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">{totalItemsCarrito} Item(s) en carrito</p>
                  <p className="text-sm text-gray-500">Visualizá tu carrito</p>
                </div>
                <div className="ml-auto">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="mt-3">
                {/* <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Ver carrito →
                </span> */}
              </div>
            </div>
          </button>
        </div>

        {/* Sección de Pedidos en Curso */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Pedidos en Curso</h2>
            <p className="text-sm text-gray-500">
              Seguí el estado de tus pedidos actuales
            </p>
          </div>

          {/* Error Message */}
          {pedidosError && (
            <div className="m-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {pedidosError}
              </div>
            </div>
          )}

          <div className="p-6">
            {/* Loading State */}
            {loadingPedidos ? (
              <div className="flex justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando pedidos...</p>
                </div>
              </div>
            ) : pedidosEnCurso.length === 0 && !pedidosError ? (
              /* Empty State */
              <div className="text-center py-16">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No tienes pedidos en curso
                </h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  ¡Es un buen momento para pedir algo delicioso! Explora los restaurantes disponibles y encuentra tu comida favorita.
                </p>
                <button
                  onClick={handleVendedores}
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7 7-7" />
                  </svg>
                  Explorar Vendedores
                </button>
              </div>
            ) : (
              /* Pedidos List */
              <div className="space-y-4">
                {pedidosEnCurso.map((pedido) => {
                  const isExpanded = expandedPedidos.has(pedido.pedidoID)
                  return (
                    <div
                      key={pedido.pedidoID}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Header del pedido - Clickeable */}
                      <div 
                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => togglePedidoExpanded(pedido.pedidoID)}
                      >
                        <div className="flex items-center justify-between">
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
                              {formatFecha(pedido.fechaConfirmacion)} • {pedido.nombreVendedor}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {pedido.items.length} item{pedido.items.length !== 1 ? 's' : ''} • Click para detalles
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">
                                ${pedido.precio.toFixed(2)}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleVerPedido(pedido.pedidoID)
                              }}
                              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded transition-colors"
                            >
                              Ver Seguimiento
                            </button>
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
                        <div className="border-t border-gray-200 bg-gray-50 p-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Items del pedido:</h4>
                          <div className="space-y-2">
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
                          
                          <div className="mt-4 pt-3 border-t border-gray-200">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Subtotal:</span>
                              <span className="text-gray-900">${pedido.subtotalItems.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Envío:</span>
                              <span className="text-gray-900">${Number(pedido.costoEnvio).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-base font-semibold border-t border-gray-200 pt-2 mt-2">
                              <span className="text-gray-900">Total:</span>
                              <span className="text-gray-900">${pedido.precio.toFixed(2)}</span>
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
            {pedidosEnCurso.length > 0 && (
              <div className="mt-6 text-center">
                <p className="text-gray-500">
                  {pedidosEnCurso.length} pedido{pedidosEnCurso.length !== 1 ? 's' : ''} en curso
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { getVendedores } from '@/services/vendedorService'
import { VendedorDTO } from '@/types/vendedor'

export default function Home() {
  const { user, loading, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [vendedores, setVendedores] = useState<VendedorDTO[]>([])
  const [loadingVendedores, setLoadingVendedores] = useState(false)
  const [vendedoresError, setVendedoresError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  // Cargar vendedores cuando el usuario esté autenticado y tenga coordenadas
  useEffect(() => {
    if (isAuthenticated && user?.coordenadas) {
      setLoadingVendedores(true)
      setVendedoresError(null)
      getVendedores(user.coordenadas.latitud, user.coordenadas.longitud)
        .then(setVendedores)
        .catch(() => setVendedoresError('No se pudieron cargar los vendedores.'))
        .finally(() => setLoadingVendedores(false))
    } else if (isAuthenticated && !user?.coordenadas) {
      setVendedoresError('Para ver los vendedores disponibles, necesitas configurar tu dirección.')
    }
  }, [isAuthenticated, user])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleProfile = () => {
    router.push('/perfil')
    setDropdownOpen(false)
  }

  const handleVerMenu = (vendedor: VendedorDTO) => {
    router.push(`/menu?vendedorId=${vendedor.vendedorId}&vendedorNombre=${encodeURIComponent(vendedor.nombre)}`)
  }

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
              <h1 className="text-xl font-semibold text-gray-900">
                Sistema de Pedidos
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
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white">🏪</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">
                    {loadingVendedores ? '...' : vendedores.length}
                  </p>
                  <p className="text-sm text-gray-500">Vendedores disponibles</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white">📍</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">
                    {user?.coordenadas ? '✓' : '✗'}
                  </p>
                  <p className="text-sm text-gray-500">Dirección configurada</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white">🛒</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">0</p>
                  <p className="text-sm text-gray-500">Items en carrito</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Vendedores */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Restaurantes Disponibles</h2>
            <p className="text-sm text-gray-500">
              Explora los restaurantes cerca de ti y sus datos de envío
            </p>
          </div>

          {/* Error Message */}
          {vendedoresError && (
            <div className="m-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {vendedoresError}
                {!user?.coordenadas && (
                  <button
                    onClick={() => router.push('/establecer-direccion')}
                    className="ml-3 text-red-800 underline hover:text-red-900"
                  >
                    Configurar ahora
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="p-6">
            {/* Loading State */}
            {loadingVendedores ? (
              <div className="flex justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando restaurantes...</p>
                </div>
              </div>
            ) : vendedores.length === 0 && !vendedoresError ? (
              /* Empty State */
              <div className="text-center py-12">
                <div className="text-6xl mb-4">�️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay vendedores disponibles
                </h3>
                <p className="text-gray-500 mb-6">
                  Por el momento no hay restaurantes disponibles en tu zona.
                </p>
              </div>
            ) : (
              /* Vendedores Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendedores.map((vendedor) => (
                  <div
                    key={vendedor.vendedorId}
                    className="bg-white overflow-hidden border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-semibold text-lg">
                              {vendedor.nombre.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {vendedor.nombre}
                            </h3>
                            {vendedor.direccion && (
                              <p className="text-sm text-gray-500">
                                {vendedor.direccion}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Datos Logísticos */}
                      {vendedor.datosLogisticos && (
                        <div className="mb-4 space-y-2">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="bg-green-50 p-2 rounded">
                              <div className="flex items-center">
                                <span className="text-green-600 mr-1">📍</span>
                                <div>
                                  <p className="font-medium text-green-800">Distancia</p>
                                  <p className="text-green-600">
                                    {vendedor.datosLogisticos.distancia.toFixed(1)} km
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-blue-50 p-2 rounded">
                              <div className="flex items-center">
                                <span className="text-blue-600 mr-1">⏱️</span>
                                <div>
                                  <p className="font-medium text-blue-800">Tiempo</p>
                                  <p className="text-blue-600">
                                    {vendedor.datosLogisticos.tiempoEstimado} min
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-orange-50 p-2 rounded col-span-2">
                              <div className="flex items-center">
                                <span className="text-orange-600 mr-1">💰</span>
                                <div>
                                  <p className="font-medium text-orange-800">Costo de Envío</p>
                                  <p className="text-orange-600 font-bold">
                                    ${vendedor.datosLogisticos.costoEnvio.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <button
                          onClick={() => handleVerMenu(vendedor)}
                          className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Ver Menú
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stats Footer */}
            {vendedores.length > 0 && (
              <div className="mt-8 text-center">
                <p className="text-gray-500">
                  ¡{vendedores.length} restaurante{vendedores.length !== 1 ? 's' : ''} disponible{vendedores.length !== 1 ? 's' : ''} en tu zona!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
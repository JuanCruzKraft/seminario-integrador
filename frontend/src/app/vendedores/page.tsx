'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useCarrito } from '@/contexts/CarritoContext'
import { getVendedores } from '@/services/vendedorService'
import CarritoDropdown from '@/components/CarritoDropdown'
import { VendedorDTO } from '@/types/vendedor'

export default function VendedoresPage() {
  const { user, loading, isAuthenticated } = useAuth()
  const { refreshCarrito } = useCarrito()
  const router = useRouter()
  const [vendedores, setVendedores] = useState<VendedorDTO[]>([])
  const [loadingVendedores, setLoadingVendedores] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      setLoadingVendedores(true)
      getVendedores()
        .then(setVendedores)
        .catch(() => setError('No se pudieron cargar los vendedores.'))
        .finally(() => setLoadingVendedores(false))
    }
  }, [isAuthenticated])

  // Cargar carrito cuando se autentica el usuario
  useEffect(() => {
    if (isAuthenticated) {
      refreshCarrito()
    }
  }, [isAuthenticated, refreshCarrito])

  const handleVerMenu = (vendedor: VendedorDTO) => {
    router.push(`/menu?vendedorId=${vendedor.vendedorId}&vendedorNombre=${encodeURIComponent(vendedor.nombre)}`)
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
      {/* Header/Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Vendedores Disponibles
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <CarritoDropdown />
              <div className="text-sm text-gray-600">
                <span className="font-medium">Bienvenido, {user?.nombre}</span>
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
              <div className="h-12 w-12 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🏪</span>
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900">Explora Vendedores</h2>
                <p className="text-gray-600">Descubre los mejores restaurantes y sus deliciosos menús</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
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

        {/* Loading State */}
        {loadingVendedores ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando vendedores...</p>
            </div>
          </div>
        ) : vendedores.length === 0 ? (
          /* Empty State */
          <div className="bg-white shadow rounded-lg p-12">
            <div className="text-center">
              <div className="text-6xl mb-4">
                {!user?.coordenadas ? '📍' : '🍽️'}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {!user?.coordenadas 
                  ? 'Configura tu dirección' 
                  : 'No hay vendedores disponibles'
                }
              </h3>
              <p className="text-gray-500 mb-6">
                {!user?.coordenadas 
                  ? 'Para ver los vendedores disponibles y calcular costos de envío, necesitas configurar tu dirección.' 
                  : 'Por el momento no hay restaurantes disponibles en tu zona.'
                }
              </p>
              <button
                onClick={() => router.push(!user?.coordenadas ? '/establecer-direccion' : '/')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                {!user?.coordenadas ? 'Configurar Dirección' : 'Volver al Dashboard'}
              </button>
            </div>
          </div>
        ) : (
          /* Vendedores Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendedores.map((vendedor) => (
              <div
                key={vendedor.vendedorId}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
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

        {/* Stats Section */}
        {vendedores.length > 0 && (
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ¡{vendedores.length} vendedores disponibles!
              </h3>
              <p className="text-gray-500">
                Explora sus menús y encuentra tu comida favorita
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
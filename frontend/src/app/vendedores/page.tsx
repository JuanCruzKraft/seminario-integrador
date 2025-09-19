'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useCarrito } from '@/contexts/CarritoContext'
import { getVendedores, buscarVendedoresPorComida, buscarVendedoresPorNombre as buscarVendedoresPorNombreService } from '@/services/vendedorService'
import CarritoDropdown from '@/components/CarritoDropdown'
import { VendedorDTO } from '@/types/vendedor'

export default function VendedoresPage() {
  const { user, loading, isAuthenticated } = useAuth()
  const { refreshCarrito } = useCarrito()
  const router = useRouter()
  const [vendedores, setVendedores] = useState<VendedorDTO[]>([])
  const [loadingVendedores, setLoadingVendedores] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [busquedaNombre, setBusquedaNombre] = useState('')
  const [modoLista, setModoLista] = useState<'todos' | 'busqueda' | 'busqueda-nombre'>('todos')
  const [mostrarBusquedaComida, setMostrarBusquedaComida] = useState(false)
  const [mostrarBusquedaNombre, setMostrarBusquedaNombre] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      cargarTodosLosVendedores()
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

  const cargarTodosLosVendedores = async () => {
    setLoadingVendedores(true)
    setError(null)
    try {
      const vendedoresData = await getVendedores()
      setVendedores(vendedoresData)
      setModoLista('todos')
    } catch (error) {
      setError('No se pudieron cargar los vendedores.')
    } finally {
      setLoadingVendedores(false)
    }
  }

  const buscarVendedores = async () => {
    if (!busqueda.trim()) {
      cargarTodosLosVendedores()
      return
    }

    setLoadingVendedores(true)
    setError(null)
    try {
      const vendedoresData = await buscarVendedoresPorComida(busqueda.trim())
      setVendedores(vendedoresData)
      setModoLista('busqueda')
    } catch (error) {
      setError('No se pudieron buscar los vendedores.')
    } finally {
      setLoadingVendedores(false)
    }
  }

  const buscarVendedoresPorNombre = async () => {
    if (!busquedaNombre.trim()) {
      cargarTodosLosVendedores()
      return
    }

    setLoadingVendedores(true)
    setError(null)
    try {
      const vendedoresData = await buscarVendedoresPorNombreService(busquedaNombre.trim())
      setVendedores(vendedoresData)
      setModoLista('busqueda-nombre')
    } catch (error) {
      setError('No se pudieron buscar los vendedores por nombre.')
    } finally {
      setLoadingVendedores(false)
    }
  }

  const limpiarBusqueda = () => {
    setBusqueda('')
    setBusquedaNombre('')
    setMostrarBusquedaComida(false)
    setMostrarBusquedaNombre(false)
    cargarTodosLosVendedores()
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
              {/* Logo en esquina izquierda de la barra */}
              <div className="mr-6">
                <img
                  src="/logo_fixed.png"
                  alt="Logo"
                  width={90}
                  height={25}
                  className="object-contain"
                />
              </div>
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

        {/* Sección de Búsqueda */}
        <div className="mb-8 space-y-4">
          {/* Botones de tipo de búsqueda */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">¿Cómo quieres buscar?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Búsqueda por comida */}
              <button
                onClick={() => {
                  setMostrarBusquedaComida(!mostrarBusquedaComida)
                  setMostrarBusquedaNombre(false)
                  if (mostrarBusquedaComida) {
                    setBusqueda('')
                    if (modoLista === 'busqueda') cargarTodosLosVendedores()
                  }
                }}
                className={`p-4 border-2 rounded-lg transition-all hover:shadow-md ${
                  mostrarBusquedaComida 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 text-xl">🍕</span>
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900">¿Qué quieres pedir?</h4>
                    <p className="text-sm text-gray-500">Busca por tipo de producto</p>
                  </div>
                </div>
              </button>

              {/* Búsqueda por nombre de local */}
              <button
                onClick={() => {
                  setMostrarBusquedaNombre(!mostrarBusquedaNombre)
                  setMostrarBusquedaComida(false)
                  if (mostrarBusquedaNombre) {
                    setBusquedaNombre('')
                    if (modoLista === 'busqueda-nombre') cargarTodosLosVendedores()
                  }
                }}
                className={`p-4 border-2 rounded-lg transition-all hover:shadow-md ${
                  mostrarBusquedaNombre 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-xl">🏪</span>
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900">Buscar por local</h4>
                    <p className="text-sm text-gray-500">Busca por nombre del restaurante</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Botón para limpiar búsqueda si está en modo búsqueda */}
            {(modoLista === 'busqueda' || modoLista === 'busqueda-nombre') && (
              <div className="mt-4 text-center">
                <button
                  onClick={limpiarBusqueda}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Ver todos los vendedores
                </button>
              </div>
            )}
          </div>

          {/* Campo de búsqueda por comida */}
          {mostrarBusquedaComida && (
            <div className="bg-white shadow rounded-lg p-6 border-l-4 border-orange-500">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Buscar por producto</h4>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Ej: pizza, hamburguesa, sushi..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && buscarVendedores()}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <button
                  onClick={buscarVendedores}
                  disabled={loadingVendedores}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loadingVendedores ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                  <span>Buscar</span>
                </button>
              </div>
              {modoLista === 'busqueda' && busqueda && (
                <div className="mt-3 text-sm text-gray-600">
                  Mostrando vendedores que ofrecen "{busqueda}" en su menú
                </div>
              )}
            </div>
          )}

          {/* Campo de búsqueda por nombre de local */}
          {mostrarBusquedaNombre && (
            <div className="bg-white shadow rounded-lg p-6 border-l-4 border-purple-500">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Buscar por nombre de local</h4>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Ej: McDonald's, Burger King, La Parolaccia..."
                    value={busquedaNombre}
                    onChange={(e) => setBusquedaNombre(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && buscarVendedoresPorNombre()}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <button
                  onClick={buscarVendedoresPorNombre}
                  disabled={loadingVendedores}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loadingVendedores ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                  <span>Buscar</span>
                </button>
              </div>
              {modoLista === 'busqueda-nombre' && busquedaNombre && (
                <div className="mt-3 text-sm text-gray-600">
                  Mostrando coincidencia de vendedores con nombre: "{busquedaNombre}"
                </div>
              )}
            </div>
          )}
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
                {modoLista === 'busqueda' ? '🔍' : 
                 modoLista === 'busqueda-nombre' ? '🏪' : 
                 (!user?.coordenadas ? '📍' : '🍽️')}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {modoLista === 'busqueda' 
                  ? 'No se encontraron vendedores' 
                  : modoLista === 'busqueda-nombre'
                  ? 'No se encontraron locales'
                  : (!user?.coordenadas 
                    ? 'Configura tu dirección' 
                    : 'No hay vendedores disponibles'
                  )
                }
              </h3>
              <p className="text-gray-500 mb-6">
                {modoLista === 'busqueda' 
                  ? `No hay vendedores que vendan "${busqueda}" en su menú. Intenta con otra búsqueda.`
                  : modoLista === 'busqueda-nombre'
                  ? `No hay locales que se llamen "${busquedaNombre}". Intenta con otro nombre.`
                  : (!user?.coordenadas 
                    ? 'Para ver los vendedores disponibles y calcular costos de envío, necesitas configurar tu dirección.' 
                    : 'Por el momento no hay restaurantes disponibles en tu zona.'
                  )
                }
              </p>
              <button
                onClick={() => router.push(!user?.coordenadas ? '/establecer-direccion' : '/')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium transition-colors mr-4"
              >
                {!user?.coordenadas ? 'Configurar Dirección' : 'Volver al Dashboard'}
              </button>
              {(modoLista === 'busqueda' || modoLista === 'busqueda-nombre') && (
                <button
                  onClick={limpiarBusqueda}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Ver todos los vendedores
                </button>
              )}
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
                        {/* Calificación promedio */}
                        {vendedor.calificacionPromedio && vendedor.cantidadCalificaciones && (
                          <div className="flex items-center mt-1">
                            <div className="flex items-center text-yellow-400">
                              {/* Renderizar estrellas basado en la calificación */}
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.round(vendedor.calificacionPromedio!) 
                                      ? 'text-yellow-400' 
                                      : 'text-gray-300'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                              ))}
                            </div>
                            <span className="ml-1 text-sm text-gray-600">
                              {vendedor.calificacionPromedio.toFixed(1)} ({vendedor.cantidadCalificaciones} reseña{vendedor.cantidadCalificaciones !== 1 ? 's' : ''})
                            </span>
                          </div>
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
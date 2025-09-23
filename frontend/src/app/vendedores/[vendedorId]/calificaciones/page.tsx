'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { VendedorService } from '@/services/vendedorService'
import type { VisualizarCalificacionVendedorResponse, CalificacionDTO } from '@/types/vendedor'

export default function CalificacionesVendedorPage() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const vendedorId = parseInt(params.vendedorId as string)

  const [calificacionesData, setCalificacionesData] = useState<VisualizarCalificacionVendedorResponse | null>(null)
  const [loadingCalificaciones, setLoadingCalificaciones] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated && vendedorId) {
      setLoadingCalificaciones(true)
      setError(null)
      
      VendedorService.obtenerCalificaciones(vendedorId)
        .then(data => {
          if (data.resultado.status === 0) {
            setCalificacionesData(data)
          } else {
            setError(data.resultado.mensaje || 'No se pudieron cargar las calificaciones')
          }
        })
        .catch((error) => {
          console.error('Error al cargar calificaciones:', error)
          setError('No se pudieron cargar las calificaciones del vendedor')
        })
        .finally(() => setLoadingCalificaciones(false))
    }
  }, [isAuthenticated, vendedorId])

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ))
  }

  const getCalificacionTexto = (rating: number) => {
    switch (rating) {
      case 1: return 'Muy malo'
      case 2: return 'Malo'
      case 3: return 'Regular'
      case 4: return 'Bueno'
      case 5: return 'Excelente'
      default: return ''
    }
  }

  const getDistribucionEstrellas = (calificaciones: CalificacionDTO[]) => {
    const distribucion = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    calificaciones.forEach(cal => {
      distribucion[cal.puntaje as keyof typeof distribucion]++
    })
    return distribucion
  }

  // Loading state
  if (loading || loadingCalificaciones) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {loading ? 'Verificando autenticación...' : 'Cargando calificaciones...'}
          </p>
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
      <div className="fixed top-3 left-3 z-50">
        <Image
          src="/logo_fixed.png"
          alt="Logo"
          width={80}
          height={22}
          className="object-contain opacity-80 hover:opacity-100 transition-opacity"
        />
      </div>

      {/* Header/Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Reseñas de {calificacionesData?.nombreVendedor || 'Vendedor'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Bienvenido, {user?.nombre}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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

        {calificacionesData ? (
          <div className="space-y-6">
            {/* Resumen de calificaciones */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-6 lg:mb-0">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {calificacionesData.nombreVendedor}
                  </h2>
                  <div className="flex items-center">
                    <div className="flex items-center mr-4">
                      {renderStars(Math.round(calificacionesData.calificacionPromedio))}
                    </div>
                    <span className="text-3xl font-bold text-gray-900 mr-2">
                      {calificacionesData.calificacionPromedio.toFixed(1)}
                    </span>
                    <span className="text-black">
                      ({calificacionesData.cantidadCalificaciones} reseña{calificacionesData.cantidadCalificaciones !== 1 ? 's' : ''})
                    </span>
                  </div>
                </div>

                {/* Distribución de estrellas */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Distribución de calificaciones</h3>
                  {Object.entries(getDistribucionEstrellas(calificacionesData.calificaciones))
                    .reverse()
                    .map(([estrella, cantidad]) => (
                      <div key={estrella} className="flex items-center mb-1 text-gray-900">
                        <span className="text-sm w-6">{estrella}</span>
                        <svg className="w-4 h-4 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{
                              width: `${(cantidad / calificacionesData.cantidadCalificaciones) * 100}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8">{cantidad}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Lista de calificaciones */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Todas las reseñas ({calificacionesData.calificaciones.length})
                </h3>
              </div>
              
              {calificacionesData.calificaciones.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {calificacionesData.calificaciones.map((calificacion, index) => (
                    <div key={calificacion.id || index} className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-semibold text-sm">
                              {calificacion.nombreCliente.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-gray-900">
                              {calificacion.nombreCliente}
                            </h4>
                            <div className="flex items-center">
                              {renderStars(calificacion.puntaje)}
                              <span className="ml-2 text-sm text-gray-600">
                                {getCalificacionTexto(calificacion.puntaje)}
                              </span>
                            </div>
                          </div>
                          {calificacion.comentario && (
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {calificacion.comentario}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">⭐</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aún no hay reseñas
                  </h3>
                  <p className="text-gray-500">
                    Este vendedor aún no ha recibido calificaciones.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          !error && (
            <div className="bg-white shadow rounded-lg p-12">
              <div className="text-center">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Cargando calificaciones...
                </h3>
              </div>
            </div>
          )
        )}
      </main>
    </div>
  )
}
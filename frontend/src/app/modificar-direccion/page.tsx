'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import AddressAutocomplete from '@/app/establecer-direccion/AddressAutocomplete'

export default function ModificarDireccionPage() {
  const { user, loading, isAuthenticated, updateUser } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedAddress, setSelectedAddress] = useState<string>('')
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Determinar desde dónde viene el usuario
  const fromPage = searchParams?.get('from') || 'modificar-perfil'

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  const handleAddressSelect = (address: string, coords: { lat: number; lng: number }) => {
    setSelectedAddress(address)
    setCoordinates(coords)
    setError(null)
  }

  const handleSubmit = async () => {
    if (!selectedAddress || !coordinates) {
      setError('Por favor, selecciona una dirección válida')
      return
    }

    setIsSubmitting(true)
    try {
      // Preparar los datos a enviar
      const updateData = {
        direccion: selectedAddress,
        coordenadas: {
          latitud: coordinates.lat,
          longitud: coordinates.lng
        }
      }

      console.log('Actualizando dirección:', updateData)

      // Aquí harías la llamada a la API
      // await ApiService.put(API_ENDPOINTS.ACTUALIZAR_DIRECCION_CLIENTE, updateData)

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Actualizar el contexto de usuario
      if (user) {
        const updatedUser = {
          ...user,
          direccion: selectedAddress,
          coordenadas: {
            latitud: coordinates.lat,
            longitud: coordinates.lng
          }
        }
        updateUser(updatedUser)
      }

      // Redireccionar según desde dónde vino
      if (fromPage === 'perfil') {
        router.push('/perfil?mensaje=direccion-actualizada')
      } else {
        router.push('/modificar-perfil?mensaje=direccion-actualizada')
      }

    } catch (error) {
      console.error('Error actualizando dirección:', error)
      setError('Error al actualizar la dirección. Inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (fromPage === 'perfil') {
      router.push('/perfil')
    } else {
      router.push('/modificar-perfil')
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
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
      {/* Header */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={handleCancel}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver
              </button>
            </div>
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Modificar Dirección</h1>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Card principal */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header de la card */}
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">Actualizar Dirección de Entrega</h2>
                <p className="text-sm text-gray-600">Busca y selecciona tu nueva dirección</p>
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className="px-6 py-6">
            {/* Dirección actual */}
            {user?.direccion && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Dirección actual:</h3>
                <p className="text-gray-900">{user.direccion}</p>
              </div>
            )}

            {/* Buscador de dirección */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nueva dirección *
              </label>
              <AddressAutocomplete
                onAddressSelect={handleAddressSelect}
                placeholder="Busca tu nueva dirección..."
              />
              <p className="text-sm text-gray-500 mt-2">
                Escribe tu dirección y selecciona una de las opciones sugeridas
              </p>
            </div>

            {/* Dirección seleccionada */}
            {selectedAddress && coordinates && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-sm font-medium text-green-800 mb-2">✓ Nueva dirección seleccionada:</h3>
                <p className="text-green-700 font-medium">{selectedAddress}</p>
                <p className="text-sm text-green-600 mt-1">
                  Coordenadas: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                </p>
              </div>
            )}

            {/* Error */}
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
          </div>

          {/* Footer con botones */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-md transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedAddress || !coordinates || isSubmitting}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Guardar Dirección
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-blue-900">¿Por qué necesitamos tu dirección?</h3>
              <p className="text-sm text-blue-700 mt-1">
                Tu dirección nos permite calcular con precisión los costos de envío y tiempos de entrega 
                para cada restaurante, brindándote la mejor experiencia de pedido.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

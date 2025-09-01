'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ApiService } from '@/services/api'
import { API_ENDPOINTS } from '@/constants/api'
import { useAuth } from '@/hooks/useAuth'
import { AuthService } from '@/services/authService'
import AddressAutocomplete from './AddressAutocomplete'
import type { EstablecerDireccionRequest, EstablecerDireccionResponse } from '@/types/cliente'

export default function SetupDireccionPage() {
  const [direccion, setDireccion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [inicializando, setInicializando] = useState(true)
  const [coordenadasSeleccionadas, setCoorenadasSeleccionadas] = useState<{ lat: number; lng: number } | null>(null)
  const router = useRouter()
  const { user, isAuthenticated, login } = useAuth()

  // ✅ Auto-login silencioso al cargar la página
  useEffect(() => {
    const inicializar = async () => {
      if (!isAuthenticated) {
        const tempCredentials = localStorage.getItem('temp_credentials')
        if (tempCredentials) {
          try {
            const credentials = JSON.parse(tempCredentials)
            const userSession = await AuthService.loginAndSaveSession(credentials)
            login(userSession)
            // Limpiar credenciales temporales
            localStorage.removeItem('temp_credentials')
          } catch (error) {
            console.error('Auto-login failed:', error)
            router.push('/login?mensaje=sesion-expirada')
            return
          }
        } else {
          // No hay credenciales temporales, ir a login
          router.push('/login')
          return
        }
      }
      setInicializando(false)
    }

    inicializar()
  }, [isAuthenticated, login, router])

  const handleAddressSelect = (address: string, coords?: { lat: number; lng: number }) => {
    setDireccion(address)
    setCoorenadasSeleccionadas(coords || null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!direccion || !direccion.trim()) {
      setError('Por favor ingresa una dirección')
      return
    }

    setLoading(true)
    setError('')

    try {
      const requestData: EstablecerDireccionRequest = {
        direccion: direccion.trim()
      }

      const response: EstablecerDireccionResponse = await ApiService.post(
        API_ENDPOINTS.ESTABLECER_DIRECCION,
        requestData
      )

      if (response.resultado.status === 200) {
        // ✅ Éxito - actualizar la sesión del usuario con las coordenadas
        if (user && coordenadasSeleccionadas) {
          const updatedUser = {
            ...user,
            direccion: direccion.trim(),
            coordenadas: {
              latitud: coordenadasSeleccionadas.lat,
              longitud: coordenadasSeleccionadas.lng
            }
          }
          
          // Actualizar la sesión en localStorage
          AuthService.saveUser(updatedUser)
          login(updatedUser)
        }
        
        // ✅ Redirigir al dashboard
        router.push('/?mensaje=registro-completo')
      } else {
        setError(response.resultado.mensaje)
      }
    } catch (error: any) {
      if (error?.resultado?.mensaje) {
        setError(error.resultado.mensaje)
      } else {
        setError('Error al establecer la dirección')
      }
      console.error('Error estableciendo dirección:', error)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Mostrar loading mientras se inicializa
  if (inicializando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Configurar Dirección
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ¡Bienvenido <strong>{user?.nombre}</strong>! Para completar tu registro, configura tu dirección de entrega.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
              Dirección completa
            </label>
            <AddressAutocomplete
              onAddressSelect={handleAddressSelect}
              value={direccion}
              disabled={loading}
              placeholder="Ej: Av. Corrientes 1234, Buenos Aires"
            />
            <p className="mt-1 text-xs text-gray-500">
              Escribe al menos 3 caracteres para ver sugerencias de direcciones
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !direccion.trim()}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Estableciendo dirección...
              </div>
            ) : (
              'Completar registro'
            )}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="text-indigo-600 hover:text-indigo-500 text-sm"
            disabled={loading}
          >
            Configurar más tarde
          </button>
        </div>
      </div>
    </div>
  )
}

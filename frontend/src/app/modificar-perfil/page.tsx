'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { ApiService } from '@/services/api'
import { API_ENDPOINTS } from '@/constants/api'

interface ModificarPerfilData {
  nombre: string
  apellido: string
  email: string
  direccion: string
}

export default function ModificarPerfilPage() {
  const { user, loading, isAuthenticated, updateUser } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState<ModificarPerfilData>({
    nombre: '',
    apellido: '',
    email: '',
    direccion: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<ModificarPerfilData>>({})
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.email || '',
        direccion: user.direccion || ''
      })
    }
  }, [user])

  const validateForm = () => {
    const newErrors: Partial<ModificarPerfilData> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar error específico
    if (errors[name as keyof ModificarPerfilData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      // Llamada a la API para actualizar el perfil
      // await ApiService.put(API_ENDPOINTS.ACTUALIZAR_CLIENTE, formData)
      
      console.log('Datos a actualizar:', formData)
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Actualizar el contexto de usuario
      if (user) {
        const updatedUser = {
          ...user,
          ...formData
        }
        updateUser(updatedUser)
      }
      
      setSuccessMessage('Perfil actualizado correctamente')
      
      // Redireccionar después de un breve delay
      setTimeout(() => {
        router.push('/perfil')
      }, 2000)
      
    } catch (error) {
      console.error('Error actualizando perfil:', error)
      setErrors({ nombre: 'Error al actualizar el perfil. Inténtalo de nuevo.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleModificarDireccion = () => {
    router.push('/modificar-direccion')
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
                onClick={() => router.push('/perfil')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver al Perfil
              </button>
            </div>
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Modificar Perfil</h1>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header de la card */}
          <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">Actualizar Información</h2>
                <p className="text-sm text-gray-600">Modifica tus datos personales</p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ingresa tu nombre"
                />
                {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
              </div>

              {/* Apellido */}
              <div>
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido *
                </label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.apellido ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ingresa tu apellido"
                />
                {errors.apellido && <p className="text-red-500 text-sm mt-1">{errors.apellido}</p>}
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="tu@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Dirección - Campo especial */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección de entrega
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={formData.direccion}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    placeholder="No especificada"
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={handleModificarDireccion}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Modificar Dirección
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Usa el botón para actualizar tu dirección con el buscador automático
                </p>
              </div>
            </div>

            {/* Campos no editables */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Información no modificable</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Username
                  </label>
                  <div className="bg-gray-100 px-3 py-2 rounded-md border">
                    <p className="text-gray-600">{user?.username}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    CUIT/CUIL
                  </label>
                  <div className="bg-gray-100 px-3 py-2 rounded-md border">
                    <p className="text-gray-600">{user?.cuit}</p>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Footer con botones */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                onClick={() => router.push('/perfil')}
                className="px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 flex items-center justify-center"
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
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { ApiService } from '@/services/api'
import { API_ENDPOINTS } from '@/constants/api'

export default function PerfilPage() {
  const { user, loading, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  const handleModificarCliente = () => {
    router.push('/modificar-perfil')
  }

  const handleEliminarCliente = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch('http://localhost:8080/cliente/eliminar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        // Éxito: cuenta eliminada
        logout();
        router.push('/login?mensaje=cuenta-eliminada');
      } else {
        // Error del servidor
        const errorText = await res.text();
        console.error('Error al eliminar cuenta:', errorText);
        alert(`Error al eliminar la cuenta: ${errorText}`);
      }
    } catch (error) {
      // Error de red o conexión
      console.error('Error de conexión:', error);
      alert('Error de conexión. Verifica que el servidor esté funcionando.');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
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
              {/* Logo en esquina izquierda de la barra */}
              <div className="mr-6">
                <Image
                  src="/logo_fixed.png"
                  alt="Logo"
                  width={90}
                  height={25}
                  className="object-contain"
                />
              </div>
              <button
                onClick={() => router.push('/')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver al Dashboard
              </button>
            </div>
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Mi Perfil</h1>
            </div>
            <div className="w-32"></div> {/* Spacer para centrar el título */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Card de información del perfil */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header de la card */}
          <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {user?.nombre?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900">{user?.nombre} {user?.apellido}</h2>
                <p className="text-sm text-gray-600">Cliente registrado</p>
              </div>
            </div>
          </div>

          {/* Información del perfil */}
          <div className="px-6 py-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Información Personal</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre 
                </label>
                <div className="bg-gray-50 px-3 py-2 rounded-md border">
                  <p className="text-gray-900">{user?.nombre || 'No especificado'}</p>
                </div>
              </div>
                {/* Apellido */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido
                </label>
                <div className="bg-gray-50 px-3 py-2 rounded-md border">
                  <p className="text-gray-900">{user?.apellido || 'No especificado'}</p>
                </div>
              </div>

              {/* Username */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Identificador de usuario
                </label>
                <div className="bg-gray-50 px-3 py-2 rounded-md border">
                  <p className="text-gray-900">{user?.username || 'No especificada'}</p>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <div className="bg-gray-50 px-3 py-2 rounded-md border">
                  <p className="text-gray-900">{user?.email || 'No especificado'}</p>
                </div>
              </div>  
              {/* cuit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CUIT/CUIL
                </label>
                <div className="bg-gray-50 px-3 py-2 rounded-md border">
                  <p className="text-gray-900">{user?.cuit || 'No especificado'}</p>
                </div>
              </div> 

              {/* Dirección */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección de entrega
                </label>
                <div className="bg-gray-50 px-3 py-2 rounded-md border">
                  <p className="text-gray-900">{user?.direccion || 'No especificada'}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Botones de acción */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                onClick={handleModificarCliente}
                className="flex items-center justify-center px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Modificar Datos
              </button>
              
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center justify-center px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Eliminar Cuenta
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mt-4">
                ¿Eliminar cuenta?
              </h3>
              <p className="text-sm text-gray-500 text-center mt-2">
                Esta acción no se puede deshacer. Se eliminarán todos tus datos y pedidos asociados.
              </p>
              
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-md transition-colors"
                  disabled={deleteLoading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEliminarCliente}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Eliminando...
                    </div>
                  ) : (
                    'Sí, eliminar'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
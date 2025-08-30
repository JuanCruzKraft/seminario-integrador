'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { getItemMenusByVendedor } from '@/services/itemMenuService'
import { ItemMenuDTO } from '@/types/itemMenu'
import axios from 'axios'

export default function MenuPage() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [itemMenus, setItemMenus] = useState<ItemMenuDTO[]>([])
  const [loadingMenu, setLoadingMenu] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const vendedorId = searchParams.get('vendedorId')
  const vendedorNombre = searchParams.get('vendedorNombre')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated && vendedorId) {
      setLoadingMenu(true)
      setError(null)
      setItemMenus([])
      
      getItemMenusByVendedor(parseInt(vendedorId))
        .then(setItemMenus)
        .catch((err) => {
          if (axios.isAxiosError(err)) {
            setError(
              err.response?.data?.resultado?.mensaje ||
              'No se pudo cargar el menú del vendedor.'
            )
          } else {
            setError('Error inesperado al cargar el menú.')
          }
        })
        .finally(() => setLoadingMenu(false))
    }
  }, [isAuthenticated, vendedorId])

  // Redirect if no vendedor ID
  useEffect(() => {
    if (!vendedorId) {
      router.push('/vendedores')
    }
  }, [vendedorId, router])

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
                onClick={() => router.push('/vendedores')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver a Vendedores
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Menú de {vendedorNombre || 'Vendedor'}
              </h1>
            </div>
            <div className="flex items-center">
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
              <div className="h-12 w-12 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🍽️</span>
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {vendedorNombre || 'Menú del Vendedor'}
                </h2>
                <p className="text-gray-600">Descubre los deliciosos platos disponibles</p>
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
        {loadingMenu ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando menú...</p>
            </div>
          </div>
        ) : itemMenus.length === 0 ? (
          /* Empty State */
          <div className="bg-white shadow rounded-lg p-12">
            <div className="text-center">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay elementos en el menú
              </h3>
              <p className="text-gray-500 mb-6">
                Este vendedor aún no tiene platos disponibles.
              </p>
              <button
                onClick={() => router.push('/vendedores')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                Ver Otros Vendedores
              </button>
            </div>
          </div>
        ) : (
          /* Menu Items Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itemMenus.map((item) => (
              <div
                key={item.id}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.nombre}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        {item.descripcion}
                      </p>
                    </div>
                    <div className="ml-4 text-right">
                      <span className="text-2xl font-bold text-green-600">
                        ${item.precio}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.tipo}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.stock > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.stock > 0 ? `Stock: ${item.stock}` : 'Sin stock'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <button
                      className={`w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        item.stock > 0
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={item.stock === 0}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 4m1.8-4L10 17m4 0h6m-6 0a2 2 0 11-4 0m4 0a2 2 0 104 0" />
                      </svg>
                      {item.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Section */}
        {itemMenus.length > 0 && (
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {itemMenus.length} platos disponibles
              </h3>
              <p className="text-gray-500">
                Explora todo el menú y encuentra tu plato favorito
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

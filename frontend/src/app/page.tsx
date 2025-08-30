'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function Home() {
  const { user, loading, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleProfile = () => {
    router.push('/perfil')
    setDropdownOpen(false)
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Card de Bienvenida */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Bienvenido
                  </h3>
                  <p className="text-sm text-gray-500">
                    {user?.nombre} 
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card de Vendedores */}
          <div 
            onClick={() => router.push('/vendedores')}
            className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white">🏪</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Vendedores
                  </h3>
                  <p className="text-sm text-gray-500">
                    Explora restaurantes disponibles
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card de Menú */}
          <div 
            onClick={() => router.push('/menu')}
            className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white">🍽️</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Ver Menú
                  </h3>
                  <p className="text-sm text-gray-500">
                    Explora los platos disponibles
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card de Carrito */}
          <div className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white">🛒</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Mi Carrito
                  </h3>
                  <p className="text-sm text-gray-500">
                    Ver pedidos pendientes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección principal */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Dashboard</h2>
            <p className="text-sm text-gray-500">
              Gestiona tus pedidos y explora los menús disponibles
            </p>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍕</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ¡Bienvenido al Sistema de Pedidos!
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Desde aquí podrás explorar diferentes menús, agregar productos a tu carrito 
                y realizar pedidos de manera fácil y rápida.
              </p>
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => router.push('/vendedores')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Explorar Vendedores
                </button>
                <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-md font-medium transition-colors">
                  Ver Pedidos
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
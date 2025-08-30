'use client'
import { useAuth } from '@/hooks/useAuth'
import { AuthService } from '@/services/authService'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  useEffect(() => {
    const mensajeParam = searchParams.get('mensaje')
    if (mensajeParam === 'registro-exitoso') {
      setMensaje('¡Registro exitoso! Ahora inicia sesión para configurar tu dirección.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const userSession = await AuthService.loginAndSaveSession(credentials)
      login(userSession)
      
      // ✅ Verificar si debe ir a establecer dirección
      const siguiente = searchParams.get('siguiente')
      if (siguiente === 'establecer-direccion') {
        router.push('/establecer-direccion')
      } else {
        router.push('/')
      }
    } catch (error: any) {
      if (error?.resultado?.mensaje) {
        setError(error.resultado.mensaje)
      } else {
        setError(error.message || 'Error desconocido')
      }
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa tus credenciales para continuar
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {mensaje && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {mensaje}
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ingresa tu usuario"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ingresa tu contraseña"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando...' : 'Iniciar Sesión'}
            </button>
          </div>
          
          <div className="text-center">
            <a href="/registro" className="text-indigo-600 hover:text-indigo-500 text-sm">
              ¿No tienes cuenta? Regístrate aquí
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
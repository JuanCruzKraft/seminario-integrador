'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { AuthService } from '@/services/authService' // ✅ Usar el servicio
import { RegistrarClienteResponse, RegistrarClienteRequest } from '@/types/auth' // ✅ Importar el tipo de respuesta

// interface RegistrarClienteRequest {
//   nombre: string
//   apellido: string
//   cuit: string
//   email: string
//   direccion: string
//   username: string
//   password: string
//   confirmarPassword: string
// }

export default function RegistroPage() {
  const [formData, setFormData] = useState<RegistrarClienteRequest>({
    nombre: '',
    apellido: '',
    cuit: 0,
    email: '',
    direccion: '',
    username: '',
    password: '',
    confirmarPassword: ''
  })
  const [cuitInput, setCuitInput] = useState('') // Estado separado para el input del CUIT
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validaciones del frontend
    if (formData.password !== formData.confirmarPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    try {
      // ✅ Usar el AuthService en lugar de fetch directo
      const data: RegistrarClienteResponse = await AuthService.register({
        nombre: formData.nombre,
        apellido: formData.apellido,
        cuit: parseInt(cuitInput) || 0,
        email: formData.email,
        direccion: '',
        username: formData.username,
        password: formData.password,
        confirmarPassword: formData.confirmarPassword
      })
      
// ...existing code...
      if (data.resultado.status === 0) {
        // ✅ Guardar credenciales temporalmente para auto-login
        localStorage.setItem('temp_credentials', JSON.stringify({
          username: formData.username,
          password: formData.password
        }))
        
        // ✅ Redirigir directo a establecer dirección
        router.push('/establecer-direccion')
      } else {
        setError(data.resultado.mensaje)
      }
// ...existing code...
    } catch (error) {
      setError('Error de conexión')
      console.error('Registration error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'cuit') {
      setCuitInput(e.target.value)
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
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

      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Registro
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Crea tu cuenta para comenzar
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  maxLength={32}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                  Apellido
                </label>
                <input
                  id="apellido"
                  name="apellido"
                  type="text"
                  required
                  maxLength={32}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Tu apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="cuit" className="block text-sm font-medium text-gray-700">
                CUIT (solo números)
              </label>
              <input
                id="cuit"
                name="cuit"
                type="text"
                required
                pattern="[0-9]{11}"
                maxLength={11}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="12345678901"
                value={cuitInput}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* <div>
              <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
                Dirección
              </label>
              <input
                id="direccion"
                name="direccion"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Tu dirección"
                value={formData.direccion}
                onChange={handleChange}
              />
            </div> */}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                minLength={4}
                maxLength={12}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Usuario (4-12 caracteres)"
                value={formData.username}
                onChange={handleChange}
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
                pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Mín. 8 caracteres, 1 mayús., 1 minús., 1 número"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="confirmarPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Contraseña
              </label>
              <input
                id="confirmarPassword"
                name="confirmarPassword"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Confirma tu contraseña"
                value={formData.confirmarPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>
          
          <div className="text-center">
            <a href="/login" className="text-indigo-600 hover:text-indigo-500 text-sm">
              ¿Ya tienes cuenta? Inicia sesión aquí
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
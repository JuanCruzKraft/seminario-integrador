// // // 'use client'

// // // import { useState } from 'react'
// // // import { useRouter } from 'next/navigation'
// // // import { ApiService } from '@/services/api'
// // // import { API_ENDPOINTS } from '@/constants/api'
// // // import type { EstablecerDireccionRequest, EstablecerDireccionResponse } from '@/types/cliente'


// // // // interface EstablecerDireccionResponse {
// // // //   latitud: number
// // // //   longitud: number
// // // //   resultado: {
// // // //     status: number
// // // //     mensaje: string
// // // //   }
// // // // }

// // // export default function SetupDireccionPage() {
// // //   const [direccion, setDireccion] = useState<EstablecerDireccionRequest>({ direccion: '' })
// // //   const [loading, setLoading] = useState(false)
// // //   const [error, setError] = useState('')
// // //   const router = useRouter()

// // //   const handleSubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault()
    
// // //     if (!direccion.trim()) {
// // //       setError('Por favor ingresa una dirección')
// // //       return
// // //     }

// // //     setLoading(true)
// // //     setError('')

// // //     try {
// // //       const response: EstablecerDireccionResponse = await ApiService.post(
// // //         API_ENDPOINTS.ESTABLECER_DIRECCION, // Necesitarás agregar este endpoint
// // //         { direccion: direccion.trim() }
// // //       )

// // //       if (response.resultado.status === 0) {
// // //         // ✅ Dirección establecida correctamente
// // //         router.push('/login?mensaje=registro-completo')
// // //       } else {
// // //         setError(response.resultado.mensaje)
// // //       }
// // //     } catch (error: any) {
// // //       if (error?.resultado?.mensaje) {
// // //         setError(error.resultado.mensaje)
// // //       } else {
// // //         setError('Error al establecer la dirección')
// // //       }
// // //       console.error('Error estableciendo dirección:', error)
// // //     } finally {
// // //       setLoading(false)
// // //     }
// // //   }

// // //   return (
// // //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
// // //       <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
// // //         <div>
// // //           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
// // //             Configurar Dirección
// // //           </h2>
// // //           <p className="mt-2 text-center text-sm text-gray-600">
// // //             Para completar tu registro, necesitamos tu dirección de entrega
// // //           </p>
// // //         </div>

// // //         <form onSubmit={handleSubmit} className="space-y-6">
// // //           {error && (
// // //             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
// // //               {error}
// // //             </div>
// // //           )}

// // //           <div>
// // //             <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
// // //               Dirección completa
// // //             </label>
// // //             <input
// // //               id="direccion"
// // //               type="text"
// // //               required
// // //               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// // //               placeholder="Ej: Av. Corrientes 1234, Buenos Aires"
// // //               value={direccion}
// // //               onChange={(e) => setDireccion(e.target.value)}
// // //               disabled={loading}
// // //             />
// // //             <p className="mt-1 text-xs text-gray-500">
// // //               Ingresa tu dirección completa incluyendo ciudad y código postal si es posible
// // //             </p>
// // //           </div>

// // //           <button
// // //             type="submit"
// // //             disabled={loading || !direccion.trim()}
// // //             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
// // //           >
// // //             {loading ? (
// // //               <div className="flex items-center">
// // //                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
// // //                 Estableciendo dirección...
// // //               </div>
// // //             ) : (
// // //               'Establecer dirección'
// // //             )}
// // //           </button>
// // //         </form>

// // //         <div className="text-center">
// // //           <button
// // //             onClick={() => router.push('/login')}
// // //             className="text-indigo-600 hover:text-indigo-500 text-sm"
// // //             disabled={loading}
// // //           >
// // //             Configurar más tarde
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   )
// // // }
// // 'use client'

// // import { useState, useEffect } from 'react'
// // import { useRouter, useSearchParams } from 'next/navigation'
// // import { ApiService } from '@/services/api'
// // import { API_ENDPOINTS } from '@/constants/api'
// // import { useAuth } from '@/hooks/useAuth'
// // import { AuthService } from '@/services/authService'
// // import type { EstablecerDireccionRequest, EstablecerDireccionResponse } from '@/types/cliente'

// // export default function SetupDireccionPage() {
// //   const [direccion, setDireccion] = useState('') // ✅ Simple string
// //   const [loading, setLoading] = useState(false)
// //   const [error, setError] = useState('')
// //   const [autoLoggingIn, setAutoLoggingIn] = useState(false)
// //   const router = useRouter()
// //   const searchParams = useSearchParams()
// //   const { user, isAuthenticated, login } = useAuth()

// //   // ✅ Auto-login si viene del registro
// //   useEffect(() => {
// //     const fromRegistro = searchParams.get('from') === 'registro'
// //     const registroData = localStorage.getItem('registro_exitoso')
    
// //     if (fromRegistro && registroData && !isAuthenticated) {
// //       handleAutoLogin(JSON.parse(registroData))
// //     } else if (!isAuthenticated && !fromRegistro) {
// //       router.push('/login')
// //     }
// //   }, [isAuthenticated, searchParams])

// //   const handleAutoLogin = async (credentials: { username: string; password: string }) => {
// //     setAutoLoggingIn(true)
// //     try {
// //       const userSession = await AuthService.loginAndSaveSession(credentials)
// //       login(userSession)
// //       localStorage.removeItem('registro_exitoso')
// //     } catch (error) {
// //       console.error('Auto-login failed:', error)
// //       router.push('/login')
// //     } finally {
// //       setAutoLoggingIn(false)
// //     }
// //   }

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault()
    
// //     if (!direccion || !direccion.trim()) { // ✅ Validación correcta
// //       setError('Por favor ingresa una dirección')
// //       return
// //     }

// //     if (!isAuthenticated) {
// //       router.push('/login')
// //       return
// //     }

// //     setLoading(true)
// //     setError('')

// //     try {
// //       // ✅ Crear el objeto EstablecerDireccionRequest aquí
// //       const requestData: EstablecerDireccionRequest = {
// //         direccion: direccion.trim()
// //       }

// //       const response: EstablecerDireccionResponse = await ApiService.post(
// //         API_ENDPOINTS.ESTABLECER_DIRECCION,
// //         requestData
// //       )

// //       if (response.resultado.status === 200) { // ✅ Status 200
// //         router.push('/?mensaje=direccion-establecida')
// //       } else {
// //         setError(response.resultado.mensaje)
// //       }
// //     } catch (error: any) {
// //       if (error?.resultado?.mensaje) {
// //         setError(error.resultado.mensaje)
// //       } else {
// //         setError('Error al establecer la dirección')
// //       }
// //       console.error('Error estableciendo dirección:', error)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   if (autoLoggingIn || !isAuthenticated) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
// //           <p className="text-gray-600">
// //             {autoLoggingIn ? 'Iniciando sesión...' : 'Verificando autenticación...'}
// //           </p>
// //         </div>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
// //       <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
// //         <div>
// //           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
// //             Configurar Dirección
// //           </h2>
// //           <p className="mt-2 text-center text-sm text-gray-600">
// //             ¡Hola <strong>{user?.nombre}</strong>! Configura tu dirección de entrega.
// //           </p>
// //         </div>

// //         <form onSubmit={handleSubmit} className="space-y-6">
// //           {error && (
// //             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
// //               {error}
// //             </div>
// //           )}

// //           <div>
// //             <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
// //               Dirección completa
// //             </label>
// //             <input
// //               id="direccion"
// //               type="text"
// //               required
// //               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// //               placeholder="Ej: Av. Corrientes 1234, Buenos Aires"
// //               value={direccion} // ✅ Simple string
// //               onChange={(e) => setDireccion(e.target.value)} // ✅ Simple string
// //               disabled={loading}
// //             />
// //           </div>

// //           <button
// //             type="submit"
// //             disabled={loading || !direccion.trim()}
// //             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
// //           >
// //             {loading ? 'Estableciendo dirección...' : 'Completar registro'}
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   )
// // }
// // // ...existing code...

// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { ApiService } from '@/services/api'
// import { API_ENDPOINTS } from '@/constants/api'
// import { useAuth } from '@/hooks/useAuth'
// import type { EstablecerDireccionRequest, EstablecerDireccionResponse } from '@/types/cliente'

// export default function SetupDireccionPage() {
//   const [direccion, setDireccion] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const router = useRouter()
//   const { user, isAuthenticated } = useAuth()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     if (!direccion || !direccion.trim()) {
//       setError('Por favor ingresa una dirección')
//       return
//     }

//     if (!isAuthenticated) {
//       setError('Debes iniciar sesión para establecer tu dirección')
//       return
//     }

//     setLoading(true)
//     setError('')

//     try {
//       const requestData: EstablecerDireccionRequest = {
//         direccion: direccion.trim()
//       }

//       const response: EstablecerDireccionResponse = await ApiService.post(
//         API_ENDPOINTS.ESTABLECER_DIRECCION,
//         requestData
//       )

//       if (response.resultado.status === 200) { // ✅ Status 200 como en tu backend
//         // ✅ Éxito - redirigir al dashboard
//         router.push('/?mensaje=direccion-establecida')
//       } else {
//         setError(response.resultado.mensaje)
//       }
//     } catch (error: any) {
//       if (error?.resultado?.mensaje) {
//         setError(error.resultado.mensaje)
//       } else {
//         setError('Error al establecer la dirección')
//       }
//       console.error('Error estableciendo dirección:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Si no está autenticado, mostrar mensaje
//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md text-center">
//           <h2 className="text-2xl font-bold text-gray-900">Acceso Requerido</h2>
//           <p className="text-gray-600">Debes iniciar sesión para configurar tu dirección.</p>
//           <button
//             onClick={() => router.push('/login')}
//             className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//           >
//             Ir a Iniciar Sesión
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Configurar Dirección
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             ¡Hola <strong>{user?.nombre}</strong>! Configura tu dirección de entrega.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//               {error}
//             </div>
//           )}

//           <div>
//             <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
//               Dirección completa
//             </label>
//             <input
//               id="direccion"
//               type="text"
//               required
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Ej: Av. Corrientes 1234, Buenos Aires"
//               value={direccion}
//               onChange={(e) => setDireccion(e.target.value)}
//               disabled={loading}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading || !direccion.trim()}
//             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
//           >
//             {loading ? 'Estableciendo dirección...' : 'Establecer dirección'}
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ApiService } from '@/services/api'
import { API_ENDPOINTS } from '@/constants/api'
import { useAuth } from '@/hooks/useAuth'
import { AuthService } from '@/services/authService'
import type { EstablecerDireccionRequest, EstablecerDireccionResponse } from '@/types/cliente'

export default function SetupDireccionPage() {
  const [direccion, setDireccion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [inicializando, setInicializando] = useState(true)
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
        // ✅ Éxito - redirigir al dashboard
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
            <input
              id="direccion"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: Av. Corrientes 1234, Buenos Aires"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              disabled={loading}
            />
            <p className="mt-1 text-xs text-gray-500">
              Tu backend obtendrá automáticamente las coordenadas usando Geoapify
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
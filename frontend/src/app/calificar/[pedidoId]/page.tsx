'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { pedidoService } from '@/services/pedidoService'
import { PedidoDTO } from '@/types/pedido'

export default function CalificarPage() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const pedidoId = parseInt(params.pedidoId as string)

  const [pedido, setPedido] = useState<PedidoDTO | null>(null)
  const [calificacion, setCalificacion] = useState<number>(0)
  const [comentario, setComentario] = useState<string>('')
  const [loadingPedido, setLoadingPedido] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [hoveredStar, setHoveredStar] = useState<number>(0)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  // Cargar información del pedido
  useEffect(() => {
    if (isAuthenticated && pedidoId) {
      setLoadingPedido(true)
      setError(null)
      
      // Obtener el pedido del historial para verificar que sea del usuario actual
      pedidoService.verHistorialPedidos()
        .then(response => {
          const pedidoEncontrado = response.pedidos.find(p => p.pedidoID === pedidoId)
          if (pedidoEncontrado && pedidoEncontrado.estado === 'ENTREGADO') {
            if (pedidoEncontrado.calificado) {
              setError('Este pedido ya ha sido calificado')
            } else {
              setPedido(pedidoEncontrado)
            }
          } else if (pedidoEncontrado) {
            setError('Este pedido aún no ha sido entregado')
          } else {
            setError('Pedido no encontrado o no tienes permisos para calificarlo')
          }
        })
        .catch((error) => {
          console.error('Error al cargar pedido:', error)
          setError('No se pudo cargar la información del pedido')
        })
        .finally(() => setLoadingPedido(false))
    }
  }, [isAuthenticated, pedidoId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (calificacion === 0) {
      setError('Por favor selecciona una calificación')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await pedidoService.calificarPedido({
        pedidoId: pedidoId,
        calificacion: calificacion,
        comentario: comentario.trim() || '' // Permitir comentario vacío
      })

      if (response.resultado.status === 0) {
        setSuccess('¡Calificación enviada exitosamente!')
        setTimeout(() => {
          router.push('/historial')
        }, 2000)
      } else {
        setError(response.resultado.mensaje || 'Error al enviar la calificación')
      }
    } catch (error) {
      console.error('Error al calificar pedido:', error)
      setError('No se pudo enviar la calificación. Inténtalo de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => setCalificacion(i)}
          onMouseEnter={() => setHoveredStar(i)}
          onMouseLeave={() => setHoveredStar(0)}
          className={`text-3xl transition-colors ${
            i <= (hoveredStar || calificacion) 
              ? 'text-yellow-400 hover:text-yellow-500' 
              : 'text-gray-300 hover:text-gray-400'
          }`}
        >
          ★
        </button>
      )
    }
    return stars
  }

  const getCalificacionTexto = (rating: number) => {
    switch (rating) {
      case 1: return 'Muy malo'
      case 2: return 'Malo'
      case 3: return 'Regular'
      case 4: return 'Bueno'
      case 5: return 'Excelente'
      default: return 'Selecciona una calificación'
    }
  }

  const formatFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr)
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Loading state
  if (loading || loadingPedido) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {loading ? 'Verificando autenticación...' : 'Cargando pedido...'}
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
      <div className="fixed top-4 left-4 z-50">
        <Image
          src="/Logo.png"
          alt="Logo"
          width={50}
          height={50}
          className="object-contain opacity-80 hover:opacity-100 transition-opacity"
        />
      </div>

      {/* Header/Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/historial')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver al Historial
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Calificar Pedido
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
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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

        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          </div>
        )}

        {pedido ? (
          <div className="space-y-6">
            {/* Información del pedido */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Pedido #{pedido.pedidoID}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {formatFecha(pedido.fechaConfirmacion)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    ${pedido.precio.toFixed(2)}
                  </p>
                  <p className="text-gray-600">Total</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Vendedor: {pedido.nombreVendedor}
                </h3>
                
                <h4 className="text-md font-medium text-gray-900 mb-3">Items del pedido:</h4>
                <div className="space-y-3">
                  {pedido.items.map((item, index) => (
                    <div 
                      key={item.itemPedidoId || `item-${index}`} 
                      className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.nombre}</p>
                        <p className="text-xs text-gray-500">
                          ${item.precioUnitario.toFixed(2)} x {item.cantidad}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        ${item.subtotal.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Formulario de calificación */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                ¿Cómo fue tu experiencia?
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Calificación con estrellas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Calificación *
                  </label>
                  <div className="flex items-center space-x-2 mb-2">
                    {renderStars()}
                  </div>
                  <p className="text-sm text-gray-600">
                    {getCalificacionTexto(hoveredStar || calificacion)}
                  </p>
                </div>

                {/* Comentario */}
                <div>
                  <label htmlFor="comentario" className="block text-sm font-medium text-gray-700 mb-2">
                    Comentario (opcional)
                  </label>
                  <textarea
                    id="comentario"
                    rows={4}
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Comparte tu experiencia con este pedido (opcional)..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {comentario.length}/500 caracteres
                  </p>
                </div>

                {/* Botones */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => router.push('/historial')}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={submitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || calificacion === 0}
                    className={`px-6 py-2 rounded-md font-medium transition-colors ${
                      submitting || calificacion === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                        Enviando...
                      </>
                    ) : (
                      'Enviar Calificación'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          !error && (
            <div className="bg-white shadow rounded-lg p-12">
              <div className="text-center">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Pedido ya calificado
                </h3>
                <p className="text-gray-500 mb-6">
                  Ya has calificado este pedido anteriormente. Gracias por tu feedback.
                </p>
                <button
                  onClick={() => router.push('/historial')}
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Volver al Historial
                </button>
              </div>
            </div>
          )
        )}

        {/* Mensaje cuando el pedido no está disponible para calificar pero no hay error específico */}
        {!pedido && !error && !loadingPedido && (
          <div className="bg-white shadow rounded-lg p-12">
            <div className="text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Cargando información del pedido...
              </h3>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
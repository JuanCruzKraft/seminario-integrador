'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_CONFIG } from '@/constants/api';
import { MetodoPago } from '@/types/carrito';

interface PedidoItem {
  itemPedidoId: number;
  itemMenuId: number;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

interface PrepararPagoResponse {
  vendedorId: number;
  vendedorNombre: string;
  vendedorCuit: string;
  vendedorCbu: string;
  items: PedidoItem[];
  subtotal: number;
  recargo: number;
  total: number;
  metodosDisponibles: string[];
  resultado: {
    status: number;
    mensaje: string;
  };
}

export default function PagoPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<MetodoPago | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PrepararPagoResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [cardData, setCardData] = useState({
    numeroTarjeta: '',
    nombreTitular: '',
    fechaVencimiento: '',
    codigoSeguridad: '',
    observaciones: ''
  });

  const [transferData, setTransferData] = useState({
    observaciones: ''
  });

  const preparePayment = async (method: MetodoPago) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pago/preparar?metodoPago=${method}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error al preparar el pago');
      }

      const data = await response.json();
      setPaymentInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleMethodSelection = (method: MetodoPago) => {
    setSelectedMethod(method);
    preparePayment(method);
  };

  const validateCardNumber = (numero: string): boolean => {
    // Remove spaces and check length
    const cleanNumber = numero.replace(/\s/g, '');
    if (cleanNumber.length !== 16) return false;

    // Validate based on first digit
    if (selectedMethod === MetodoPago.TARJETA_CREDITO) {
      return cleanNumber.startsWith('5');
    } else if (selectedMethod === MetodoPago.TARJETA_DEBITO) {
      return cleanNumber.startsWith('4');
    }
    return false;
  };

  const validateCardForm = (): boolean => {
    if (!cardData.numeroTarjeta || !cardData.nombreTitular || 
        !cardData.fechaVencimiento || !cardData.codigoSeguridad) {
      setError('Todos los campos de la tarjeta son obligatorios');
      return false;
    }

    if (!validateCardNumber(cardData.numeroTarjeta)) {
      const expectedStart = selectedMethod === MetodoPago.TARJETA_CREDITO ? '5' : '4';
      setError(`El número de tarjeta debe comenzar con ${expectedStart} y tener 16 dígitos`);
      return false;
    }

    return true;
  };

  const handleCardPayment = async () => {
    if (!validateCardForm()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pago/pagar-tarjeta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(cardData),
      });

      if (!response.ok) {
        throw new Error('Error al procesar el pago');
      }

      const result = await response.json();
      
      if (result.resultado?.status === 0 && result.pedidoId) {
        // Redirigir a la página de resumen con el pedidoId
        router.push(`/pago/resumen?pedidoId=${result.pedidoId}`);
      } else {
        throw new Error(result.resultado?.mensaje || 'Error al procesar el pago');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  const handleTransferPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pago/pagar-transferencia`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(transferData),
      });

      if (!response.ok) {
        throw new Error('Error al procesar el pago');
      }

      const result = await response.json();
      
      if (result.resultado?.status === 0 && result.pedidoId) {
        // Redirigir a la página de resumen con el pedidoId
        router.push(`/pago/resumen?pedidoId=${result.pedidoId}`);
      } else {
        throw new Error(result.resultado?.mensaje || 'Error al procesar el pago');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const calculateSubtotal = (items: PedidoItem[]) => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Procesar Pago
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Method Selection */}
          {!selectedMethod && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Seleccionar Método de Pago</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => handleMethodSelection(MetodoPago.TARJETA_CREDITO)}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  disabled={loading}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">💳</div>
                    <h3 className="font-semibold text-gray-900">Tarjeta de Crédito</h3>
                    <p className="text-sm text-gray-700 mt-1">Recargo del 10%</p>
                  </div>
                </button>

                <button
                  onClick={() => handleMethodSelection(MetodoPago.TARJETA_DEBITO)}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  disabled={loading}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">💳</div>
                    <h3 className="font-semibold text-gray-900">Tarjeta de Débito</h3>
                    <p className="text-sm text-gray-700 mt-1">Sin recargo</p>
                  </div>
                </button>

                <button
                  onClick={() => handleMethodSelection(MetodoPago.TRANSFERENCIA)}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  disabled={loading}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🏦</div>
                    <h3 className="font-semibold text-gray-900">Transferencia</h3>
                    <p className="text-sm text-gray-700 mt-1">Sin recargo</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-900">Cargando...</p>
            </div>
          )}

          {/* Payment Information */}
          {paymentInfo && selectedMethod && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Pedido</h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Vendedor: {paymentInfo.vendedorNombre}</h4>
                  <div className="space-y-2">
                    {paymentInfo.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm text-gray-900">
                        <span>{item.cantidad}x {item.nombre}</span>
                        <span>{formatCurrency(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>
                  <hr className="my-3" />
                  <div className="space-y-1 text-sm text-gray-900">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(paymentInfo.subtotal)}</span>
                    </div>
                    {paymentInfo.recargo > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Recargo (10%):</span>
                        <span>+{formatCurrency(paymentInfo.recargo)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>{formatCurrency(paymentInfo.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Datos del Pago - {selectedMethod === MetodoPago.TARJETA_CREDITO ? 'Tarjeta de Crédito' : 
                  selectedMethod === MetodoPago.TARJETA_DEBITO ? 'Tarjeta de Débito' : 'Transferencia'}
                </h3>

                {(selectedMethod === MetodoPago.TARJETA_CREDITO || selectedMethod === MetodoPago.TARJETA_DEBITO) && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        Número de Tarjeta *
                      </label>
                      <input
                        type="text"
                        value={cardData.numeroTarjeta}
                        onChange={(e) => setCardData({ ...cardData, numeroTarjeta: e.target.value })}
                        placeholder="1234 5678 9012 3456"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={19}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedMethod === MetodoPago.TARJETA_CREDITO ? 
                          'Debe comenzar con 5' : 'Debe comenzar con 4'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        Nombre del Titular *
                      </label>
                      <input
                        type="text"
                        value={cardData.nombreTitular}
                        onChange={(e) => setCardData({ ...cardData, nombreTitular: e.target.value })}
                        placeholder="Juan Pérez"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha Vencimiento *
                        </label>
                        <input
                          type="text"
                          value={cardData.fechaVencimiento}
                          onChange={(e) => setCardData({ ...cardData, fechaVencimiento: e.target.value })}
                          placeholder="MM/AA"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          maxLength={5}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Código Seguridad *
                        </label>
                        <input
                          type="text"
                          value={cardData.codigoSeguridad}
                          onChange={(e) => setCardData({ ...cardData, codigoSeguridad: e.target.value })}
                          placeholder="123"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          maxLength={4}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Observaciones
                      </label>
                      <textarea
                        value={cardData.observaciones}
                        onChange={(e) => setCardData({ ...cardData, observaciones: e.target.value })}
                        placeholder="Comentarios adicionales..."
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                    </div>

                    <button
                      onClick={handleCardPayment}
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Procesando...' : `Pagar ${formatCurrency(paymentInfo.total)}`}
                    </button>
                  </div>
                )}

                {selectedMethod === MetodoPago.TRANSFERENCIA && (
                  <div className="space-y-6">
                    {/* Datos del Vendedor para Transferencia */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 mb-3">Datos para Transferencia Bancaria</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Titular:</span> 
                          <span className="ml-2">{paymentInfo.vendedorNombre}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">CUIT:</span> 
                          <span className="ml-2 font-mono">{paymentInfo.vendedorCuit}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">CBU:</span> 
                          <span className="ml-2 font-mono">{paymentInfo.vendedorCbu}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Monto a transferir:</span> 
                          <span className="ml-2 text-lg font-bold text-green-600">{formatCurrency(paymentInfo.total)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Mercado Pago QR */}
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 mb-3 text-center">O paga con Mercado Pago</h4>
                      <div className="flex flex-col items-center">
                        <img 
                          src="/Qr.png" 
                          alt="Código QR Mercado Pago" 
                          className="w-40 h-40 border border-gray-300 rounded-lg shadow-sm"
                        />
                        <p className="text-sm text-gray-600 mt-2 text-center">
                          Escanea el código QR con la app de Mercado Pago
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                            💳 MERCADO PAGO
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Campo de Observaciones */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Observaciones (opcional)
                      </label>
                      <textarea
                        value={transferData.observaciones}
                        onChange={(e) => setTransferData({ ...transferData, observaciones: e.target.value })}
                        placeholder="Escribe aquí cualquier comentario, número de comprobante o referencia de tu pago..."
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                    </div>

                    {/* Botón de confirmación */}
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-600 mb-3 text-center">
                        Una vez que hayas realizado el pago, haz clic en el botón de abajo
                      </p>
                      <button
                        onClick={handleTransferPayment}
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        {loading ? 'Procesando...' : '✓ Ya Pagué'}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    setSelectedMethod(null);
                    setPaymentInfo(null);
                    setError(null);
                  }}
                  className="w-full mt-4 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cambiar Método de Pago
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

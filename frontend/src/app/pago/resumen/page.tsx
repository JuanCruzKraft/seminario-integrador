"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { API_CONFIG } from "@/constants/api";
import { usePedidoTracking } from "@/hooks/usePedidoTracking";

interface PedidoItem {
  itemPedidoId: number;
  itemMenuId: number;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

interface PedidoResumen {
  pedidoId: number;
  vendedorId: number;
  vendedorNombre: string;
  vendedorCuit: string;
  vendedorCbu: string;
  metodoPago: 'TARJETA_CREDITO' | 'TARJETA_DEBITO' | 'TRANSFERENCIA';
  items: PedidoItem[];
  subtotal: number;
  costoEnvio: number; // Campo agregado para costo de envío
  recargo: number;
  total: number;
  tiempoEnvio: number; // minutos
  resultado: {
    status: number;
    mensaje: string;
  };
}

export default function PagoResumenPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [resumen, setResumen] = useState<PedidoResumen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Suponemos que el id del pedido viene por query param
  const pedidoId = searchParams.get("pedidoId");
  
  // Hook para seguimiento del pedido
  const { estadoPedido, loading: trackingLoading } = usePedidoTracking(pedidoId ? parseInt(pedidoId) : null);

  useEffect(() => {
    if (!pedidoId) {
      setError("No se proporcionó un ID de pedido válido");
      setLoading(false);
      return;
    }

    setLoading(true);
    // Usar el endpoint que busca por pedidoId específico
    fetch(`${API_CONFIG.BASE_URL}/pago/resumen?pedidoId=${pedidoId}`, {
      credentials: 'include'
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo obtener el resumen");
        return res.json();
      })
      .then(setResumen)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [pedidoId]);

  const handleDescargarPDF = () => {
    const idParaPDF = resumen?.pedidoId || pedidoId;
    if (!idParaPDF) return;
    
    // Crear un enlace temporal para descargar el archivo
    const link = document.createElement('a');
    link.href = `${API_CONFIG.BASE_URL}/pago/pdf?pedidoId=${idParaPDF}`;
    link.download = `pedido_${idParaPDF}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="p-8 text-center">Cargando...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!resumen || resumen.resultado.status !== 200) {
    return <div className="p-8 text-center text-red-600">
      {resumen?.resultado.mensaje || "Error al cargar el resumen"}
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
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

      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-3xl flex flex-col md:flex-row gap-8">
        {/* Lado Izquierdo: Resumen y volver */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Resumen del Pedido</h2>
            <div className="mb-2 font-medium text-gray-900">Vendedor: {resumen.vendedorNombre}</div>
            
            {/* Mostrar información específica según el método de pago */}
            {resumen.metodoPago === 'TRANSFERENCIA' && (
              <>
                <div className="mb-2 text-sm text-gray-900">CUIT: {resumen.vendedorCuit}</div>
                <div className="mb-2 text-sm text-gray-900">CBU: {resumen.vendedorCbu}</div>
              </>
            )}
            <div className="mb-4 text-gray-900">
              {resumen.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-gray-900">
                  <span>{item.cantidad}x {item.nombre}</span>
                  <span>${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-semibold text-gray-900">
              <span>Subtotal:</span>
              <span>${resumen.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-900">
              <span>Costo de Envío:</span>
              <span>+${resumen.costoEnvio.toFixed(2)}</span>
            </div>
            {resumen.recargo > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Recargo (Tarjeta de Crédito):</span>
                <span>+${resumen.recargo.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg mt-2 text-gray-900">
              <span>Total:</span>
              <span>${resumen.total.toFixed(2)}</span>
            </div>
          </div>
          <button
            className="mt-8 bg-green-500 text-gray-900 py-2 px-4 rounded hover:bg-green-900"
            onClick={() => router.push("/")}
          >
            Volver al inicio
          </button>
        </div>
        {/* Lado Derecho: Descargar PDF */}
        <div className="flex flex-col items-center justify-center w-full md:w-64">
          <button
            className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 w-full"
            onClick={handleDescargarPDF}
          >
            Descargar PDF
          </button>
        </div>
      </div>
      
      {/* Tracking del pedido */}
      {estadoPedido && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 w-full max-w-3xl">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Estado del Pedido</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">{estadoPedido.estadoTexto}</span>
              <span className="text-sm text-gray-700">{Math.round(estadoPedido.progreso)}% completado</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${estadoPedido.progreso}%` }}
              ></div>
            </div>
            
            {estadoPedido.tiempoRestante > 0 && (
              <p className="text-center text-gray-900">
                Tiempo estimado restante: <span className="font-bold text-blue-600">{estadoPedido.tiempoRestante} minutos</span>
              </p>
            )}
            
            {estadoPedido.siguienteEstado && estadoPedido.estado !== 'ENTREGADO' && (
              <p className="text-center text-sm text-gray-700">
                Próximo estado: {estadoPedido.siguienteEstado}
              </p>
            )}

            {/* Indicadores visuales de estado */}
            <div className="flex justify-between items-center mt-6">
              <div className={`flex flex-col items-center ${estadoPedido.estado === 'CONFIRMADO' || estadoPedido.estado === 'EN_ENVIO' || estadoPedido.estado === 'ENTREGADO' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-4 h-4 rounded-full mb-2 ${estadoPedido.estado === 'CONFIRMADO' || estadoPedido.estado === 'EN_ENVIO' || estadoPedido.estado === 'ENTREGADO' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                <span className="text-xs font-medium">Confirmado</span>
              </div>
              
              <div className={`flex flex-col items-center ${estadoPedido.estado === 'EN_ENVIO' || estadoPedido.estado === 'ENTREGADO' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-4 h-4 rounded-full mb-2 ${estadoPedido.estado === 'EN_ENVIO' || estadoPedido.estado === 'ENTREGADO' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                <span className="text-xs font-medium">En Camino</span>
              </div>
              
              <div className={`flex flex-col items-center ${estadoPedido.estado === 'ENTREGADO' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-4 h-4 rounded-full mb-2 ${estadoPedido.estado === 'ENTREGADO' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                <span className="text-xs font-medium">Entregado</span>
              </div>
            </div>
            
            {trackingLoading && (
              <div className="text-center text-sm text-gray-500">
                Actualizando estado...
              </div>
            )}
          </div>
        </div>
      )}
      
    </div>
  );
}

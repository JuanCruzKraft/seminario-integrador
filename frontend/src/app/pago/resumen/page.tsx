"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_CONFIG } from "@/constants/api";

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
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-3xl flex flex-col md:flex-row gap-8">
        {/* Lado Izquierdo: Resumen y volver */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-4">Resumen del Pedido</h2>
            <div className="mb-2 font-medium">Vendedor: {resumen.vendedorNombre}</div>
            
            {/* Mostrar información específica según el método de pago */}
            {resumen.metodoPago === 'TRANSFERENCIA' && (
              <>
                <div className="mb-2 text-sm">CUIT: {resumen.vendedorCuit}</div>
                <div className="mb-2 text-sm">CBU: {resumen.vendedorCbu}</div>
              </>
            )}
            <div className="mb-4">
              {resumen.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{item.cantidad}x {item.nombre}</span>
                  <span>${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-semibold">
              <span>Subtotal:</span>
              <span>${resumen.subtotal.toFixed(2)}</span>
            </div>
            {resumen.recargo > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Recargo (Tarjeta de Crédito):</span>
                <span>+${resumen.recargo.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Total:</span>
              <span>${resumen.total.toFixed(2)}</span>
            </div>
          </div>
          <button
            className="mt-8 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
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
      {/* Mensaje de preparación y tiempo de envío */}
      <div className="mt-8 text-center text-lg font-medium">
        Tu pedido está en preparación, llega en <span className="text-blue-600 font-bold">{resumen.tiempoEnvio} minutos</span>.
      </div>
    </div>
  );
}

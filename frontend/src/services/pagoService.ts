import type { 
  PagoTarjetaRequest, 
  PagoTransferenciaRequest, 
  ConfirmarCarritoRequest,
  ConfirmarCarritoResponse
} from '@/types/carrito';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

/**
 * Procesa un pago con tarjeta de crédito o débito
 */
export const procesarPagoTarjeta = async (pagoRequest: PagoTarjetaRequest): Promise<ConfirmarCarritoResponse> => {
  const response = await fetch(`${API_URL}/pago/pagar-tarjeta`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify(pagoRequest)
  });
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => `HTTP ${response.status}`);
    throw new Error(errorText);
  }
  
  return response.json();
};

/**
 * Procesa un pago por transferencia
 */
export const procesarPagoTransferencia = async (pagoRequest: PagoTransferenciaRequest): Promise<ConfirmarCarritoResponse> => {
  const response = await fetch(`${API_URL}/pago/pagar-transferencia`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify(pagoRequest)
  });
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => `HTTP ${response.status}`);
    throw new Error(errorText);
  }
  
  return response.json();
};

/**
 * Procesa un pago general (método genérico)
 */
export const procesarPago = async (pagoRequest: ConfirmarCarritoRequest): Promise<ConfirmarCarritoResponse> => {
  const response = await fetch(`${API_URL}/pago/pagar`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify(pagoRequest)
  });
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => `HTTP ${response.status}`);
    throw new Error(errorText);
  }
  
  return response.json();
};

/**
 * Prepara los datos del pago (información previa)
 */
export const prepararPago = async (metodoPago: string): Promise<ConfirmarCarritoResponse> => {
  const response = await fetch(`${API_URL}/pago/preparar?metodoPago=${metodoPago}`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json" 
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => `HTTP ${response.status}`);
    throw new Error(errorText);
  }
  
  return response.json();
};

/**
 * Obtiene el resumen de un pago por ID de pedido
 */
export const obtenerResumenPago = async (pedidoId: number): Promise<ConfirmarCarritoResponse> => {
  const response = await fetch(`${API_URL}/pago/resumen?pedidoId=${pedidoId}`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json" 
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => `HTTP ${response.status}`);
    throw new Error(errorText);
  }
  
  return response.json();
};

/**
 * Descarga el PDF de un pedido
 */
export const descargarPdfPedido = async (pedidoId: number): Promise<Blob> => {
  const response = await fetch(`${API_URL}/pago/pdf?pedidoId=${pedidoId}`, {
    method: "GET"
  });
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => `HTTP ${response.status}`);
    throw new Error(errorText);
  }
  
  return response.blob();
};
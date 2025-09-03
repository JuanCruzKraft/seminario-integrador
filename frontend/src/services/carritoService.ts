import type { AgregarItemResponse } from '@/types/carrito'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export const addItemToCarrito = async (
  itemMenuId: number, 
  cantidad: number, 
  clienteId: number, 
  vendedorId: number
): Promise<AgregarItemResponse> => {
  const response = await fetch(`${API_URL}/carrito/agregarItem`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json" 
    },
    credentials: "include", // Para cookies/sesión
    body: JSON.stringify({
      clienteid: clienteId,
      vendedorid: vendedorId,
      itemMenuId,
      cantidad
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => `HTTP ${response.status}`);
    throw new Error(errorText);
  }
  
  return response.json();
}
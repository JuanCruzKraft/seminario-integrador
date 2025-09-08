import type { 
  AgregarItemResponse, 
  VisualizarCarritoResponse, 
  EliminarCarritoResponse,
  ModificarCantidadRequest,
  ModificarCantidadResponse,
  EliminarItemRequest,
  EliminarItemResponse
} from '@/types/carrito'

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
    // Removemos credentials por ahora
    body: JSON.stringify({
      clienteid: clienteId,
      vendedorid: vendedorId,
      itemMenuId: itemMenuId,
      cantidad: cantidad
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => `HTTP ${response.status}`);
    throw new Error(errorText);
  }
  
  return response.json();
}

export const visualizarCarrito = async (): Promise<VisualizarCarritoResponse> => {
  const response = await fetch(`${API_URL}/carrito/ver`, {
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
}

export const eliminarCarrito = async (): Promise<EliminarCarritoResponse> => {
  const response = await fetch(`${API_URL}/carrito/eliminar`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json" 
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => `HTTP ${response.status}`);
    throw new Error(errorText);
  }
  
  return response.json();
}

export const modificarCantidadItem = async (request: ModificarCantidadRequest): Promise<ModificarCantidadResponse> => {
  const response = await fetch(`${API_URL}/carrito/modificarCantidad`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify(request)
  });
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => `HTTP ${response.status}`);
    throw new Error(errorText);
  }
  
  return response.json();
}

export const eliminarItem = async (request: EliminarItemRequest): Promise<EliminarItemResponse> => {
  const response = await fetch(`${API_URL}/carrito/eliminarItem`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify(request)
  });
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => `HTTP ${response.status}`);
    throw new Error(errorText);
  }
  
  return response.json();
}
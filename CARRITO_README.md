# Funcionalidad del Carrito - Seminario Integrador

## Características Implementadas

### 1. Dropdown del Carrito
- **Ubicación**: Esquina superior derecha en las páginas de vendedores y menú
- **Funcionalidad**: 
  - Muestra contador de items en el carrito
  - Lista resumida de productos
  - Subtotal de productos y costo de envío
  - Total general
  - Botón "Ver carrito en detalle"

### 2. Página Detallada del Carrito (`/carrito`)
- **Visualización completa** de todos los items del carrito
- **Información logística**: distancia, tiempo estimado, costo de envío
- **Dirección de entrega** del cliente
- **Controles por item**:
  - Modificar cantidad (botones + y -)
  - Eliminar item individual
- **Acciones generales**:
  - Eliminar carrito completo
  - Confirmar pedido (pendiente implementación completa)

### 3. Nuevos Endpoints del Backend

#### `GET /carrito/ver`
- Visualiza el carrito completo con todos los detalles

#### `POST /carrito/modificarCantidad`
```json
{
  "itemPedidoId": 123,
  "itemMenuId": 456,
  "nuevaCantidad": 3
}
```

#### `POST /carrito/eliminarItem`
```json
{
  "itemPedidoId": 123
}
```

#### `POST /carrito/eliminar`
- Elimina todo el carrito

## Cómo Probar

1. **Iniciar el Backend**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Iniciar el Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Flujo de Prueba**:
   - Iniciar sesión con un usuario
   - Ir a "Vendedores" 
   - Seleccionar un vendedor y ver su menú
   - Agregar items al carrito (se verá el contador en el dropdown)
   - Hacer click en el dropdown del carrito para ver el resumen
   - Hacer click en "Ver carrito en detalle" para la vista completa
   - Probar modificar cantidades y eliminar items

## Estructura de Archivos Nuevos/Modificados

### Frontend
- `src/components/CarritoDropdown.tsx` - Componente dropdown del carrito
- `src/app/carrito/page.tsx` - Página detallada del carrito
- `src/hooks/useCarrito.ts` - Hook para manejo del estado del carrito
- `src/services/carritoService.ts` - Servicios API del carrito
- `src/types/carrito.ts` - Tipos TypeScript para el carrito

### Backend
- `dto/request/carrito/ModificarCantidadRequestDTO.java`
- `dto/request/carrito/EliminarItemRequestDTO.java` 
- `dto/response/carrito/ModificarCantidadResponseDTO.java`
- `dto/response/carrito/EliminarItemResponseDTO.java`
- `dto/ItemPedidoDTO.java` - Agregados itemPedidoId e itemMenuId
- `controller/CarritoController.java` - Nuevos endpoints
- `service/CarritoService.java` - Nuevos métodos públicos

## Notas Técnicas

- El carrito se actualiza automáticamente después de cada operación
- El dropdown se cierra automáticamente al hacer click fuera
- Los errores se muestran de forma user-friendly
- El estado del carrito se mantiene consistente entre componentes
- Validaciones de stock y permisos implementadas en el backend

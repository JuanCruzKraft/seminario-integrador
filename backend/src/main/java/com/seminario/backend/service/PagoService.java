package com.seminario.backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.seminario.backend.dto.ItemPedidoDTO;
import com.seminario.backend.dto.request.carrito.ConfirmarCarritoRequestDTO;
import com.seminario.backend.dto.response.carrito.ConfirmarCarritoResponseDTO;
import com.seminario.backend.enums.EstadoPago;
import com.seminario.backend.enums.EstadoPedido;
import com.seminario.backend.enums.MetodoPago;
import com.seminario.backend.model.ItemPedido;
import com.seminario.backend.model.Pago;
import com.seminario.backend.model.Pedido;
import com.seminario.backend.repository.ItemPedidoRepository;
import com.seminario.backend.repository.PagoRepository;
import com.seminario.backend.repository.PedidoRepository;
import com.seminario.backend.sesion.SesionMockeada;

@Service
public class PagoService {
    
    private final PedidoRepository pedidoRepository;
    private final PagoRepository pagoRepository;
    private final ItemPedidoRepository itemPedidoRepository;
    private final SesionMockeada sesion;
    
    public PagoService(PedidoRepository pedidoRepository, PagoRepository pagoRepository, ItemPedidoRepository itemPedidoRepository, SesionMockeada sesion) {
        this.pedidoRepository = pedidoRepository;
        this.pagoRepository = pagoRepository;
        this.itemPedidoRepository = itemPedidoRepository;
        this.sesion = sesion;
    }
    
    @Transactional
    public ConfirmarCarritoResponseDTO procesarPago(ConfirmarCarritoRequestDTO request) {
        ConfirmarCarritoResponseDTO response = new ConfirmarCarritoResponseDTO();
        
        try {
            // Obtener el carrito del cliente actual
            Pedido carrito = pedidoRepository.findByClienteClienteidAndEstado(sesion.getIdSesionActual(), EstadoPedido.EN_CARRITO);
            
            if (carrito == null) {
                response.resultado.setStatus(404);
                response.resultado.setMensaje("No hay un carrito activo para procesar el pago");
                return response;
            }
            
            // Validar el método de pago y datos específicos
            String validationMessage = validarDatosPago(request);
            if (validationMessage != null) {
                response.resultado.setStatus(400);
                response.resultado.setMensaje(validationMessage);
                return response;
            }
            
            // Procesar el pago según el método elegido
            boolean pagoExitoso = procesarMetodoPago(request);
            
            if (!pagoExitoso) {
                response.resultado.setStatus(400);
                response.resultado.setMensaje("Error al procesar el pago");
                return response;
            }

            // Calcular el precio final según el método de pago
            double subtotalTotal = carrito.getSubTotal_Total() != null ? carrito.getSubTotal_Total() : 0.0;
            double precioFinal;
            
            if (request.getMetodoPago() == MetodoPago.TARJETA_CREDITO) {
                // Tarjeta de crédito: subtotal + 10%
                precioFinal = subtotalTotal * 1.10;
            } else {
                // Débito y transferencia: sin recargo
                precioFinal = subtotalTotal;
            }
            
            // Actualizar el precio final del pedido
            carrito.setPrecio(precioFinal);

            // Crear registro de pago
            Pago pago = new Pago();
            pago.setPedido(carrito);
            pago.setMonto(precioFinal);
            // Usar el setter correcto para el enum
            pago.setMetodoPago(request.getMetodoPago());
            pago.setEstado(EstadoPago.PAGADO);
            pago.setFechaEmision(LocalDateTime.now());
            pago.setResumen(generarResumenPago(request, precioFinal));
            
            // Guardar el pago
            pagoRepository.save(pago);
            
            // Actualizar el estado del pedido
            System.out.println("Estado del pedido antes del pago: " + carrito.getEstado());
            carrito.setEstado(EstadoPedido.CONFIRMADO);
            carrito.setFechaConfirmacion(LocalDateTime.now());
            
            // Guardar los cambios en el pedido
            Pedido pedidoGuardado = pedidoRepository.save(carrito);
            System.out.println("Pedido guardado con estado: " + pedidoGuardado.getEstado() + " e ID: " + pedidoGuardado.getPedidoid());
            System.out.println("Fecha de confirmación: " + pedidoGuardado.getFechaConfirmacion());
            
            // Configurar la respuesta
            response.setTotal(precioFinal);
            response.setItems(convertirItemsADTO(carrito));
            response.setVendedorId(carrito.getVendedor().getVendedorid());
            response.setVendedorNombre(carrito.getVendedor().getNombre());
            response.setVendedorCuit(carrito.getVendedor().getCuit());
            response.setVendedorCbu(carrito.getVendedor().getCbu());
            response.setPedidoId(pedidoGuardado.getPedidoid()); // Agregar ID del pedido
            response.resultado.setStatus(0);
            response.resultado.setMensaje("Pago procesado exitosamente. Pedido confirmado.");
            
        } catch (Exception e) {
            response.resultado.setStatus(500);
            response.resultado.setMensaje("Error interno del servidor: " + e.getMessage());
        }
        
        return response;
    }
    
    public ConfirmarCarritoResponseDTO prepararPago(MetodoPago metodoPago) {
        ConfirmarCarritoResponseDTO response = new ConfirmarCarritoResponseDTO();
        
        try {
            // Obtener el carrito del cliente actual
            Pedido carrito = pedidoRepository.findByClienteClienteidAndEstado(sesion.getIdSesionActual(), EstadoPedido.EN_CARRITO);
            
            if (carrito == null) {
                response.resultado.setStatus(404);
                response.resultado.setMensaje("No hay un carrito activo");
                return response;
            }
            
            // Calcular el precio final según el método de pago (solo para mostrar en la respuesta)
            double subtotalTotal = carrito.getSubTotal_Total() != null ? carrito.getSubTotal_Total() : 0.0;
            double recargo = 0.0;
            double precioFinal;
            
            if (metodoPago == MetodoPago.TARJETA_CREDITO) {
                // Tarjeta de crédito: subtotal + 10%
                recargo = subtotalTotal * 0.10;
                precioFinal = subtotalTotal + recargo;
            } else {
                // Débito y transferencia: sin recargo
                precioFinal = subtotalTotal;
            }
            
            // Configurar la respuesta
            response.setSubtotal(subtotalTotal);
            response.setRecargo(recargo);
            response.setTotal(precioFinal);
            response.setItems(convertirItemsADTO(carrito));
            response.setVendedorId(carrito.getVendedor().getVendedorid());
            response.setVendedorNombre(carrito.getVendedor().getNombre());
            response.setVendedorCuit(carrito.getVendedor().getCuit());
            response.setVendedorCbu(carrito.getVendedor().getCbu());
            response.resultado.setStatus(0);
            response.resultado.setMensaje("Información de pago preparada");
            
        } catch (Exception e) {
            response.resultado.setStatus(500);
            response.resultado.setMensaje("Error interno del servidor: " + e.getMessage());
        }
        
        return response;
    }
    
    private String validarDatosPago(ConfirmarCarritoRequestDTO request) {
        if (request.getMetodoPago() == null) {
            return "Debe seleccionar un método de pago";
        }
        
        switch (request.getMetodoPago()) {
            case TARJETA_CREDITO:
            case TARJETA_DEBITO:
                return validarDatosTarjeta(request);
            case TRANSFERENCIA:
                return validarDatosTransferencia(request);
            default:
                return "Método de pago no válido";
        }
    }
    
    private String validarDatosTarjeta(ConfirmarCarritoRequestDTO request) {
        if (request.getNumeroTarjeta() == null || request.getNumeroTarjeta().length() < 15) {
            return "El número de tarjeta debe tener al menos 15 dígitos";
        }
        
        // Validar que tarjeta de crédito empiece con 5 y débito con 4
        if (request.getMetodoPago() == MetodoPago.TARJETA_CREDITO) {
            if (!request.getNumeroTarjeta().startsWith("5")) {
                return "El número de tarjeta de crédito debe comenzar con 5";
            }
        } else if (request.getMetodoPago() == MetodoPago.TARJETA_DEBITO) {
            if (!request.getNumeroTarjeta().startsWith("4")) {
                return "El número de tarjeta de débito debe comenzar con 4";
            }
        }
        
        if (request.getNombreTitular() == null || request.getNombreTitular().trim().isEmpty()) {
            return "El nombre del titular es obligatorio";
        }
        
        if (request.getFechaVencimiento() == null || request.getFechaVencimiento().trim().isEmpty()) {
            return "La fecha de vencimiento es obligatoria";
        }
        
        if (request.getCodigoSeguridad() == null || request.getCodigoSeguridad().trim().isEmpty()) {
            return "El código de seguridad es obligatorio";
        }
        
        return null; // Validación exitosa
    }
    
    private String validarDatosTransferencia(ConfirmarCarritoRequestDTO request) {
        if ((request.getCbu() == null || request.getCbu().trim().isEmpty()) &&
            (request.getAlias() == null || request.getAlias().trim().isEmpty())) {
            return "Debe proporcionar un CBU o un alias para la transferencia";
        }
        return null; // Validación exitosa
    }
    
    private boolean procesarMetodoPago(ConfirmarCarritoRequestDTO request) {
        // Aquí iría la lógica real de procesamiento de pago
        // Por ahora simulamos que siempre es exitoso
        
        switch (request.getMetodoPago()) {
            case TARJETA_CREDITO:
                return procesarPagoTarjetaCredito(request);
            case TARJETA_DEBITO:
                return procesarPagoTarjetaDebito(request);
            case TRANSFERENCIA:
                return procesarPagoTransferencia(request);
            default:
                return false;
        }
    }
    
    private boolean procesarPagoTarjetaCredito(ConfirmarCarritoRequestDTO request) {
        // Simular procesamiento de tarjeta de crédito
        System.out.println("Procesando pago con tarjeta de crédito: " + request.getNumeroTarjeta().substring(0, 4) + "****");
        return true; // Simulamos que siempre es exitoso
    }
    
    private boolean procesarPagoTarjetaDebito(ConfirmarCarritoRequestDTO request) {
        // Simular procesamiento de tarjeta de débito
        System.out.println("Procesando pago con tarjeta de débito: " + request.getNumeroTarjeta().substring(0, 4) + "****");
        return true; // Simulamos que siempre es exitoso
    }
    
    private boolean procesarPagoTransferencia(ConfirmarCarritoRequestDTO request) {
        // Simular procesamiento de transferencia
        if (request.getCbu() != null && !request.getCbu().isEmpty()) {
            System.out.println("Procesando transferencia a CBU: " + request.getCbu());
        } else {
            System.out.println("Procesando transferencia a alias: " + request.getAlias());
        }
        return true; // Simulamos que siempre es exitoso
    }
    
    private String generarResumenPago(ConfirmarCarritoRequestDTO request, double monto) {
        StringBuilder resumen = new StringBuilder();
        resumen.append("Pago procesado - ");
        resumen.append("Método: ").append(request.getMetodoPago().name()).append(" - ");
        resumen.append("Monto: $").append(String.format("%.2f", monto));
        
        switch (request.getMetodoPago()) {
            case TARJETA_CREDITO:
            case TARJETA_DEBITO:
                String ultimosDigitos = request.getNumeroTarjeta().length() >= 4 ? 
                    request.getNumeroTarjeta().substring(request.getNumeroTarjeta().length() - 4) : "****";
                resumen.append(" - Tarjeta terminada en: ").append(ultimosDigitos);
                break;
            case TRANSFERENCIA:
                if (request.getCbu() != null && !request.getCbu().isEmpty()) {
                    resumen.append(" - CBU: ").append(request.getCbu());
                } else if (request.getAlias() != null && !request.getAlias().isEmpty()) {
                    resumen.append(" - Alias: ").append(request.getAlias());
                }
                break;
        }
        
        if (request.getObservaciones() != null && !request.getObservaciones().isEmpty()) {
            resumen.append(" - Observaciones: ").append(request.getObservaciones());
        }
        
        return resumen.toString();
    }
    
    private List<ItemPedidoDTO> convertirItemsADTO(Pedido carrito) {
        List<ItemPedidoDTO> itemsDTO = new ArrayList<>();
        
        // Obtener items del carrito usando el repositorio
        Set<ItemPedido> items = itemPedidoRepository.findByPedido(carrito);
        
        System.out.println("Cantidad de items encontrados: " + items.size());
        
        for (ItemPedido item : items) {
            ItemPedidoDTO dto = new ItemPedidoDTO();
            dto.itemPedidoId = item.getItempedidoid();
            dto.itemMenuId = item.getItemMenu().getItemid();
            dto.nombre = item.getItemMenu().getNombre();
            dto.precioUnitario = item.getItemMenu().getPrecio();
            dto.cantidad = item.getCantidad();
            dto.subtotal = item.getSubtotal();
            itemsDTO.add(dto);
            
            System.out.println("Item agregado: " + dto.nombre + " - Cantidad: " + dto.cantidad);
        }
        
        return itemsDTO;
    }
    
    public ConfirmarCarritoResponseDTO obtenerResumenPago(Long pedidoId) {
        ConfirmarCarritoResponseDTO response = new ConfirmarCarritoResponseDTO();
        
        try {
            // Buscar el pedido por ID
            Pedido pedido = pedidoRepository.findById(pedidoId).orElse(null);
            
            if (pedido == null) {
                response.resultado.setStatus(404);
                response.resultado.setMensaje("Pedido no encontrado");
                return response;
            }
            
            // Verificar que el pedido pertenezca al cliente actual
            if (!pedido.getCliente().getClienteid().equals(sesion.getIdSesionActual())) {
                response.resultado.setStatus(403);
                response.resultado.setMensaje("No tienes permisos para ver este pedido");
                return response;
            }
            
            // Llenar la respuesta con los datos del pedido
            response.setVendedorId(pedido.getVendedor().getVendedorid());
            response.setVendedorNombre(pedido.getVendedor().getNombre());
            response.setVendedorCuit(pedido.getVendedor().getCuit());
            response.setVendedorCbu(pedido.getVendedor().getCbu());
            
            // Obtener items del pedido
            response.setItems(convertirItemsADTO(pedido));
            
            // Calcular subtotal
            double subtotal = response.getItems().stream().mapToDouble(item -> item.subtotal).sum();
            response.setSubtotal(subtotal);
            
            // Obtener información del pago para calcular recargo y método de pago
            List<Pago> pagos = pagoRepository.findByPedidoPedidoid(pedido.getPedidoid());
            if (!pagos.isEmpty()) {
                MetodoPago metodoPago = pagos.get(0).getMetodoPago();
                response.setMetodoPago(metodoPago);
                
                if (metodoPago == MetodoPago.TARJETA_CREDITO) {
                    response.setRecargo(subtotal * 0.10); // 10% de recargo
                } else {
                    response.setRecargo(0.0);
                }
            } else {
                response.setRecargo(0.0);
            }
            
            response.setTotal(subtotal + response.getRecargo());
            
            // Usar el tiempo de envío del pedido (ya calculado en CarritoService)
            Integer tiempoEnvio = pedido.getTiempo_envio();
            response.setTiempoEnvio(tiempoEnvio != null ? tiempoEnvio : 30); // Por defecto 30 minutos
            
            response.setPedidoId(pedido.getPedidoid());
            
            response.resultado.setStatus(200);
            response.resultado.setMensaje("Resumen obtenido correctamente");
            
        } catch (Exception e) {
            response.resultado.setStatus(500);
            response.resultado.setMensaje("Error al obtener el resumen: " + e.getMessage());
        }
        
        return response;
    }
    
    public byte[] generarPDF(Long pedidoId) {
        try {
            // Por ahora, genero un PDF simple como placeholder
            // Aquí se podría usar una librería como iText o similar
            String contenido = "RESUMEN DE PEDIDO #" + pedidoId + "\n\n";
            
            Pedido pedido = pedidoRepository.findById(pedidoId).orElse(null);
            if (pedido != null) {
                contenido += "Vendedor: " + pedido.getVendedor().getNombre() + "\n";
                contenido += "Cliente: " + pedido.getCliente().getNombre() + "\n";
                contenido += "Fecha: " + pedido.getFechaConfirmacion() + "\n\n";
                
                contenido += "ITEMS:\n";
                Set<ItemPedido> items = itemPedidoRepository.findByPedido(pedido);
                for (ItemPedido item : items) {
                    contenido += item.getCantidad() + "x " + item.getItemMenu().getNombre() + 
                               " - $" + item.getSubtotal() + "\n";
                }
                
                List<Pago> pagos = pagoRepository.findByPedidoPedidoid(pedido.getPedidoid());
                if (!pagos.isEmpty()) {
                    Pago pago = pagos.get(0);
                    contenido += "\nMétodo de pago: " + pago.getMetodoPago() + "\n";
                    contenido += "Total: $" + pago.getMonto() + "\n";
                }
            }
            
            // Por simplicidad, devuelvo el contenido como texto (debería ser PDF real)
            return contenido.getBytes("UTF-8");
            
        } catch (Exception e) {
            return ("Error generando PDF: " + e.getMessage()).getBytes();
        }
    }
}

package com.seminario.backend.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.seminario.backend.dto.request.carrito.ConfirmarCarritoRequestDTO;
import com.seminario.backend.dto.response.carrito.ConfirmarCarritoResponseDTO;
import com.seminario.backend.enums.EstadoPedido;
import com.seminario.backend.enums.MetodoPago;
import com.seminario.backend.model.ItemPedido;
import com.seminario.backend.model.Pedido;
import com.seminario.backend.repository.PedidoRepository;
import com.seminario.backend.sesion.SesionMockeada;

@Service
public class PagoService {
    
    private final PedidoRepository pedidoRepository;
    private final SesionMockeada sesion;
    
    public PagoService(PedidoRepository pedidoRepository, SesionMockeada sesion) {
        this.pedidoRepository = pedidoRepository;
        this.sesion = sesion;
    }
    
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
            if (!validarDatosPago(request)) {
                response.resultado.setStatus(400);
                response.resultado.setMensaje("Datos de pago inválidos");
                return response;
            }
            
            // Procesar el pago según el método elegido
            boolean pagoExitoso = procesarMetodoPago(request);
            
            if (!pagoExitoso) {
                response.resultado.setStatus(400);
                response.resultado.setMensaje("Error al procesar el pago");
                return response;
            }
            
            // Actualizar el estado del pedido
            System.out.println("Estado del pedido antes del pago: " + carrito.getEstado());
            carrito.setEstado(EstadoPedido.PAGADO);
            carrito.setFechaConfirmacion(LocalDateTime.now());
            
            // Calcular el precio total
            double precioTotal = 0.0;
            for (ItemPedido item : carrito.getListaItemPedido()) {
                precioTotal += item.getCantidad() * item.getItemMenu().getPrecio();
            }
            carrito.setPrecio(precioTotal);
            
            // Guardar los cambios en el pedido
            Pedido pedidoGuardado = pedidoRepository.save(carrito);
            System.out.println("Pedido guardado con estado: " + pedidoGuardado.getEstado() + " e ID: " + pedidoGuardado.getPedidoid());
            
            // Configurar la respuesta
            response.setTotal(precioTotal);
            response.resultado.setStatus(0);
            response.resultado.setMensaje("Pago procesado exitosamente. Pedido confirmado.");
            
        } catch (Exception e) {
            response.resultado.setStatus(500);
            response.resultado.setMensaje("Error interno del servidor: " + e.getMessage());
        }
        
        return response;
    }
    
    private boolean validarDatosPago(ConfirmarCarritoRequestDTO request) {
        if (request.getMetodoPago() == null) {
            return false;
        }
        
        switch (request.getMetodoPago()) {
            case TARJETA_CREDITO:
            case TARJETA_DEBITO:
                return validarDatosTarjeta(request);
            case TRANSFERENCIA:
                return validarDatosTransferencia(request);
            default:
                return false;
        }
    }
    
    private boolean validarDatosTarjeta(ConfirmarCarritoRequestDTO request) {
        if (request.getNumeroTarjeta() == null || request.getNumeroTarjeta().length() < 15) {
            return false;
        }
        
        // Validar que tarjeta de crédito empiece con 4 y débito con 5
        if (request.getMetodoPago() == MetodoPago.TARJETA_CREDITO) {
            if (!request.getNumeroTarjeta().startsWith("4")) {
                return false;
            }
        } else if (request.getMetodoPago() == MetodoPago.TARJETA_DEBITO) {
            if (!request.getNumeroTarjeta().startsWith("5")) {
                return false;
            }
        }
        
        return request.getNombreTitular() != null && !request.getNombreTitular().isEmpty() &&
               request.getFechaVencimiento() != null && !request.getFechaVencimiento().isEmpty() &&
               request.getCodigoSeguridad() != null && !request.getCodigoSeguridad().isEmpty();
    }
    
    private boolean validarDatosTransferencia(ConfirmarCarritoRequestDTO request) {
        return (request.getCbu() != null && !request.getCbu().isEmpty()) ||
               (request.getAlias() != null && !request.getAlias().isEmpty());
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
}

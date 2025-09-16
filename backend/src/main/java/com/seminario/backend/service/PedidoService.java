package com.seminario.backend.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.Set;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.seminario.backend.dto.ItemPedidoDTO;
import com.seminario.backend.dto.PedidoDTO;
import com.seminario.backend.dto.request.CalificarPedidoRequestDTO;
import com.seminario.backend.dto.request.pedido.VerPedidosResponseDTO;
import com.seminario.backend.dto.response.CalificarPedidoResponseDTO;
import com.seminario.backend.dto.response.EstadoPedidoResponseDTO;
import com.seminario.backend.enums.EstadoPedido;
import com.seminario.backend.model.Calificacion;
import com.seminario.backend.model.ItemPedido;
import com.seminario.backend.model.Pedido;
import com.seminario.backend.model.Vendedor;
import com.seminario.backend.repository.CalificacionRepository;
import com.seminario.backend.repository.ItemPedidoRepository;
import com.seminario.backend.repository.PedidoRepository;
import com.seminario.backend.repository.VendedorRepository;
import com.seminario.backend.sesion.SesionMockeada;

@Service
public class PedidoService {
    
    private final PedidoRepository pedidoRepository;
    private final ItemPedidoRepository itemPedidoRepository;
    private final SesionMockeada sesion;
    private final VendedorRepository vendedorRepository;   
    private final CalificacionRepository calificacionRepository; 
    private final Random random = new Random();
    
    public PedidoService(PedidoRepository pedidoRepository, SesionMockeada sesion, ItemPedidoRepository itemPedidoRepository, VendedorRepository vendedorRepository, CalificacionRepository calificacionRepository) {
        this.pedidoRepository = pedidoRepository;
        this.sesion = sesion;
        this.itemPedidoRepository = itemPedidoRepository;
        this.vendedorRepository = vendedorRepository;
        this.calificacionRepository = calificacionRepository;
    }
    
    @Async
    public void programarTransicionesPedido(Long pedidoId) {
        try {
            // Esperar tiempo aleatorio para pasar a EN_ENVIO (1-5 minutos)
            int tiempoPreparacionSegundos = 10 + random.nextInt(10); // 10-20 segundos
            Thread.sleep(tiempoPreparacionSegundos * 1000);
            
            // Transición a EN_ENVIO
            Pedido pedido = pedidoRepository.findById(pedidoId).orElse(null);
            if (pedido != null && pedido.getEstado() == EstadoPedido.CONFIRMADO) {
                pedido.setEstado(EstadoPedido.EN_ENVIO);
                pedido.setFechaModificacion(LocalDateTime.now());
                pedidoRepository.save(pedido);
                System.out.println("🚚 Pedido " + pedidoId + " cambió a EN_ENVIO");
                
                // Esperar tiempo de envío + variación aleatoria
                int tiempoEnvioMinutos = pedido.getTiempo_envio() != null ? pedido.getTiempo_envio() : 30;
                Thread.sleep(tiempoEnvioMinutos >15 ? 15000:tiempoEnvioMinutos*1000 ); 
                
                // Transición a ENTREGADO
                pedido = pedidoRepository.findById(pedidoId).orElse(null);
                if (pedido != null && pedido.getEstado() == EstadoPedido.EN_ENVIO) {
                    pedido.setEstado(EstadoPedido.ENTREGADO);
                    pedido.setFechaModificacion(LocalDateTime.now());
                    pedidoRepository.save(pedido);
                    System.out.println("✅ Pedido " + pedidoId + " cambió a ENTREGADO");
                }
            }
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("❌ Error en transición de pedido " + pedidoId + ": " + e.getMessage());
        } catch (Exception e) {
            System.err.println("❌ Error inesperado en pedido " + pedidoId + ": " + e.getMessage());
        }
    }
    
    public Pedido obtenerPedido(Long pedidoId) {
        return pedidoRepository.findById(pedidoId).orElse(null);
    }

    public EstadoPedidoResponseDTO obtenerEstadoPedido(Long pedidoId) {
        EstadoPedidoResponseDTO response = new EstadoPedidoResponseDTO();
        
        try {
            Pedido pedido = pedidoRepository.findById(pedidoId).orElse(null);
            
            if (pedido == null) {
                response.resultado.status = 1;
                response.resultado.mensaje = "Pedido no encontrado";
                return response;
            }


            response.setPedidoId(pedidoId);
            response.setEstado(pedido.getEstado());
            response.setEstadoTexto(obtenerTextoEstado(pedido.getEstado()));
            
            // Calcular progreso y tiempo restante
            calcularProgresoPedido(pedido, response);
            
            response.resultado.status = 0;
            response.resultado.mensaje = "Estado obtenido correctamente";
            
        } catch (Exception e) {
            response.resultado.status = 1;
            response.resultado.mensaje = "Error al obtener estado: " + e.getMessage();
        }
        
        return response;
    }

    private void calcularProgresoPedido(Pedido pedido, EstadoPedidoResponseDTO response) {
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime fechaConfirmacion = pedido.getFechaConfirmacion();
        
        if (fechaConfirmacion == null) {
            response.setProgreso(0.0);
            response.setTiempoRestante(0);
            response.setTiempoTotal(0);
            return;
        }

        // Tiempos en minutos para cada estado
        int tiempoTotal = pedido.getTiempo_envio() != null ? pedido.getTiempo_envio() : 30;
        long minutosTranscurridos = ChronoUnit.MINUTES.between(fechaConfirmacion, ahora);
        
        switch (pedido.getEstado()) {
            case CONFIRMADO:
                response.setProgreso(0.0);
                response.setTiempoRestante(tiempoTotal);
                response.setSiguienteEstado("En Envío");
                break;
            case EN_ENVIO:
                double progresoEnvio = Math.min((double) minutosTranscurridos / tiempoTotal * 50.0, 50.0);
                response.setProgreso(progresoEnvio);
                response.setTiempoRestante(Math.max(0, tiempoTotal - (int) minutosTranscurridos));
                response.setSiguienteEstado("Entregado");
                break;
            case ENTREGADO:
                response.setProgreso(100.0);
                response.setTiempoRestante(0);
                response.setSiguienteEstado("Completado");
                break;
            default:
                response.setProgreso(0.0);
                response.setTiempoRestante(tiempoTotal);
                break;
        }
        
        response.setTiempoTotal(tiempoTotal);
    }

    private String obtenerTextoEstado(EstadoPedido estado) {
        switch (estado) {
            case EN_CARRITO: return "En Carrito";
            case PAGADO: return "Pago Confirmado";
            case CONFIRMADO: return "Pedido Confirmado";
            case EN_ENVIO: return "En Camino";
            case ENTREGADO: return "Entregado";
            default: return "Estado Desconocido";
        }
    }
    

    public List<Pedido> obtenerPedidosPorEstado(EstadoPedido estado) {
        return pedidoRepository.findByEstado(estado);
    }
    

    public boolean forzarTransicionEstado(Long pedidoId, EstadoPedido nuevoEstado) {
        try {
            Pedido pedido = pedidoRepository.findById(pedidoId).orElse(null);
            if (pedido == null) {
                return false;
            }
            
            pedido.setEstado(nuevoEstado);
            pedido.setFechaModificacion(LocalDateTime.now());
            pedidoRepository.save(pedido);
            
            System.out.println("🔄 Estado del pedido " + pedidoId + " cambiado manualmente a " + nuevoEstado);
            return true;
        } catch (Exception e) {
            System.err.println("❌ Error forzando transición: " + e.getMessage());
            return false;
        }
    }

    public VerPedidosResponseDTO verPedidosEnCurso() {
        List<EstadoPedido> estados = List.of(EstadoPedido.CONFIRMADO, EstadoPedido.EN_ENVIO);
       VerPedidosResponseDTO response = new VerPedidosResponseDTO();
       List<Pedido> pedidos = pedidoRepository.findByClienteClienteidAndEstadoIn(sesion.getIdSesionActual(),estados);
       if(pedidos!=null && !pedidos.isEmpty()){
       for (Pedido p: pedidos){
        PedidoDTO pedidoDTO = new PedidoDTO();
        pedidoDTO.pedidoID = p.getPedidoid();
        pedidoDTO.fechaConfirmacion = p.getFechaConfirmacion().toString();
        pedidoDTO.nombreVendedor = p.getVendedor().getNombre();
        pedidoDTO.estado = p.getEstado().toString();
        pedidoDTO.precio = p.getPrecio();
        pedidoDTO.costoEnvio = p.getCostoEnvio();
        pedidoDTO.subtotalItems = p.getSubTotal_Total();
        Set<ItemPedido> items = itemPedidoRepository.findByPedido(p);
        for(ItemPedido item: items){
            ItemPedidoDTO itemDTO = new ItemPedidoDTO();
            itemDTO.itemMenuId = item.getItemMenu().getItemid();
            itemDTO.nombre = item.getItemMenu().getNombre();
            itemDTO.precioUnitario = item.getItemMenu().getPrecio();   
            itemDTO.cantidad = item.getCantidad();
            itemDTO.subtotal = item.getCantidad() * item.getItemMenu().getPrecio();
            pedidoDTO.items.add(itemDTO); 
        }
        response.pedidos.add(pedidoDTO);
       }
        response.resultado.status = 0;
        response.resultado.mensaje = "Historial obtenido correctamente";
       } else {
           response.resultado.status = 1;
           response.resultado.mensaje = "No se encontraron pedidos en el historial";
       }
       return response;
    }

    public VerPedidosResponseDTO verHistorialPedidos() {
    
       VerPedidosResponseDTO response = new VerPedidosResponseDTO();
       List<Pedido> pedidos = pedidoRepository.findAllByClienteClienteidAndEstado(sesion.getIdSesionActual(),EstadoPedido.ENTREGADO);
       if(pedidos!=null && !pedidos.isEmpty()){
       for (Pedido p: pedidos){
        PedidoDTO pedidoDTO = new PedidoDTO();
        pedidoDTO.pedidoID = p.getPedidoid();
        pedidoDTO.fechaConfirmacion = p.getFechaConfirmacion().toString();
        pedidoDTO.nombreVendedor = p.getVendedor().getNombre();
        pedidoDTO.estado = p.getEstado().toString();
        pedidoDTO.precio = p.getPrecio();
        pedidoDTO.costoEnvio = p.getCostoEnvio();
        pedidoDTO.subtotalItems = p.getSubTotal_Total();
        Set<ItemPedido> items = itemPedidoRepository.findByPedido(p);
        for(ItemPedido item: items){
            ItemPedidoDTO itemDTO = new ItemPedidoDTO();
            itemDTO.itemMenuId = item.getItemMenu().getItemid();
            itemDTO.nombre = item.getItemMenu().getNombre();
            itemDTO.precioUnitario = item.getItemMenu().getPrecio();   
            itemDTO.cantidad = item.getCantidad();
            itemDTO.subtotal = item.getCantidad() * item.getItemMenu().getPrecio();
            pedidoDTO.items.add(itemDTO); 
        }
        response.pedidos.add(pedidoDTO);
       }
        response.resultado.status = 0;
        response.resultado.mensaje = "Historial obtenido correctamente";
       } else {
           response.resultado.status = 1;
           response.resultado.mensaje = "No se encontraron pedidos en el historial";
       }
       return response;
    }

    public CalificarPedidoResponseDTO calificar(CalificarPedidoRequestDTO request){
        CalificarPedidoResponseDTO response = new CalificarPedidoResponseDTO();
        Pedido pedido = pedidoRepository.findById(request.pedidoId).orElse(null);
        if(pedido == null || pedido.getEstado() != EstadoPedido.ENTREGADO){
            response.resultado.status = 1;
            response.resultado.mensaje = "Pedido no encontrado o no entregado";
            return response;
        }
        if(pedido.getCalificado() != null && pedido.getCalificado()){
            response.resultado.status = 1;
            response.resultado.mensaje = "Pedido ya ha sido calificado";
            return response;
        } 
        Calificacion calificacion = new Calificacion();
        calificacion.setPedido(pedido);
        calificacion.setPuntaje(request.calificacion);
        calificacion.setComentario(request.comentario);
        calificacion.setFechaCalificacion(LocalDateTime.now());

        Vendedor vendedor = vendedorRepository.findById(pedido.getVendedor().getVendedorid()).orElse(null);
        if (vendedor != null) {
            int nuevaCantidad = (vendedor.getCantidadCalificaciones() != null ? vendedor.getCantidadCalificaciones() : 0) + 1;
            double calificacionActual = vendedor.getCalificacionPromedio() != null ? vendedor.getCalificacionPromedio() : 0.0;
            double nuevaCalificacionPromedio = ((calificacionActual * (nuevaCantidad - 1)) + request.calificacion) / nuevaCantidad;
            vendedor.setCalificacionPromedio(nuevaCalificacionPromedio);
            vendedor.setCantidadCalificaciones(nuevaCantidad);
            vendedorRepository.save(vendedor);
        }
        pedido.setCalificado(true);
        pedidoRepository.save(pedido);
        calificacionRepository.save(calificacion);
        response.resultado.status = 0;
        response.resultado.mensaje = "Calificación registrada con éxito";


        return response;
    }
}
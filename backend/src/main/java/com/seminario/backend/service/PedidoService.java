package com.seminario.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.seminario.backend.enums.EstadoPedido;
import com.seminario.backend.model.Pedido;
import com.seminario.backend.repository.PedidoRepository;

@Service
public class PedidoService {
    
    private final PedidoRepository pedidoRepository;
    private final Random random = new Random();
    
    public PedidoService(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }
    
    /**
     * Ejecuta cada 30 segundos para verificar transiciones pendientes
     */
    // @Scheduled(fixedRate = 30000) // 30 segundos
    // public void procesarTransicionesEstado() {
    //     procesarConfirmadoAEnEnvio();
    //     procesarEnEnvioAEntregado();
    // }

    
    /**
     * Programa las transiciones automáticas para un pedido recién confirmado
     */
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
    
    /**
     * Procesa pedidos CONFIRMADOS que deben pasar a EN_ENVIO (respaldo del método async)
     */
    // private void procesarConfirmadoAEnEnvio() {
    //     try {
    //         List<Pedido> pedidosConfirmados = pedidoRepository.findByEstado(EstadoPedido.CONFIRMADO);
            
    //         for (Pedido pedido : pedidosConfirmados) {
    //             if (debeTransicionarAEnEnvio(pedido)) {
    //                 pedido.setEstado(EstadoPedido.EN_ENVIO);
    //                 pedido.setFechaModificacion(LocalDateTime.now());
    //                 pedidoRepository.save(pedido);
                    
    //                 System.out.println("🚚 Pedido " + pedido.getPedidoid() + " cambió a EN_ENVIO (scheduled)");
    //             }
    //         }
    //     } catch (Exception e) {
    //         System.err.println("❌ Error procesando transiciones CONFIRMADO->EN_ENVIO: " + e.getMessage());
    //     }
    // }
    
    /**
     * Procesa pedidos EN_ENVIO que deben pasar a ENTREGADO (respaldo del método async)
     */
    // private void procesarEnEnvioAEntregado() {
    //     try {
    //         List<Pedido> pedidosEnEnvio = pedidoRepository.findByEstado(EstadoPedido.EN_ENVIO);
            
    //         for (Pedido pedido : pedidosEnEnvio) {
    //             if (debeTransicionarAEntregado(pedido)) {
    //                 pedido.setEstado(EstadoPedido.ENTREGADO);
    //                 pedido.setFechaModificacion(LocalDateTime.now());
    //                 pedidoRepository.save(pedido);
                    
    //                 System.out.println("✅ Pedido " + pedido.getPedidoid() + " cambió a ENTREGADO (scheduled)");
    //             }
    //         }
    //     } catch (Exception e) {
    //         System.err.println("❌ Error procesando transiciones EN_ENVIO->ENTREGADO: " + e.getMessage());
    //     }
    // }
    
    /**
     * Determina si un pedido CONFIRMADO debe pasar a EN_ENVIO
     * Tiempo aleatorio entre 1-5 minutos desde la confirmación
     */
    // private boolean debeTransicionarAEnEnvio(Pedido pedido) {
    //     if (pedido.getFechaConfirmacion() == null) {
    //         return false;
    //     }
        
    //     // Tiempo fijo de 5 minutos como máximo para el respaldo
    //     LocalDateTime tiempoLimite = pedido.getFechaConfirmacion().plusMinutes(5);
    //     return LocalDateTime.now().isAfter(tiempoLimite);
    // }
    
    // /**
    //  * Determina si un pedido EN_ENVIO debe pasar a ENTREGADO
    //  * Usa el tiempo estimado de envío + tiempo máximo de respaldo
    //  */
    // private boolean debeTransicionarAEntregado(Pedido pedido) {
    //     if (pedido.getFechaModificacion() == null) {
    //         return false;
    //     }
        
    //     // Tiempo estimado + 50% adicional como respaldo
    //     int tiempoEstimadoMinutos = pedido.getTiempo_envio() != null ? pedido.getTiempo_envio() : 30;
    //     int tiempoMaximo = (int) (tiempoEstimadoMinutos * 1.5); // 50% adicional
        
    //     LocalDateTime tiempoLimite = pedido.getFechaModificacion().plusMinutes(tiempoMaximo);
    //     return LocalDateTime.now().isAfter(tiempoLimite);
    // }
    
    /**
     * Obtiene el estado actual de un pedido
     */
    public Pedido obtenerPedido(Long pedidoId) {
        return pedidoRepository.findById(pedidoId).orElse(null);
    }
    
    /**
     * Obtiene todos los pedidos por estado
     */
    public List<Pedido> obtenerPedidosPorEstado(EstadoPedido estado) {
        return pedidoRepository.findByEstado(estado);
    }
    
    /**
     * Fuerza la transición manual de un pedido (para testing)
     */
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
}
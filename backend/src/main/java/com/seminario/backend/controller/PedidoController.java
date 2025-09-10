package com.seminario.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seminario.backend.dto.request.pedido.VerPedidosResponseDTO;
import com.seminario.backend.dto.response.EstadoPedidoResponseDTO;
import com.seminario.backend.service.PedidoService;

@RestController
//@Controller
@RequestMapping("/pedido")
@CrossOrigin(origins = "http://localhost:3000")
public class PedidoController {
    private final PedidoService pedidoService;  
    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping("/{pedidoId}/estado")
    public ResponseEntity<EstadoPedidoResponseDTO> obtenerEstadoPedido(@PathVariable Long pedidoId) {
        EstadoPedidoResponseDTO response = pedidoService.obtenerEstadoPedido(pedidoId);
        
        if (response.resultado.status == 0) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(400).body(response);
        }
    }

    @GetMapping("/curso")
    public VerPedidosResponseDTO verPedidosEnCurso() {
        return pedidoService.verPedidosEnCurso();
    }

    
    @GetMapping("/historial")
    public VerPedidosResponseDTO verHistorialPedidos() {
        return pedidoService.verHistorialPedidos();
    }
}
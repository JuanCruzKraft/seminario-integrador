package com.seminario.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seminario.backend.dto.request.CrearPedidoRequestDTO;
import com.seminario.backend.dto.response.CrearPedidoResponseDTO;
import com.seminario.backend.model.Pedido;
import com.seminario.backend.service.PedidoService;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {
    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }
 @PostMapping("/crear")
public ResponseEntity<CrearPedidoResponseDTO> crearPedido(@RequestBody CrearPedidoRequestDTO request) {
    try {
        Pedido pedido = pedidoService.crearPedido(request);
        CrearPedidoResponseDTO response = pedidoService.armarResponse(pedido);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        CrearPedidoResponseDTO errorResponse = new CrearPedidoResponseDTO();
        // opcional: setear mensaje o status de error si agregás esos campos al DTO
        return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
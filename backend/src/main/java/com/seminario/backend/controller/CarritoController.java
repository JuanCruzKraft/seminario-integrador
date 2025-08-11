package com.seminario.backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seminario.backend.dto.request.carrito.CrearCarritoRequestDTO;
import com.seminario.backend.dto.response.carrito.CrearCarritoResponseDTO;
import com.seminario.backend.service.PedidoService;

@RestController
//@Controller
@RequestMapping("/carrito")
public class CarritoController {

   // private final PedidoService pedidoService;
    
    @PostMapping("/crear")
    public CrearCarritoResponseDTO crearCarrito(@RequestBody CrearCarritoRequestDTO request) {
        //return pedidoService.crearCarrito(request);
        return null; // Placeholder for actual implementation
    }

    
}

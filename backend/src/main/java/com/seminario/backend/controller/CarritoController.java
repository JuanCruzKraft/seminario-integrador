package com.seminario.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seminario.backend.dto.request.carrito.AgregarItemRequestDTO;
import com.seminario.backend.dto.request.carrito.CrearCarritoRequestDTO;
import com.seminario.backend.dto.request.carrito.EliminarCarritoRequestDTO;
import com.seminario.backend.dto.response.carrito.AgregarItemResponseDTO;
import com.seminario.backend.dto.response.carrito.CrearCarritoResponseDTO;
import com.seminario.backend.dto.response.carrito.EliminarCarritoResponseDTO;
import com.seminario.backend.service.CarritoService;
import com.seminario.backend.service.PedidoService;

@RestController
//@Controller
@RequestMapping("/carrito")
@CrossOrigin(origins = "http://localhost:3000")
public class CarritoController {
    private final CarritoService carritoService;
    public CarritoController(CarritoService carritoService) {
        this.carritoService = carritoService;
    }
   // private final PedidoService pedidoService;
    

    @PostMapping("/agregarItem")
    public AgregarItemResponseDTO agregarItem(@RequestBody AgregarItemRequestDTO request) {
        return carritoService.agregarItem(request);
    }

    @PostMapping("/eliminar")
    public EliminarCarritoResponseDTO eliminarCarrito(@RequestBody EliminarCarritoRequestDTO request) {
        return carritoService.eliminarCarrito(request);
    }

    
}
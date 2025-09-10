package com.seminario.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seminario.backend.dto.request.carrito.AgregarItemRequestDTO;
import com.seminario.backend.dto.request.carrito.ConfirmarCarritoRequestDTO;
import com.seminario.backend.dto.request.carrito.CrearCarritoRequestDTO;
import com.seminario.backend.dto.request.carrito.EliminarCarritoRequestDTO;
import com.seminario.backend.dto.request.carrito.EliminarItemRequestDTO;
import com.seminario.backend.dto.request.carrito.ModificarCantidadRequestDTO;
import com.seminario.backend.dto.response.carrito.AgregarItemResponseDTO;
import com.seminario.backend.dto.response.carrito.ConfirmarCarritoResponseDTO;
import com.seminario.backend.dto.response.carrito.CrearCarritoResponseDTO;
import com.seminario.backend.dto.response.carrito.EliminarCarritoResponseDTO;
import com.seminario.backend.dto.response.carrito.EliminarItemResponseDTO;
import com.seminario.backend.dto.response.carrito.ModificarCantidadResponseDTO;
import com.seminario.backend.dto.response.carrito.VisualizarCarritoResponseDTO;
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
    public EliminarCarritoResponseDTO eliminarCarrito() {
        return carritoService.eliminarCarrito();
    }

    @GetMapping("/ver")
    public VisualizarCarritoResponseDTO visualizarCarrito() {
        return carritoService.visualizarCarrito();
    }

    @PostMapping("/modificarCantidad")
    public ModificarCantidadResponseDTO modificarCantidad(@RequestBody ModificarCantidadRequestDTO request) {
        return carritoService.modificarCantidadItem(request);
    }

    @PostMapping("/eliminarItem")
    public EliminarItemResponseDTO eliminarItem(@RequestBody EliminarItemRequestDTO request) {
        return carritoService.eliminarItem(request);
    }
    
    
}
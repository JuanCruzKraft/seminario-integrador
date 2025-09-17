package com.seminario.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seminario.backend.dto.request.BuscarVendedorPorNombreRequestDTO;
import com.seminario.backend.dto.request.VisualizarCalificacionVendedorRequestDTO;
import com.seminario.backend.dto.request.VisualizarVendedorQueVendeDTORequest;
import com.seminario.backend.dto.response.VisualizarCalificacionVendedorResponseDTO;
import com.seminario.backend.dto.response.VisualizarVendedoresResponseDTO;
import com.seminario.backend.model.Coordenada;
import com.seminario.backend.service.VendedorService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
//@Controller
@RequestMapping("/vendedores")
@CrossOrigin(origins = "http://localhost:3000")
public class VendedorController {
    private final VendedorService vendedorService;

    public VendedorController(VendedorService vendedorService) {
        this.vendedorService = vendedorService;
    }
    

    @GetMapping("/listar")
    public VisualizarVendedoresResponseDTO visualizarVendedores() {
        return vendedorService.visualizarVendedores(); 
    }
    
    @PostMapping("/listar-menu-contiene")
    public VisualizarVendedoresResponseDTO visualizarVendedorQueVenden(@RequestBody VisualizarVendedorQueVendeDTORequest request){
        return vendedorService.visualizarVendedorQueVenden(request.nombreProducto);
    }

    @PostMapping("/buscar-por-nombre")
    public VisualizarVendedoresResponseDTO buscarVendedoresPorNombre(@RequestBody BuscarVendedorPorNombreRequestDTO request){
        return vendedorService.buscarVendedoresPorNombre(request.nombreVendedor);
    }

    @PostMapping("/calificaciones")
    public VisualizarCalificacionVendedorResponseDTO visualizarCalificaciones(@RequestBody VisualizarCalificacionVendedorRequestDTO request){
        return vendedorService.visualizarCalificaciones(request);
    }
    
    
}




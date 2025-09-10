package com.seminario.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seminario.backend.dto.request.BuscarVendedorPorNombreRequestDTO;
import com.seminario.backend.dto.request.VisualizarVendedorQueVendeDTORequest;
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

    // estas funciones no son parte del sistema. es para el desarrollo nomas
    //hay q borrarlas antes de la presentacion
    
    
}




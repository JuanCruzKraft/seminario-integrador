package com.seminario.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seminario.backend.dto.response.VisualizarVendedoresResponseDTO;
import com.seminario.backend.service.VendedorService;

import org.springframework.web.bind.annotation.GetMapping;
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
    
    
}

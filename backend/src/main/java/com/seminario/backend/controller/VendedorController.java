package com.seminario.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seminario.backend.dto.request.VisualizarVendedorQueVendeDTORequest;
import com.seminario.backend.dto.response.VisualizarVendedoresResponseDTO;
import com.seminario.backend.model.Coordenada;
import com.seminario.backend.service.VendedorService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
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
    
    @GetMapping("/listar-menu-contiene")
    public VisualizarVendedoresResponseDTO visualizarVendedorQueVenden(@RequestBody VisualizarVendedorQueVendeDTORequest request){
        return vendedorService.visualizarVendedorQueVenden(request.nombreProducto);
    }

    // estas funciones no son parte del sistema. es para el desarrollo nomas
    //hay q borrarlas antes de la presentacion
    
    
}




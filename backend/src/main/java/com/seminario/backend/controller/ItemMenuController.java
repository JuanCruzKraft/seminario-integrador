package com.seminario.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seminario.backend.dto.request.VisualizarItemMenuRequestDTO;
import com.seminario.backend.dto.response.VisualizarItemMenuResponseDTO;
import com.seminario.backend.service.ItemMenuService;

@RestController
@RequestMapping("/itemMenu")
public class ItemMenuController {
    private final ItemMenuService itemMenuService;

    public ItemMenuController(ItemMenuService itemMenuService) {
        this.itemMenuService = itemMenuService;
    }

    @GetMapping("/visualizar/{vendedorid}")
    public VisualizarItemMenuResponseDTO visualizarItemMenu(@PathVariable Long vendedorid) {//VisualizarItemMenuRequestDTO request
        VisualizarItemMenuRequestDTO request = new VisualizarItemMenuRequestDTO();
        request.setVendedorid(vendedorid);
        return itemMenuService.visualizarItemMenu( request);
    }
    
}

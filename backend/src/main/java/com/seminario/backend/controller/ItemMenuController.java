package com.seminario.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
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

    @GetMapping("/visualizar")
    public VisualizarItemMenuResponseDTO visualizarItemMenu() {//VisualizarItemMenuRequestDTO request
        return itemMenuService.visualizarItemMenu();
    }
    
}

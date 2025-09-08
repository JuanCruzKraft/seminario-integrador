package com.seminario.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seminario.backend.dto.request.carrito.ConfirmarCarritoRequestDTO;
import com.seminario.backend.dto.response.carrito.ConfirmarCarritoResponseDTO;
import com.seminario.backend.service.PagoService;

@RestController
@RequestMapping("/pago")
@CrossOrigin(origins = "http://localhost:3000")
public class PagoController {
    
    private final PagoService pagoService;
    
    public PagoController(PagoService pagoService) {
        this.pagoService = pagoService;
    }
    
   /* @PostMapping("/pagar)
    public ConfirmarCarritoResponseDTO procesarPago(@RequestBody ConfirmarCarritoRequestDTO request) {
        return pagoService.procesarPago(request);
    }*/
}

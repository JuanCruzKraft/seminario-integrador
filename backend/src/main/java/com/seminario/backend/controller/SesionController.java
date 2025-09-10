package com.seminario.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seminario.backend.sesion.SesionMockeada;

@RestController
@RequestMapping("/sesion")
public class SesionController {
    
    private final SesionMockeada sesion;
    
    public SesionController(SesionMockeada sesion) {
        this.sesion = sesion;
    }
    
    @GetMapping("/actual")
    public String getSesionActual() {
        return "Cliente ID actual: " + sesion.getIdSesionActual();
    }
    
    @PostMapping("/cliente/{clienteId}")
    public String setClienteActual(@PathVariable Long clienteId) {
        sesion.setIdSesionActual(clienteId);
        return "Sesión configurada para cliente ID: " + clienteId;
    }
    
    @PostMapping("/cerrar")
    public String cerrarSesion() {
        sesion.cerrarSesion();
        return "Sesión cerrada";
    }
}

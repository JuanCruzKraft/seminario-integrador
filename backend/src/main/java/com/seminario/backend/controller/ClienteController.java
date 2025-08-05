package com.seminario.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seminario.backend.dto.request.IniciarSesionRequestDTO;
import com.seminario.backend.dto.request.RegistrarClienteRequestDTO;
import com.seminario.backend.dto.response.IniciarSesionResponseDTO;
import com.seminario.backend.dto.response.RegistrarClienteResponseDTO;
import com.seminario.backend.service.ClienteService;
import com.seminario.backend.sesion.SesionMockeada;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
//@Controller
@RequestMapping("/cliente")
public class ClienteController {
    private final ClienteService clienteService;
    private final SesionMockeada sesion;
    @Autowired
    public ClienteController(ClienteService clienteService, SesionMockeada sesion) {
        this.clienteService = clienteService;
        //this.sesion = new SesionMockeada(); // Esto NO usa el bean de Spring
         this.sesion = sesion;
    }

    @PostMapping("/registrar")
    public RegistrarClienteResponseDTO registrarCliente(@RequestBody RegistrarClienteRequestDTO request) {
        return clienteService.registrarCliente(request);
    }
    /*Agregue lo de la sesion mockeada ya que si queremos consultar, con la sesion hacemos:
     Long idUsuarioActual = sesion.getUsuarioActualId();
     nose como probarlo todavia, pero nos va a servir mas para el pedido. Lo vemos despues, solo lo dejo plasmado.
     */
   
    @PostMapping("/login")
    public IniciarSesionResponseDTO loginCliente(@RequestBody IniciarSesionRequestDTO request)  {
        return clienteService.loginClienteDTO(request);
    }
 
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        sesion.cerrarSesion();
        return ResponseEntity.ok("Sesión cerrada");
    }

    @GetMapping("/estado")
    public ResponseEntity<String> estado() {
        if (sesion.estaLogueado()) {
            return ResponseEntity.ok("Usuario logueado: " + sesion.getIdSesionActual());
        } else {
            return ResponseEntity.ok("Nadie está logueado");
        }
    }
}


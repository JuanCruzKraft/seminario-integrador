package com.seminario.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seminario.backend.dto.request.IniciarSesionRequestDTO;
import com.seminario.backend.dto.request.RegistrarClienteRequestDTO;
import com.seminario.backend.dto.request.cliente.EstablecerDireccionClienteRequestDTO;
import com.seminario.backend.dto.response.IniciarSesionResponseDTO;
import com.seminario.backend.dto.response.RegistrarClienteResponseDTO;
import com.seminario.backend.dto.response.cliente.EstablecerDireccionClienteResponseDTO;
import com.seminario.backend.service.ApiConsumerService;
import com.seminario.backend.service.ClienteService;
import com.seminario.backend.sesion.SesionMockeada;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
    private final ApiConsumerService apiConsumer;
    
    public ClienteController(ClienteService clienteService, SesionMockeada sesion, ApiConsumerService apiConsumer) {
        this.clienteService = clienteService;
        //this.sesion = new SesionMockeada(); // Esto NO usa el bean de Spring
         this.sesion = sesion;
         this.apiConsumer = apiConsumer; 
    }

    @PostMapping("/establecer-direccion")
    public EstablecerDireccionClienteResponseDTO establecerDireccion(@RequestBody EstablecerDireccionClienteRequestDTO request) {
        return apiConsumer.establecerDireccion(request);
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

    //esto deberia estar en el service
    @GetMapping("/estado")
    public ResponseEntity<String> estado() {
        if (sesion.estaLogueado()) {
            return ResponseEntity.ok("Usuario logueado: " + sesion.getIdSesionActual());
        } else {
            return ResponseEntity.ok("Nadie está logueado");
        }
    }
    @PostMapping("/eliminar")
    public ResponseEntity<String> eliminarCuenta() {
        Long idUsuarioActual = sesion.getIdSesionActual();
        if (idUsuarioActual == null) {
            return ResponseEntity.status(401).body("Ningún usuario está logueado");
        }
        ResponseEntity<String> eliminado = clienteService.eliminarCuenta();
        sesion.cerrarSesion();
        return eliminado;
    }
}


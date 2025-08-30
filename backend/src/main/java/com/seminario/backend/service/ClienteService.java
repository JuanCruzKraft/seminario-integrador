package com.seminario.backend.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.seminario.backend.dto.request.IniciarSesionRequestDTO;
import com.seminario.backend.dto.request.RegistrarClienteRequestDTO;
import com.seminario.backend.dto.response.IniciarSesionResponseDTO;
import com.seminario.backend.dto.response.RegistrarClienteResponseDTO;
import com.seminario.backend.model.Cliente;
import com.seminario.backend.model.Coordenada;
import com.seminario.backend.repository.ClienteRepository;
import com.seminario.backend.sesion.SesionMockeada;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Null;

@Service
public class ClienteService {
    
    private final ClienteRepository clienteRepository;
    private final SesionMockeada sesion; // Inyectamos SesionMockeada aquí
    
    // El constructor ahora recibe SesionMockeada
    public ClienteService(ClienteRepository clienteRepository, SesionMockeada sesion) {
        this.clienteRepository = clienteRepository;
        this.sesion = sesion; // Asignamos la instancia inyectada
    }

    public Long obtenerSesion() {
        return sesion.getIdSesionActual();
    }

    public Cliente obtenerClienteActual() {
        Long idSesion = obtenerSesion();
        if (idSesion != null) {
            return clienteRepository.findById(idSesion).orElse(null);
        }
        return null;
    }   

    public void setCoordenadasClienteActual(Double latitud, Double longitud) {
        Cliente cliente = obtenerClienteActual();
            cliente.setCoordenadas(new Coordenada(latitud, longitud));
            clienteRepository.save(cliente);

    }
  

    public RegistrarClienteResponseDTO registrarCliente(@Valid RegistrarClienteRequestDTO request) {
        RegistrarClienteResponseDTO response = new RegistrarClienteResponseDTO();

        if(clienteRepository.existsByUsername(request.getUsername())) {
            response.resultado.status= 1;
            response.resultado.mensaje = "El nombre de usuario ya está en uso.";
            return response;
        }
        else if (clienteRepository.existsByEmail(request.getEmail())) {
            response.resultado.status = 1;
            response.resultado.mensaje = "El email ya está en uso.";
            return response;
        } else {
            Cliente cliente = new Cliente(request.getCuit(), 
                                        request.getNombre(), 
                                          request.getApellido(), 
                                          request.getEmail(), 
                                          request.getDireccion(),
                                          request.getUsername(), 
                                          request.getPassword());

            clienteRepository.save(cliente);
            
            response.resultado.status = 0;
            response.resultado.mensaje = "Cliente registrado exitosamente.";
        }

        return response;
    }  
    public IniciarSesionResponseDTO loginClienteDTO(@Valid IniciarSesionRequestDTO request) {
        IniciarSesionResponseDTO response = new IniciarSesionResponseDTO();
        if(clienteRepository.findByUsername(request.getUsername()) == null) {
            response.resultado.status = 1;
            response.resultado.mensaje = "El usuario no existe.";
            return response;
        }else if (clienteRepository.findByUsername(request.getUsername()).getPassword().equals(request.getPassword())) {
            // Usamos la instancia de 'sesion' que fue inyectada por Spring
            sesion.setIdSesionActual(clienteRepository.findByUsername(request.getUsername()).getClienteid());
            sesion.setUserNameSesionActual(request.getUsername());
            sesion.setPasswordSesionActual(request.getPassword());
            Cliente cliente = clienteRepository.findByUsername(request.getUsername());
            response.idCliente = cliente.getClienteid();
            response.nombre = cliente.getNombre();
            response.apellido = cliente.getApellido();
            response.email = cliente.getEmail();
            response.direccion = cliente.getDireccion();
            response.cuit = cliente.getCuit();
            response.username = cliente.getUsername();
            response.coordenadas = cliente.getCoordenadas();
            response.resultado.status = 0;
            response.resultado.mensaje = "iniciado correcto.";
            SesionMockeada sesion = new SesionMockeada();
            sesion.setIdSesionActual(response.idCliente);
            return response;
            
        }
        response.resultado.status = 1;
        response.resultado.mensaje = "Contraseña incorrecta.";
        return response;
        
    }

    public void setDireccionClienteActual(String direccion) {
        Cliente cliente = obtenerClienteActual();
            cliente.setDireccion(direccion);
            clienteRepository.save(cliente);

    }
    } 
    


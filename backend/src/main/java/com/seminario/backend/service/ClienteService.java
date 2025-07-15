package com.seminario.backend.service;

import org.springframework.stereotype.Service;

import com.seminario.backend.dto.request.RegistrarClienteRequestDTO;
import com.seminario.backend.dto.response.RegistrarClienteResponseDTO;
import com.seminario.backend.model.Cliente;
import com.seminario.backend.repository.ClienteRepository;


import jakarta.validation.Valid;

@Service
public class ClienteService {
    
    private final ClienteRepository clienteRepository;
    
    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
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
    
}

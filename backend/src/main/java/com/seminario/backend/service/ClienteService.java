package com.seminario.backend.service;

import org.springframework.stereotype.Service;

import com.seminario.backend.dto.request.RegistrarClienteRequestDTO;
import com.seminario.backend.dto.response.RegistrarClienteResponseDTO;
import com.seminario.backend.model.Cliente;
import com.seminario.backend.repository.ClienteRepository;

@Service
public class ClienteService {
    
    private final ClienteRepository clienteRepository;
    
    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public RegistrarClienteResponseDTO registrarCliente(RegistrarClienteRequestDTO request) {
        RegistrarClienteResponseDTO response = new RegistrarClienteResponseDTO();


        return response;
    }   
    
}

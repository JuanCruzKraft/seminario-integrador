package com.seminario.backend.service;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final PasswordEncoder passwordEncoder; // Inyectamos PasswordEncoder para BCrypt
    
    // El constructor ahora recibe SesionMockeada y PasswordEncoder
    public ClienteService(ClienteRepository clienteRepository, SesionMockeada sesion, PasswordEncoder passwordEncoder) {
        this.clienteRepository = clienteRepository;
        this.sesion = sesion; // Asignamos la instancia inyectada
        this.passwordEncoder = passwordEncoder; // Asignamos el encoder
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
            // Hashear la contraseña antes de guardarla
            String hashedPassword = passwordEncoder.encode(request.getPassword());
            
            Cliente cliente = new Cliente(request.getCuit(), 
                                        request.getNombre(), 
                                          request.getApellido(), 
                                          request.getEmail(), 
                                          request.getDireccion(),
                                          request.getUsername(), 
                                          hashedPassword); // Usar la contraseña hasheada

            clienteRepository.save(cliente);
            
            response.resultado.status = 0;
            response.resultado.mensaje = "Cliente registrado exitosamente.";
        }

        return response;
    }  
    public IniciarSesionResponseDTO loginClienteDTO(@Valid IniciarSesionRequestDTO request) {
        IniciarSesionResponseDTO response = new IniciarSesionResponseDTO();
        Cliente cliente = clienteRepository.findByUsername(request.getUsername());
        
        if(cliente == null) {
            response.resultado.status = 1;
            response.resultado.mensaje = "El usuario no existe.";
            return response;
        } else if (passwordEncoder.matches(request.getPassword(), cliente.getPassword())) {
            // Usamos la instancia de 'sesion' que fue inyectada por Spring
            sesion.setIdSesionActual(cliente.getClienteid());
            sesion.setUserNameSesionActual(request.getUsername());
            sesion.setPasswordSesionActual(request.getPassword());
            
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
    public ResponseEntity<String> eliminarCuenta() {
        Long idUsuarioActual = sesion.getIdSesionActual();
        if (idUsuarioActual == null) {
            return ResponseEntity.status(401).body("Ningún usuario está logueado");
        }
        if (!clienteRepository.existsById(idUsuarioActual)) {
            return ResponseEntity.status(404).body("El usuario no existe");
        }
        Cliente cliente = clienteRepository.findById(idUsuarioActual).orElse(null);
        Cliente copia = new Cliente();
        copia.setActivo(false);
        copia.setClienteid(idUsuarioActual);
        copia.setCuit(cliente.getCuit());
        copia.setNombre(cliente.getNombre());
        copia.setApellido(cliente.getApellido());
        copia.setEmail(cliente.getEmail());
        copia.setDireccion(cliente.getDireccion());
        copia.setUsername(cliente.getUsername());
        copia.setPassword(cliente.getPassword());
        copia.setCoordenadas(cliente.getCoordenadas());
        copia.setPedidos(cliente.getPedidos());

        clienteRepository.save(copia);
        return ResponseEntity.ok("Cuenta eliminada exitosamente");
    }}


package com.seminario.backend.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import com.seminario.backend.dto.CalcularDatosLogisticosResponse;
import com.seminario.backend.dto.CalificacionDTO;
import com.seminario.backend.dto.VendedorDTO;
import com.seminario.backend.dto.request.VisualizarCalificacionVendedorRequestDTO;
import com.seminario.backend.dto.response.VisualizarCalificacionVendedorResponseDTO;
import com.seminario.backend.dto.response.VisualizarItemMenuResponseDTO;
import com.seminario.backend.dto.response.VisualizarVendedoresResponseDTO;
import com.seminario.backend.model.Calificacion;
import com.seminario.backend.model.Coordenada;
import com.seminario.backend.model.Vendedor;
import com.seminario.backend.repository.CalificacionRepository;
import com.seminario.backend.repository.ClienteRepository;
import com.seminario.backend.repository.VendedorRepository;
import com.seminario.backend.sesion.SesionMockeada;

@Service
public class VendedorService {

    private final VendedorRepository vendedorRepository;
    private final EnvioService envioService;
    private final SesionMockeada sesion;
    private final ClienteRepository clienteRepository;
    private final CalificacionRepository calificacionRepository;

    public VendedorService(VendedorRepository vendedorRepository, EnvioService envioService, SesionMockeada sesion, ClienteRepository clienteRepository, CalificacionRepository calificacionRepository) {
        this.vendedorRepository = vendedorRepository;
        this.envioService = envioService;
        this.sesion = sesion;
        this.clienteRepository = clienteRepository;
        this.calificacionRepository = calificacionRepository;
    }

    public VisualizarVendedoresResponseDTO visualizarVendedores() {
        VisualizarVendedoresResponseDTO response = new VisualizarVendedoresResponseDTO();
        
        if(sesion.getIdSesionActual() == null) {
            response.resultado.setStatus(401);
            response.resultado.setMensaje("No hay un cliente autenticado.");
            return response;
        }

        try {
            List<Vendedor> vendedores = vendedorRepository.findAll();
            if (vendedores.isEmpty()) {
                response.resultado.status = 1;
                response.resultado.mensaje = "No se encontraron vendedores.";
                return response;
            }

            // Lista para almacenar los DTOs con sus distancias calculadas
            List<VendedorDTO> vendedoresDTO = new ArrayList<>();

            for (Vendedor vendedor : vendedores) {
                VendedorDTO vendedorDTO = new VendedorDTO();
                vendedorDTO.vendedorId = vendedor.getVendedorid();
                vendedorDTO.nombre = vendedor.getNombre();
                vendedorDTO.direccion = vendedor.getDireccion();
                vendedorDTO.activo = vendedor.getActivo();
                
                // Calcular datos logísticos
                try {
                    // CalcularDatosLogisticosResponse datosLogisticos = envioService.calcularDatosLogisticos(
                    //     coordenadasCliente, 
                    //     vendedor.getCoordenadas()
                    // );
                        CalcularDatosLogisticosResponse datosLogisticos = envioService.calcularDatosLogisticos(
                        clienteRepository.findById(sesion.getIdSesionActual()).get().getCoordenadas(), 
                        vendedor.getCoordenadas()
                    );
                    vendedorDTO.datosLogisticos = datosLogisticos;
                } catch (Exception e) {
                    // En caso de error, crear datos logísticos vacíos (distancia muy alta para que quede al final)
                    CalcularDatosLogisticosResponse datosVacios = new CalcularDatosLogisticosResponse();
                    datosVacios.setDistancia(999999.0); // Distancia muy alta para ordenamiento
                    datosVacios.setTiempoEstimado(0);
                    datosVacios.setCostoEnvio(0.0);
                    vendedorDTO.datosLogisticos = datosVacios;
                }
                
                vendedoresDTO.add(vendedorDTO);
            }

            // Ordenar vendedores por distancia (del más cerca al más lejos)
            vendedoresDTO.sort(Comparator.comparing(dto -> 
                dto.datosLogisticos != null ? dto.datosLogisticos.getDistancia() : Double.MAX_VALUE
            ));

            // Agregar vendedores ordenados a la respuesta
            response.vendedores.addAll(vendedoresDTO);
            
            response.resultado.status = 0;
            response.resultado.mensaje = "Vendedores obtenidos exitosamente (ordenados por distancia).";
        } catch (Exception e) {
            response.resultado.status = 1;
            response.resultado.mensaje = "Error al obtener los vendedores: " + e.getMessage();
        }

        return response;
    }

    public VisualizarVendedoresResponseDTO visualizarVendedorQueVenden(String nombreProducto) {
    VisualizarVendedoresResponseDTO response = new VisualizarVendedoresResponseDTO();
               
        if(sesion.getIdSesionActual() == null) {
            response.resultado.setStatus(401);
            response.resultado.setMensaje("No hay un cliente autenticado.");
            return response;
        }

        try {
            List<Vendedor> vendedores = vendedorRepository.findByItemsMenuNombreContaining(nombreProducto);
            if (vendedores.isEmpty()) {
                response.resultado.status = 1;
                response.resultado.mensaje = "No se encontraron vendedores.";
                return response;
            }

            // Lista para almacenar los DTOs con sus distancias calculadas
            List<VendedorDTO> vendedoresDTO = new ArrayList<>();

            for (Vendedor vendedor : vendedores) {
                VendedorDTO vendedorDTO = new VendedorDTO();
                vendedorDTO.vendedorId = vendedor.getVendedorid();
                vendedorDTO.nombre = vendedor.getNombre();
                vendedorDTO.direccion = vendedor.getDireccion();
                vendedorDTO.activo = vendedor.getActivo();
                
                // Calcular datos logísticos
                try {
                    // CalcularDatosLogisticosResponse datosLogisticos = envioService.calcularDatosLogisticos(
                    //     coordenadasCliente, 
                    //     vendedor.getCoordenadas()
                    // );
                        CalcularDatosLogisticosResponse datosLogisticos = envioService.calcularDatosLogisticos(
                        clienteRepository.findById(sesion.getIdSesionActual()).get().getCoordenadas(), 
                        vendedor.getCoordenadas() );
                    vendedorDTO.datosLogisticos = datosLogisticos;
                } catch (Exception e) {
                    // En caso de error, crear datos logísticos vacíos (distancia muy alta para que quede al final)
                    CalcularDatosLogisticosResponse datosVacios = new CalcularDatosLogisticosResponse();
                    datosVacios.setDistancia(999999.0); // Distancia muy alta para ordenamiento
                    datosVacios.setTiempoEstimado(0);
                    datosVacios.setCostoEnvio(0.0);
                    vendedorDTO.datosLogisticos = datosVacios;
                }
                
                vendedoresDTO.add(vendedorDTO);
            }

            // Ordenar vendedores por distancia (del más cerca al más lejos)
            vendedoresDTO.sort(Comparator.comparing(dto -> 
                dto.datosLogisticos != null ? dto.datosLogisticos.getDistancia() : Double.MAX_VALUE
            ));

            // Agregar vendedores ordenados a la respuesta
            response.vendedores.addAll(vendedoresDTO);
            
            response.resultado.status = 0;
            response.resultado.mensaje = "Mostrando vendedores que ofrecen " + nombreProducto + " en su menu.";
        } catch (Exception e) {
            response.resultado.status = 1;
            response.resultado.mensaje = "Error al obtener los vendedores: " + e.getMessage();
        }

        return response;
    }

    public VisualizarVendedoresResponseDTO buscarVendedoresPorNombre(String nombreVendedor) {
        VisualizarVendedoresResponseDTO response = new VisualizarVendedoresResponseDTO();
               
        if(sesion.getIdSesionActual() == null) {
            response.resultado.setStatus(401);
            response.resultado.setMensaje("No hay un cliente autenticado.");
            return response;
        }

        try {
            List<Vendedor> vendedores = vendedorRepository.findByNombreContaining(nombreVendedor);
            if (vendedores.isEmpty()) {
                response.resultado.status = 1;
                response.resultado.mensaje = "No se encontraron vendedores.";
                return response;
            }

            // Lista para almacenar los DTOs con sus distancias calculadas
            List<VendedorDTO> vendedoresDTO = new ArrayList<>();

            for (Vendedor vendedor : vendedores) {
                VendedorDTO vendedorDTO = new VendedorDTO();
                vendedorDTO.vendedorId = vendedor.getVendedorid();
                vendedorDTO.nombre = vendedor.getNombre();
                vendedorDTO.direccion = vendedor.getDireccion();
                vendedorDTO.activo = vendedor.getActivo();
                
                // Calcular datos logísticos
                try {
                    // CalcularDatosLogisticosResponse datosLogisticos = envioService.calcularDatosLogisticos(
                    //     coordenadasCliente, 
                    //     vendedor.getCoordenadas()
                    // );
                        CalcularDatosLogisticosResponse datosLogisticos = envioService.calcularDatosLogisticos(
                        clienteRepository.findById(sesion.getIdSesionActual()).get().getCoordenadas(), 
                        vendedor.getCoordenadas() );
                    vendedorDTO.datosLogisticos = datosLogisticos;
                } catch (Exception e) {
                    // En caso de error, crear datos logísticos vacíos (distancia muy alta para que quede al final)
                    CalcularDatosLogisticosResponse datosVacios = new CalcularDatosLogisticosResponse();
                    datosVacios.setDistancia(999999.0); // Distancia muy alta para ordenamiento
                    datosVacios.setTiempoEstimado(0);
                    datosVacios.setCostoEnvio(0.0);
                    vendedorDTO.datosLogisticos = datosVacios;
                }
                
                vendedoresDTO.add(vendedorDTO);
            }

            // Ordenar vendedores por distancia (del más cerca al más lejos)
            vendedoresDTO.sort(Comparator.comparing(dto -> 
                dto.datosLogisticos != null ? dto.datosLogisticos.getDistancia() : Double.MAX_VALUE
            ));

            // Agregar vendedores ordenados a la respuesta
            response.vendedores.addAll(vendedoresDTO);
            
            response.resultado.status = 0;
            response.resultado.mensaje = "Mostrando coincidencia de vendedores con nombre: " + nombreVendedor;
        } catch (Exception e) {
            response.resultado.status = 1;
            response.resultado.mensaje = "Error al obtener los vendedores: " + e.getMessage();
        }

        return response;
    }

    public VisualizarCalificacionVendedorResponseDTO visualizarCalificaciones (VisualizarCalificacionVendedorRequestDTO request){
        VisualizarCalificacionVendedorResponseDTO response = new VisualizarCalificacionVendedorResponseDTO();
        Vendedor vendedor = vendedorRepository.findById(request.vendedorId).orElse(null);
        if(vendedor == null){
            response.resultado.status = 1;
            response.resultado.mensaje = "No se encontró el vendedor.";
            return response;
        }
        
        List<Calificacion> calificaciones = calificacionRepository.findByPedido_vendedor_vendedorid(request.vendedorId);
        for(Calificacion calificacion : calificaciones){
            CalificacionDTO calificacionDTO = new CalificacionDTO();
            calificacionDTO.id = calificacion.getCalificacionid();
            calificacionDTO.puntaje = calificacion.getPuntaje();
            if(calificacion.getComentario() == null){
                calificacionDTO.comentario = "El cliente no incluyó un comentario.";
            } else {
                calificacionDTO.comentario = calificacion.getComentario();
            }
            
            calificacionDTO.nombreCliente = calificacion.getPedido().getCliente().getNombre();
            response.calificaciones.add(calificacionDTO);
        }
        response.nombreVendedor = vendedor.getNombre();
        response.cantidadCalificaciones = calificaciones.size();
        response.calificacionPromedio = vendedor.getCalificacionPromedio();
        response.cantidadCalificaciones = vendedor.getCantidadCalificaciones();
        response.resultado.status = 0;
        response.resultado.mensaje = "Calificaciones obtenidas exitosamente.";
        return response;
    }
    }


    


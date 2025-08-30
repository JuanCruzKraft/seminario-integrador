package com.seminario.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.seminario.backend.dto.CalcularDatosLogisticosResponse;
import com.seminario.backend.dto.VendedorDTO;
import com.seminario.backend.dto.response.VisualizarVendedoresResponseDTO;
import com.seminario.backend.model.Coordenada;
import com.seminario.backend.model.Vendedor;
import com.seminario.backend.repository.VendedorRepository;

@Service
public class VendedorService {

    private final VendedorRepository vendedorRepository;
    private final EnvioService envioService;

    public VendedorService(VendedorRepository vendedorRepository, EnvioService envioService) {
        this.vendedorRepository = vendedorRepository;
        this.envioService = envioService;
    }

    public VisualizarVendedoresResponseDTO visualizarVendedores(Coordenada coordenadasCliente) {
        VisualizarVendedoresResponseDTO response = new VisualizarVendedoresResponseDTO();
        
        try {
            List<Vendedor> vendedores = vendedorRepository.findAll();
            if (vendedores.isEmpty()) {
                response.resultado.status = 1;
                response.resultado.mensaje = "No se encontraron vendedores.";
                return response;
            }
            for (Vendedor vendedor : vendedores) {
                VendedorDTO vendedorDTO = new VendedorDTO();
                vendedorDTO.vendedorId = vendedor.getVendedorid();
                vendedorDTO.nombre = vendedor.getNombre();
                vendedorDTO.direccion = vendedor.getDireccion();
                vendedorDTO.activo = vendedor.getActivo();
                
                // Calcular datos logísticos
                try {
                    CalcularDatosLogisticosResponse datosLogisticos = envioService.calcularDatosLogisticos(
                        coordenadasCliente, 
                        vendedor.getCoordenadas()
                    );
                    vendedorDTO.datosLogisticos = datosLogisticos;
                } catch (Exception e) {
                    // En caso de error, crear datos logísticos vacíos
                    CalcularDatosLogisticosResponse datosVacios = new CalcularDatosLogisticosResponse();
                    datosVacios.setDistancia(0.0);
                    datosVacios.setTiempoEstimado(0);
                    datosVacios.setCostoEnvio(0.0);
                    vendedorDTO.datosLogisticos = datosVacios;
                }
                
                response.vendedores.add(vendedorDTO);
            }
            response.resultado.status = 0;
            response.resultado.mensaje = "Vendedores obtenidos exitosamente.";
        } catch (Exception e) {
            response.resultado.status = 1;
            response.resultado.mensaje = "Error al obtener los vendedores: " + e.getMessage();
        }

        return response;
    }


    
}

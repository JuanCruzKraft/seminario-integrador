package com.seminario.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.seminario.backend.dto.request.cliente.EstablecerDireccionClienteRequestDTO;
import com.seminario.backend.dto.response.cliente.EstablecerDireccionClienteResponseDTO;
import com.seminario.backend.model.Coordenada;
import com.seminario.backend.sesion.SesionMockeada;
import com.seminario.backend.utils.Validador;

import org.springframework.beans.factory.annotation.Value;

@Service
public class ApiConsumerService {
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    //private final SesionMockeada sesion;
    private final ClienteService clienteService;
    public ApiConsumerService(ClienteService clienteService) {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
        this.clienteService = clienteService;
        
    }
    //para trabajar sesion mockeada

    //fin tratamiento sesion mockeada
    

    @Value("${geoapify.api.key}")
    private String geoapifyKey;

    
    public EstablecerDireccionClienteResponseDTO establecerDireccion(EstablecerDireccionClienteRequestDTO request) {
        if(clienteService.obtenerClienteActual() == null) {
            EstablecerDireccionClienteResponseDTO response = new EstablecerDireccionClienteResponseDTO();
            response.resultado.setStatus(401);
            response.resultado.setMensaje("No hay un cliente autenticado.");
            return response;
        }
        EstablecerDireccionClienteResponseDTO response = new EstablecerDireccionClienteResponseDTO();
        Coordenada coordenada = obtenerCoordenadas(request.getDireccion());
        if(coordenada.getLatitud() == 0.0 && coordenada.getLongitud() == 0.0) {
            response.resultado.setStatus(400);
            response.resultado.setMensaje("No se pudieron obtener las coordenadas para la dirección proporcionada.");
            return response;
        }
        response.latitud = coordenada.getLatitud();
        response.longitud = coordenada.getLongitud();
        response.resultado.setStatus(200);
        response.resultado.setMensaje("Coordenadas obtenidas correctamente.");
        
        clienteService.setCoordenadasClienteActual(coordenada.getLatitud(), coordenada.getLongitud());
        clienteService.setDireccionClienteActual(request.getDireccion());

        return response;
        
    }




@SuppressWarnings("deprecation")
public Coordenada obtenerCoordenadas(String direccion) {
    double lat = 0.0, lon = 0.0;
    try {
        // Construir la URL usando UriComponentsBuilder (maneja la codificación correctamente)
        String url = UriComponentsBuilder
            .fromHttpUrl("https://api.geoapify.com/v1/geocode/search")
            .queryParam("text", direccion)
            .queryParam("format", "json")
            .queryParam("apiKey", geoapifyKey)
            .build()
            .toUriString();
            
        System.out.println("URL EXACTA generada: " + url);
        System.out.println("Dirección original: " + direccion);
            
        // Hacer la petición HTTP
        String respuesta = restTemplate.getForObject(url, String.class);
        
        System.out.println("=== RESPUESTA COMPLETA ===");
        System.out.println(respuesta);
        System.out.println("=== FIN RESPUESTA ===");
        
        if (respuesta != null) {
            // Parsear la respuesta JSON
            JsonNode jsonNode = objectMapper.readTree(respuesta);
            JsonNode results = jsonNode.get("results");
            
            System.out.println("Número de resultados: " + (results != null ? results.size() : 0));
            
            if (results != null && results.isArray() && results.size() > 0) {
                // Buscar el mejor resultado (building > street > amenity)
                JsonNode bestResult = null;
                for (JsonNode result : results) {
                    String resultType = result.get("result_type").asText();
                    System.out.println("Resultado tipo: " + resultType + " - " + result.get("formatted").asText());
                    
                    if ("building".equals(resultType)) {
                        bestResult = result;
                        break;
                    } else if ("street".equals(resultType) && (bestResult == null || !"building".equals(bestResult.get("result_type").asText()))) {
                        bestResult = result;
                    } else if (bestResult == null) {
                        bestResult = result;
                    }
                }
                
                if (bestResult != null) {
                    JsonNode latNode = bestResult.get("lat");
                    JsonNode lonNode = bestResult.get("lon");
                    
                    if (latNode != null && lonNode != null) {
                        lat = latNode.asDouble();
                        lon = lonNode.asDouble();
                        System.out.println("Resultado seleccionado: " + bestResult.get("result_type").asText());
                        System.out.println("Coordenadas PARSEADAS - Lat: " + lat + ", Lon: " + lon);
                    }
                }
            }
        }
        
    } catch (Exception e) {
        System.err.println("Error: " + e.getMessage());
        e.printStackTrace();
    }

    return new Coordenada(lat, lon); 
}

    // // Validación de email mejorada usando la clase Validador
    // // En el front se debería validar con: <input type="email" id="email" name="email" required>
    // public boolean validarEmail(String email) {
    //     return Validador.validarEmail(email);
    // }

    // // Validación de contraseña usando la clase Validador
    // public boolean validarPassword(String password) {
    //     return Validador.validarPassword(password);
    // }

    // public String obtenerRequisitosContrasena() {
    //     return """
    //             <p>La contraseña debe cumplir los siguientes requisitos:</p>
    //             <ul>
    //                 <li>Mínimo 8 caracteres</li>
    //                 <li>Al menos una letra mayúscula</li>
    //                 <li>Al menos un dígito</li>
    //                 <li>Sin espacios</li>
    //             </ul>
    //             """;
    // }
}

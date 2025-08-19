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



    // ver si sirve algo de esto, si no borrar

    // este service se va a encargar de las validaciones de los ""ssistemas externos"" que se van a consumir

    //esta se va a usar para registrar un cliente
    public Boolean validarcontrasena(String contrasena) {

        // Asumimos que el servicio externo hace una validacion asi:
        // Longitud mínima de 8 caracteres
        if (contrasena.length() < 8)
            return false;

        // Al menos un signo especial (@#$%*)
        if (!contrasena.matches(".*[@#$%*].*"))
            return false;

        // Al menos una letra mayúscula
        if (!contrasena.matches(".*[A-Z].*"))
            return false;

        // Al menos un dígito
        if (!contrasena.matches(".*\\d.*"))
            return false;

        return true;
    }

    //esta validacion no se si es necesaria (no esta de mas, de todos modos )
    //en el front se deberia validar con: <input type="email" id="email" name="email" required>
    public boolean validarEmail(String email) {
        // Asumimos que el servicio externo valida el email con una expresión regular
        String emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        return email.matches(emailRegex);
    }

    public String obtenerRequisitosContrasena() {
        return """
                <p>La contraseña debe cumplir los siguientes requisitos:</p>
                <ul>
                    <li>Longitud mínima de 8 caracteres</li>
                    <li>Debe contener al menos un signo especial (@#$%*)</li>
                    <li>Debe contener al menos una letra mayúscula</li>
                    <li>Debe contener al menos un dígito</li>
                </ul>
                """;
    }

}

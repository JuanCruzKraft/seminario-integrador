package com.seminario.backend.service;

import org.springframework.stereotype.Service;

import com.seminario.backend.model.Coordenada;
import com.seminario.backend.dto.CalcularDatosLogisticosResponse;

@Service
public class EnvioService {

    public Double calcularDistancia(Coordenada origen, Coordenada destino) {
        final int R = 6371; // Radio de la Tierra en kilómetros
        double latDistance = Math.toRadians(destino.getLatitud() - origen.getLatitud());
        double lonDistance = Math.toRadians(destino.getLongitud() - origen.getLongitud());
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(origen.getLatitud())) * Math.cos(Math.toRadians(destino.getLatitud()))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distancia en kilómetros
    }

    public Integer calcularTiempoEnvio(Double distancia){
        return (int) (distancia * 10 + 15); // Aproximadamente 10 minutos por km, mas 15 minutos de preparación
        // if(distancia<=1.0){
        //     return 10; 
        // } else if (distancia <= 2.0) {
        //     return 15; 
        // } else if (distancia <= 3.0) {
        //     return 20; 
        // } else if (distancia <= 4.0) {
        //     return 25; 
        // } else if (distancia <= 5.0) {
        //     return 30; 
        // } else {
        //     return 45; 
        // }
    }

    public Double calcularCostoEnvio(Double distancia) {
        return 500.0 + (distancia * 600); // Costo base + costo por km
    }

    public CalcularDatosLogisticosResponse calcularDatosLogisticos(Coordenada origen, Coordenada destino) {
        Double distancia = calcularDistancia(origen, destino);
        Integer tiempoEstimado = calcularTiempoEnvio(distancia);
        Double costoEnvio = calcularCostoEnvio(distancia);

        CalcularDatosLogisticosResponse response = new CalcularDatosLogisticosResponse();
        response.setDistancia(distancia);
        response.setTiempoEstimado(tiempoEstimado);
        response.setCostoEnvio(costoEnvio);

        return response;
    }
}

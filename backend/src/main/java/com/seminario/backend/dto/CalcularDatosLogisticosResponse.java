package com.seminario.backend.dto;

/**
 * DTO para devolver los datos logísticos calculados para un envío.
 * Se utiliza en cartillas de vendedores, carrito de compras y pedidos en curso.
 */
public class CalcularDatosLogisticosResponse {
    
    private Double distancia;
    private Integer tiempoEstimado;
    private Double costoEnvio;
    
    // Constructor por defecto
    public CalcularDatosLogisticosResponse() {
    }
    
    // Constructor completo
    public CalcularDatosLogisticosResponse(Double distancia, Integer tiempoEstimado, Double costoEnvio) {
        this.distancia = distancia;
        this.tiempoEstimado = tiempoEstimado;
        this.costoEnvio = costoEnvio;
    }
    
    /**
     * Distancia en kilómetros entre origen y destino
     */
    public Double getDistancia() {
        return distancia;
    }
    
    public void setDistancia(Double distancia) {
        this.distancia = distancia;
    }
    
    /**
     * Tiempo estimado de entrega en minutos
     */
    public Integer getTiempoEstimado() {
        return tiempoEstimado;
    }
    
    public void setTiempoEstimado(Integer tiempoEstimado) {
        this.tiempoEstimado = tiempoEstimado;
    }
    
    /**
     * Costo de envío en pesos argentinos
     */
    public Double getCostoEnvio() {
        return costoEnvio;
    }
    
    public void setCostoEnvio(Double costoEnvio) {
        this.costoEnvio = costoEnvio;
    }
    
    /**
     * Método de conveniencia para formatear el tiempo estimado
     * @return String formateado como "25 min" o "1h 15min"
     */
    public String getTiempoEstimadoFormateado() {
        if (tiempoEstimado == null) {
            return "No disponible";
        }
        
        if (tiempoEstimado < 60) {
            return tiempoEstimado + " min";
        } else {
            int horas = tiempoEstimado / 60;
            int minutos = tiempoEstimado % 60;
            if (minutos == 0) {
                return horas + "h";
            } else {
                return horas + "h " + minutos + "min";
            }
        }
    }
    
    /**
     * Método de conveniencia para formatear el costo de envío
     * @return String formateado como "$1.200,00"
     */
    public String getCostoEnvioFormateado() {
        if (costoEnvio == null) {
            return "No disponible";
        }
        return String.format("$%.2f", costoEnvio);
    }
    
    /**
     * Método de conveniencia para formatear la distancia
     * @return String formateado como "2,5 km"
     */
    public String getDistanciaFormateada() {
        if (distancia == null) {
            return "No disponible";
        }
        return String.format("%.1f km", distancia);
    }
    
    @Override
    public String toString() {
        return "CalcularDatosLogisticosResponse{" +
                "distancia=" + distancia +
                ", tiempoEstimado=" + tiempoEstimado +
                ", costoEnvio=" + costoEnvio +
                '}';
    }
}

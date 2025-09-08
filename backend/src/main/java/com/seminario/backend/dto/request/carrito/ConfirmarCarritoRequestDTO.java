package com.seminario.backend.dto.request.carrito;

import com.seminario.backend.enums.MetodoPago;

public class ConfirmarCarritoRequestDTO {
    private MetodoPago metodoPago;
    private String observaciones;
    private String direccionEntrega;
    
    // Datos específicos para cada método de pago (podrías separar en clases diferentes)
    private String numeroTarjeta;
    private String nombreTitular;
    private String fechaVencimiento;
    private String codigoSeguridad;
    
    // Para transferencia
    private String cbu;
    private String alias;
    
    public MetodoPago getMetodoPago() {
        return metodoPago;
    }
    
    public void setMetodoPago(MetodoPago metodoPago) {
        this.metodoPago = metodoPago;
    }
    
    public String getObservaciones() {
        return observaciones;
    }
    
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
    
    public String getDireccionEntrega() {
        return direccionEntrega;
    }
    
    public void setDireccionEntrega(String direccionEntrega) {
        this.direccionEntrega = direccionEntrega;
    }
    
    public String getNumeroTarjeta() {
        return numeroTarjeta;
    }
    
    public void setNumeroTarjeta(String numeroTarjeta) {
        this.numeroTarjeta = numeroTarjeta;
    }
    
    public String getNombreTitular() {
        return nombreTitular;
    }
    
    public void setNombreTitular(String nombreTitular) {
        this.nombreTitular = nombreTitular;
    }
    
    public String getFechaVencimiento() {
        return fechaVencimiento;
    }
    
    public void setFechaVencimiento(String fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }
    
    public String getCodigoSeguridad() {
        return codigoSeguridad;
    }
    
    public void setCodigoSeguridad(String codigoSeguridad) {
        this.codigoSeguridad = codigoSeguridad;
    }
    
    public String getCbu() {
        return cbu;
    }
    
    public void setCbu(String cbu) {
        this.cbu = cbu;
    }
    
    public String getAlias() {
        return alias;
    }
    
    public void setAlias(String alias) {
        this.alias = alias;
    }
}

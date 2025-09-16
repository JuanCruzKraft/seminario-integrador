package com.seminario.backend.dto.request.pago;

public class PagoTarjetaRequestDTO {
    private String numeroTarjeta;
    private String nombreTitular;
    private String dniTitular; // Campo nuevo para DNI del titular
    private String fechaVencimiento;
    private String codigoSeguridad;
    private String observaciones;
    
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
    
    public String getDniTitular() {
        return dniTitular;
    }
    
    public void setDniTitular(String dniTitular) {
        this.dniTitular = dniTitular;
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
    
    public String getObservaciones() {
        return observaciones;
    }
    
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
}

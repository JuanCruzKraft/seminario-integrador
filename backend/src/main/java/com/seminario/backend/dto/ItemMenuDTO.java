package com.seminario.backend.dto;

public class ItemMenuDTO {
    public Long itemMenuId;
    public String nombre;
    public String descripcion;
    public Double precio;
    public Boolean activo;
    public Double peso;
    public Integer stock;
    public Boolean esBebida;
     public VendedorResumenDTO vendedor; 
    // Constructor vacío
    public ItemMenuDTO() {
        // No se requieren inicializaciones específicas
    }
    // Constructor con parámetros (opcional)

}

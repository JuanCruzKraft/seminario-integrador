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
    public Double tamanio; // Solo para bebidas
    public Double graduacionAlcoholica; // Solo para bebidas
    public float calorias; // Solo para comidas
   // public VendedorResumenDTO vendedor; 
    // Constructor vacío
    public ItemMenuDTO() {
        // No se requieren inicializaciones específicas
    }
    // Constructor con parámetros (opcional)

}

package com.seminario.backend.dto;

import java.util.List;

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
    public List<CategoriaDTO> categorias;
   // public VendedorResumenDTO vendedor; 
    // Constructor vacío
    public ItemMenuDTO() {
        categorias = new java.util.ArrayList<>();
    }
    // Constructor con parámetros (opcional)

}

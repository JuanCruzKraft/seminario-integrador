package com.seminario.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

public class VendedorResumenDTO {
    public Long vendedorId;
    public String nombre;

 
    public VendedorResumenDTO() {
    }

    // Constructor con parámetros para facilitar la creación de instancias
    public VendedorResumenDTO(Long vendedorId, String nombre) {
        this.vendedorId = vendedorId;
        this.nombre = nombre;
    }
}
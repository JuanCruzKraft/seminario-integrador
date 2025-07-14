package com.seminario.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

//NO SE SI LA VAMOS A USAR, PERO LA DEJO PORLAS
//ES UN BARDO
public class DireccionRequestDTO {
    @NotBlank
    private String direccion;
    
}

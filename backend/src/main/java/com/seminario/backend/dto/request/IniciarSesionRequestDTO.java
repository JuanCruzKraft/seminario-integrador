package com.seminario.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

    
@Data
public class IniciarSesionRequestDTO {
        @NotBlank
    @Size(max = 32)
    private String username;

    @NotBlank
    @Size(max = 32)
    private String password;


    public String validar() {
        StringBuilder mensajeError = new StringBuilder();

        if (this.username == null || this.username.isEmpty()) {
            mensajeError.append("El campo username no debe ser vacío o nulo.\n");
        }
        if (this.password == null || this.password.isEmpty()) {
            mensajeError.append("El campo password no debe ser vacío o nulo.\n");
        }

        return mensajeError.toString().trim();
    } 
    
}

package com.seminario.backend.dto.request;

import lombok.Data;

    
@Data
public class IniciarSesionRequestDTO {
    private String username;
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

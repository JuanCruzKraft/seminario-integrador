package com.seminario.backend.dto.request;

import lombok.Data;

@Data
public class RegistrarClienteRequestDTO {

    private String nombre;
    private String apellido;
    private String email;
    private String direccion;
    private String cuil;
    private String username;

    private String password;
    private String confirmarPassword;

     public String validar() {
        StringBuilder mensajeError = new StringBuilder();

        if (this.username == null || this.username.isEmpty()) {
            mensajeError.append("El campo username no debe ser vacío o nulo.\n");
        }
        if (this.password == null || this.password.isEmpty() || this.confirmarPassword == null || this.confirmarPassword.isEmpty()) {
            mensajeError.append("El campo contrasena no debe ser vacío o nulo.\n");
        }
        if (this.nombre == null || this.nombre.isEmpty()) {
            mensajeError.append("El campo nombre no debe ser vacío o nulo.\n");
        }
        if (this.apellido == null || this.apellido.isEmpty()) {
            mensajeError.append("El campo apellido no debe ser vacío o nulo.\n");
        }


        return mensajeError.toString().trim();
    }
}

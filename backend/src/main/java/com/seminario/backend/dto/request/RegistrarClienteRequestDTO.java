package com.seminario.backend.dto.request;

import lombok.Data;

@Data
public class ClienteRequestDTO {

    private String nombre;
    private String apellido;
    private String email;
    private String direccion;
    private String cuil;
    private String identificador;

    private String password;
    private String confirmarPassword;
}

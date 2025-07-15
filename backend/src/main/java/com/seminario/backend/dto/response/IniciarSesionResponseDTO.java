package com.seminario.backend.dto.response;

import lombok.Data;

@Data
public class IniciarSesionResponseDTO {
    //public String token; // 
    public Long idUsuario;
    public String nombre;
    public String email;
    public String direccion;
    public String rol; // si corresponde
}

/*
 * PRECONDICION: EL USUARIO DEBE HABER INICIADO SESION, LA CUMPLIMOS CON EL TOKEN
 * El frontend inicia sesión enviando email y contraseña.

El backend verifica esos datos.

Si son correctos, genera un token, se lo devuelve al frontend.

Luego, en cada request al backend, el frontend envía el token para probar su identidad.
 */
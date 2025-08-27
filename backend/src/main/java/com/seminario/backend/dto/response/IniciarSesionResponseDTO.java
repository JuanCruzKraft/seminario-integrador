package com.seminario.backend.dto.response;

import com.seminario.backend.dto.ResultadoOperacion;

import lombok.AllArgsConstructor;
import lombok.Data;
@Data
@AllArgsConstructor
public class IniciarSesionResponseDTO {

    public ResultadoOperacion resultado;

    public Long idCliente;

    public String nombre;

    public String apellido;

    public String email;

    public String direccion;

    public Long  cuit;

    public String username;

    public IniciarSesionResponseDTO() {

        super();
        this.resultado = new ResultadoOperacion();

    }

/**
 * PRECONDICION: EL USUARIO DEBE HABER INICIADO SESION, LA CUMPLIMOS CON EL TOKEN
 * El frontend inicia sesión enviando email y contraseña.

El backend verifica esos datos.

Si son correctos, genera un token, se lo devuelve al frontend.

Luego, en cada request al backend, el frontend envía el token para probar su identidad.
 */
}
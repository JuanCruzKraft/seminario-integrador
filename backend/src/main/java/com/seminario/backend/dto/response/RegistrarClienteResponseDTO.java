package com.seminario.backend.dto.response;


import com.seminario.backend.dto.ResultadoOperacion;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ClienteResponseDTO {
    public ResultadoOperacion resultado;
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String direccion;
    private String cuil;
    private String identificador;

    public ClienteResponseDTO() {

        super();
        this.resultado = new ResultadoOperacion();
    }

    public ClienteResponseDTO(Long id, String nombre, String apellido, String email, String direccion, String cuil, String identificador) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.direccion = direccion;
        this.cuil = cuil;
        this.identificador = identificador;
        this.resultado = new ResultadoOperacion();
    }

}

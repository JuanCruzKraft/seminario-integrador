package com.seminario.backend.dto.response;


import com.seminario.backend.dto.ResultadoOperacion;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegistrarClienteResponseDTO {

    public ResultadoOperacion resultado;

    public RegistrarClienteResponseDTO() {

        super();
        this.resultado = new ResultadoOperacion();
    }


    

    

}

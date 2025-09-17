package com.seminario.backend.dto.response;

import com.seminario.backend.dto.ResultadoOperacion;

import lombok.Data;

@Data

public class CalificarPedidoResponseDTO {

    public ResultadoOperacion resultado;

    public CalificarPedidoResponseDTO() {
        this.resultado = new ResultadoOperacion();
    }
    
}

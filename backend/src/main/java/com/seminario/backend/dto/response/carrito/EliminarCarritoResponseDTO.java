package com.seminario.backend.dto.response.carrito;
import com.seminario.backend.dto.ResultadoOperacion;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class EliminarCarritoResponseDTO {
    public Long carritoId;
    public ResultadoOperacion resultado;

    public EliminarCarritoResponseDTO() {
        this.resultado = new ResultadoOperacion();
    }
}
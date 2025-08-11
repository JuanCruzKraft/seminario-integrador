package com.seminario.backend.dto.response.carrito;
import com.seminario.backend.dto.ResultadoOperacion;

import lombok.Data;

@Data
public class CrearCarritoResponseDTO {
    private Long carritoId;
    private ResultadoOperacion resultadoOperacion;
    public CrearCarritoResponseDTO() {
        this.resultadoOperacion = new ResultadoOperacion();
    }



    
}

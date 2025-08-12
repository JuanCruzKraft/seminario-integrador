package com.seminario.backend.dto.response.carrito;

import com.seminario.backend.dto.ResultadoOperacion;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@AllArgsConstructor

public class AgregarItemResponseDTO {
        //definir atributos del dto aca
        public ResultadoOperacion resultado;

        public AgregarItemResponseDTO() {
            this.resultado = new ResultadoOperacion();
        }

}

package com.seminario.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
//import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ResultadoOperacion {
    public Integer status;
    public String mensaje;
}
package com.seminario.backend.dto;

import lombok.AllArgsConstructor;
//import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor

public class ResultadoOperacion {
    public Integer status;
    public String mensaje;
}
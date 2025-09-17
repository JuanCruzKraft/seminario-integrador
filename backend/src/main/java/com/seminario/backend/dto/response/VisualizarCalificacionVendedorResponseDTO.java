package com.seminario.backend.dto.response;

import java.util.ArrayList;
import java.util.List;

import com.seminario.backend.dto.CalificacionDTO;
import com.seminario.backend.dto.ResultadoOperacion;

public class VisualizarCalificacionVendedorResponseDTO {

    public ResultadoOperacion resultado;
    public String nombreVendedor;
    public Double calificacionPromedio;
    public Integer cantidadCalificaciones;
    public List<CalificacionDTO> calificaciones;
    

    public VisualizarCalificacionVendedorResponseDTO() {
        this.resultado = new ResultadoOperacion();
        this.calificaciones = new ArrayList<>();
    }



}

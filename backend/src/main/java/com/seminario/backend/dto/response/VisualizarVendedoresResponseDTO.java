package com.seminario.backend.dto.response;

import java.util.ArrayList;
import java.util.List;

import com.seminario.backend.dto.ResultadoOperacion;
import com.seminario.backend.dto.VendedorDTO;

public class VisualizarVendedoresResponseDTO {

    public ResultadoOperacion resultado;
    public List<VendedorDTO> vendedores;

    public VisualizarVendedoresResponseDTO() {
         this.resultado = new ResultadoOperacion();
        this.vendedores = new ArrayList<>();
     }

    
}

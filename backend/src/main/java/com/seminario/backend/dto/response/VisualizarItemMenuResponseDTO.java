package com.seminario.backend.dto.response;
import java.util.ArrayList;
import java.util.List;

import com.seminario.backend.dto.ItemMenuDTO;
import com.seminario.backend.dto.ResultadoOperacion;
public class VisualizarItemMenuResponseDTO {

    public ResultadoOperacion resultado;
    public List<ItemMenuDTO> itemMenus;

    public VisualizarItemMenuResponseDTO(){
         this.resultado = new ResultadoOperacion();
        this.itemMenus = new ArrayList<>();
     }

    
}

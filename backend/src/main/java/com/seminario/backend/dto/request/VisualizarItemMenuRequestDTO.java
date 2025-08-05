package com.seminario.backend.dto.request;

import lombok.Data;

@Data
public class VisualizarItemMenuRequestDTO {
    public Long vendedorid; // ID del vendedor para el cual se desea visualizar los items del menú


   public VisualizarItemMenuRequestDTO() {
       // Constructor vacío
   }
}


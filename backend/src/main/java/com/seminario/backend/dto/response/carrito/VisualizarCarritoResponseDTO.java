package com.seminario.backend.dto.response.carrito;

import java.util.ArrayList;
import java.util.List;

import com.seminario.backend.dto.ItemMenuDTO;
import com.seminario.backend.dto.ItemPedidoDTO;
import com.seminario.backend.dto.ResultadoOperacion;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

 @Data 
 @AllArgsConstructor
//@NoArgsConstructor
public class VisualizarCarritoResponseDTO {
    public ResultadoOperacion resultado;
    public List<ItemPedidoDTO> itemsPedidos;
    public Double subtotal;
    public String direccionEntrega;
    public Double costoEnvio;
    public Long tiempoEntrega;



    public VisualizarCarritoResponseDTO(){
         this.resultado = new ResultadoOperacion();
     }
}

package com.seminario.backend.dto.response.carrito;

import java.util.List;

import com.seminario.backend.dto.ItemPedidoDTO;
import com.seminario.backend.dto.ResultadoOperacion;

public class VisualizarCarritoResponseDTO {
    //definir atributos del dto aca
    public ResultadoOperacion resultado;
    public Double costoEnvio;
    public Double distancia;
    public Integer tiempo;
    public List<ItemPedidoDTO> items;
    public Double subtotalTotal; //subtotal de itempedidos + datos logisticos
    public String direccionEntrega;


    public VisualizarCarritoResponseDTO() {
        this.resultado = new ResultadoOperacion();
    }
}

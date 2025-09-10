package com.seminario.backend.dto.request.pedido;

import java.util.List;

import com.seminario.backend.dto.PedidoDTO;
import com.seminario.backend.dto.ResultadoOperacion;
import com.seminario.backend.model.Pedido;

public class VerPedidosResponseDTO {

    public List<PedidoDTO> pedidos;
    public ResultadoOperacion resultado;

    public VerPedidosResponseDTO() {
        this.resultado = new ResultadoOperacion();
        pedidos = new java.util.ArrayList<>();
    }
    
}

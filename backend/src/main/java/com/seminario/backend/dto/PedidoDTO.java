package com.seminario.backend.dto;

import java.util.List;

public class PedidoDTO {
    public Long pedidoID;
    public String estado;
    public String fechaConfirmacion;
    public List<ItemPedidoDTO> items;
    public String nombreVendedor;
    public Double precio;
    public Object costoEnvio;
    public Double subtotalItems;

    public PedidoDTO() {
        items = new java.util.ArrayList<>();
    }
    
}

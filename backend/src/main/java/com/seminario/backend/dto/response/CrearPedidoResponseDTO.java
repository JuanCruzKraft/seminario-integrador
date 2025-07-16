package com.seminario.backend.dto.response;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;
import lombok.NoArgsConstructor;
@NoArgsConstructor
@AllArgsConstructor
@Data
public class CrearPedidoResponseDTO {
    private Long pedidoId;
    private Long clienteId;
    private Long vendedorId;
    private Double precioTotal;
    private String estado;
    private List<ItemPedidoResponseDTO> items;
}

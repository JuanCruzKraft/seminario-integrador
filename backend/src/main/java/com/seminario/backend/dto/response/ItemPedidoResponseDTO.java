package com.seminario.backend.dto.response;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ItemPedidoResponseDTO {
    private Long itemPedidoId;
    private Long itemMenuId;
    private String nombreItem;
    private Integer cantidad;
    private Double precioUnitario;
    private Double subtotal;
}
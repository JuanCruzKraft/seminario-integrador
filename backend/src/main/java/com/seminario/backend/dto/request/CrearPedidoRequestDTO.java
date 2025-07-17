
package com.seminario.backend.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotNull;
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
public class CrearPedidoRequestDTO {
    //private Long clienteId; no lo deberia necesitar, ya que el cliente se obtiene de la sesion
    private Long vendedorId;
    private List<ItemPedidoRequestDTO> items;
}

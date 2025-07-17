package com.seminario.backend.dto.request;

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
public class ItemPedidoRequestDTO {
    @NotNull
    private Long itemMenuId;
    @NotNull
    private Integer cantidad;
}
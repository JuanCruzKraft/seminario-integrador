package com.seminario.backend.dto.request;

import lombok.Data;

@Data
public class CalificarPedidoRequestDTO {
    public Long pedidoId;
    public int calificacion; // Asumiendo que la calificación es un entero (por ejemplo, de 1 a 5)
    public String comentario; // Comentario opcional
}

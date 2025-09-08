package com.seminario.backend.dto.response.carrito;
import java.util.List;
import java.util.Arrays;

import com.seminario.backend.dto.ResultadoOperacion;
import com.seminario.backend.dto.ItemPedidoDTO;
import com.seminario.backend.enums.MetodoPago;

public class ConfirmarCarritoResponseDTO {
     private Double total;
     private List<ItemPedidoDTO> items;
     private List<MetodoPago> metodosDisponibles;
     private Long vendedorId;
     private String vendedorNombre;
     public ResultadoOperacion resultado = new ResultadoOperacion();
     
     public ConfirmarCarritoResponseDTO() {
         this.metodosDisponibles = Arrays.asList(MetodoPago.values());
     }
     
     public Double getTotal() {
         return total;
     }
     
     public void setTotal(Double total) {
         this.total = total;
     }
     
     public List<ItemPedidoDTO> getItems() {
         return items;
     }
     
     public void setItems(List<ItemPedidoDTO> items) {
         this.items = items;
     }
     
     public List<MetodoPago> getMetodosDisponibles() {
         return metodosDisponibles;
     }
     
     public void setMetodosDisponibles(List<MetodoPago> metodosDisponibles) {
         this.metodosDisponibles = metodosDisponibles;
     }
     
     public Long getVendedorId() {
         return vendedorId;
     }
     
     public void setVendedorId(Long vendedorId) {
         this.vendedorId = vendedorId;
     }
     
     public String getVendedorNombre() {
         return vendedorNombre;
     }
     
     public void setVendedorNombre(String vendedorNombre) {
         this.vendedorNombre = vendedorNombre;
     }
}

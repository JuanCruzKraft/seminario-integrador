package com.seminario.backend.dto.response.carrito;
import java.util.List;
import java.util.Arrays;

import com.seminario.backend.dto.ResultadoOperacion;
import com.seminario.backend.dto.ItemPedidoDTO;
import com.seminario.backend.enums.MetodoPago;

public class ConfirmarCarritoResponseDTO {
     private Double total;
     private Double subtotal;
     private Double recargo;
     private Double costoEnvio;
     private List<ItemPedidoDTO> items;
     private List<MetodoPago> metodosDisponibles;
     private MetodoPago metodoPago; // Método de pago utilizado
     private Long vendedorId;
     private String vendedorNombre;
     private String vendedorCuit;
     private String vendedorCbu;
     private Integer tiempoEnvio; // en minutos
     private Long pedidoId; // ID del pedido creado
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
     
     public String getVendedorCuit() {
         return vendedorCuit;
     }
     
     public void setVendedorCuit(String vendedorCuit) {
         this.vendedorCuit = vendedorCuit;
     }
     
     public String getVendedorCbu() {
         return vendedorCbu;
     }
     
     public void setVendedorCbu(String vendedorCbu) {
         this.vendedorCbu = vendedorCbu;
     }

     public Double getSubtotal() {
         return subtotal;
     }

     public void setSubtotal(Double subtotal) {
         this.subtotal = subtotal;
     }

     public Double getRecargo() {
         return recargo;
     }

     public void setRecargo(Double recargo) {
         this.recargo = recargo;
     }

     public Double getCostoEnvio() {
         return costoEnvio;
     }

     public void setCostoEnvio(Double costoEnvio) {
         this.costoEnvio = costoEnvio;
     }

     public Integer getTiempoEnvio() {
         return tiempoEnvio;
     }

     public void setTiempoEnvio(Integer tiempoEnvio) {
         this.tiempoEnvio = tiempoEnvio;
     }

     public Long getPedidoId() {
         return pedidoId;
     }

     public void setPedidoId(Long pedidoId) {
         this.pedidoId = pedidoId;
     }

     public MetodoPago getMetodoPago() {
         return metodoPago;
     }

     public void setMetodoPago(MetodoPago metodoPago) {
         this.metodoPago = metodoPago;
     }
}

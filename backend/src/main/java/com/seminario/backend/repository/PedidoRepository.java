package com.seminario.backend.repository;

import com.seminario.backend.model.Cliente;
import com.seminario.backend.model.Pedido;
import com.seminario.backend.enums.EstadoPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

//estoy probando tambien esta crud repository pero vi que Jpa hereda de crud repository

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    //List<Pedido> findByVendedorId(Long vendedorId);
    List<Pedido> findByVendedor_vendedorid(Long vendedorId);

    //List<Pedido> findByClienteId(Long clienteId);
    List<Pedido> findByCliente_clienteid(Long clienteId);

    List<Pedido> findByEstado(EstadoPedido estado);

    //metodos anteriores
    Pedido findByClienteAndEstado(Cliente cliente, EstadoPedido estado);
    //List<Pedido> findByDescripcionContaining(String descripcion);
   // List<Pedido> findByPrecioGreaterThanEqual(Double precio);
    //List<Pedido> findByPrecioLessThanEqual(Double precio);
    //List<Pedido> findByPrecioBetween(Double precio1, Double precio2);
    //List<Pedido> findByCantidadGreaterThanEqual(int cantidad);
    //List<Pedido> findByCantidadLessThanEqual(int cantidad);

    

    List<Pedido> findByCliente_nombreContaining(String clienteNombre);
    //List<Pedido> findByListaItemPedido_ItemMenu_itemid(Long itemMenuId);
   // List<Pedido> findByListaItemPedido_ItemMenu_nombreContaining(String itemMenuNombre);
    List<Pedido> findByVendedor_nombreContaining(String vendedorNombre);
    void deleteByVendedor_vendedorid(Long vendedorId);
}





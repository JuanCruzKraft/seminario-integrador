package com.seminario.backend.repository;

import com.seminario.backend.model.Pedido;
import com.seminario.backend.enums.EstadoPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

//estoy probando tambien esta crud repository pero vi que Jpa hereda de crud repository

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByVendedorId(Long vendedorId);

    List<Pedido> findByClienteId(Long clienteId);

    List<Pedido> findByEstado(EstadoPedido estado);
}





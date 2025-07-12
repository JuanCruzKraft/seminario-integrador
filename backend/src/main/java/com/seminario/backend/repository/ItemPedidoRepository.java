package com.seminario.backend.repository;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;

import com.seminario.backend.model.ItemPedido;
import com.seminario.backend.model.Pedido;


public interface ItemPedidoRepository extends JpaRepository<ItemPedido, Long> {
    
    Set<ItemPedido> findByPedido(Pedido pedido);
    void deleteByItemMenu_Itemid(Long id);
}
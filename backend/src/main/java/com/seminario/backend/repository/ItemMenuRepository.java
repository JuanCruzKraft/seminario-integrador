package com.seminario.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.seminario.backend.model.ItemMenu;
import com.seminario.backend.model.Vendedor;

import java.util.List;

public interface ItemMenuRepository extends JpaRepository<ItemMenu, Long> {
    List<ItemMenu> findByVendedor(Vendedor vendedor);
    void deleteByVendedor_vendedorid(Long id);
    List<ItemMenu> findByVendedor_vendedorid(Long id);
}
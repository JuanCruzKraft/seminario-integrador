package com.seminario.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.seminario.backend.model.PagoCredito;

@Repository
public interface PagoCreditoRepository extends JpaRepository<PagoCredito, Long> {
    
}
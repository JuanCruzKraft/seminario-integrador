package com.seminario.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.seminario.backend.model.PagoCredito;

@Repository
public interface PagoCreditoRepository extends JpaRepository<PagoCredito, Long> {
    Optional<PagoCredito> findByPagoId(Long pagoId);
}
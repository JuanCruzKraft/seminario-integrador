package com.seminario.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.seminario.backend.model.PagoDebito;

@Repository
public interface PagoDebitoRepository extends JpaRepository<PagoDebito, Long> {
    Optional<PagoDebito> findByPagoId(Long pagoId);
}
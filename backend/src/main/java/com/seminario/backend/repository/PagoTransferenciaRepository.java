package com.seminario.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import com.seminario.backend.model.PagoTransferencia;

@Repository
public interface PagoTransferenciaRepository extends JpaRepository<PagoTransferencia, Long> {
    
}
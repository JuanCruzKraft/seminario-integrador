package com.seminario.backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.seminario.backend.model.Pago;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {
    
}
package com.seminario.backend.repository;
import com.seminario.backend.model.Vendedor;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface VendedorRepository extends JpaRepository<Vendedor, Long> {
/*Esto lo agrego para despues en el momento de buscar ya tenngamos algunas. */
    List<Vendedor> findByNombreContaining(String nombre);
    List<Vendedor> findByActivo(Boolean activo);
    List<Vendedor> findByDireccionContaining(String direccion);


    

}

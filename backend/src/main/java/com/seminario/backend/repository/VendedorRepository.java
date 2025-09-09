package com.seminario.backend.repository;
import com.seminario.backend.model.Vendedor;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface VendedorRepository extends JpaRepository<Vendedor, Long> {
/*Esto lo agrego para despues en el momento de buscar ya tenngamos algunas. */
    List<Vendedor> findByNombreContaining(String nombre);
    List<Vendedor> findByActivo(Boolean activo);
    List<Vendedor> findByDireccionContaining(String direccion);
    @Query("SELECT DISTINCT v FROM Vendedor v JOIN ItemMenu im ON v.vendedorid = im.vendedor.vendedorid WHERE LOWER(im.nombre) LIKE LOWER(CONCAT('%', :nombreProducto, '%'))")
    List<Vendedor> findByItemsMenuNombreContaining(@Param("nombreProducto") String nombreProducto);


    

}

package com.seminario.backend.repository;
import com.seminario.backend.model.Cliente;
import com.seminario.backend.model.Vendedor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClienteRepository extends JpaRepository<Vendedor, Long> {

    List<Cliente> findByNombreContaining(String nombre);
    List<Cliente> findByEmail(String email);
    //List<Cliente> findByDireccionContaining(String direccion); esta no la agrego porque no creo que la necesitemos
    
    
}
    


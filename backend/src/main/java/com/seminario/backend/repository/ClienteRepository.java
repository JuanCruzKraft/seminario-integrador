package com.seminario.backend.repository;
import com.seminario.backend.model.Cliente;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    List<Cliente> findByNombreContaining(String nombre);
    List<Cliente> findByEmail(String email);
    Cliente findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    void deleteById(Long id);

    // No se agrega findByApellido porque no es necesario para el registro de cliente
    // List<Cliente> findByApellidoContaining(String apellido); esta no la agrego porque no creo que la necesitemos
    //List<Cliente> findByDireccionContaining(String direccion); esta no la agrego porque no creo que la necesitemos
    
    
}
    


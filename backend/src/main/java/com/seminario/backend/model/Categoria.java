package com.seminario.backend.model;

import com.seminario.backend.enums.TipoCategoria;

import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoriaid;

    @Column(nullable = false, unique = true)
    private String nombre;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoCategoria tipo;

    /*public Categoria(String nombre, TipoCategoria tipo, String imagen) {
        this.nombre = nombre;
        this.tipo = tipo;
           
    }
*/
}
package com.seminario.backend.model;

import jakarta.persistence.*;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity

//hace falta que un vendedor tenga una lista de su menu o los consultamos desde la clase itemMenu?
public class Vendedor{

    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vendedorid;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String direccion;

    @Column(nullable = false)
    private Boolean activo;

    //@Column
    //private Double calificacionPromedio;
//hay q agregar esto y la lista de calificaciones una vez que se implemente la clase Calificacion
    @Column
    @Embedded
    private Coordenada coordenadas;

    public Vendedor(String nombre, String direccion, Coordenada coordenadas) {
        this.nombre = nombre;
        this.direccion = direccion;
        this.coordenadas = coordenadas;
    }

}
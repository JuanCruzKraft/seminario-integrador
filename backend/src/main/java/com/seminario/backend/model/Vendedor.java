package com.seminario.backend.model;

import java.util.List;

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

    @Column
    private String cuit;

    @Column
    private String cbu;

    @OneToMany(mappedBy = "vendedor") //, cascade = CascadeType.ALL) //, fetch = FetchType.LAZY)   
    private List<Pedido> pedidos;
    
    
    @Column
    private Double calificacionPromedio;

    @Column
    @Embedded
    private Coordenada coordenadas;

    public Vendedor(String nombre, String direccion, Coordenada coordenadas) {
        this.nombre = nombre;
        this.direccion = direccion;
        this.coordenadas = coordenadas;
        this.activo = true; // Por defecto activo
    }

    public Vendedor(String nombre, String direccion, String cuit, Coordenada coordenadas) {
        this.nombre = nombre;
        this.direccion = direccion;
        this.cuit = cuit;
        this.coordenadas = coordenadas;
        this.activo = true; // Por defecto activo
    }

}
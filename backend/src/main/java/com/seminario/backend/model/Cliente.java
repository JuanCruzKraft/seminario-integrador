package com.seminario.backend.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity

//hace falta que un cliente tenga una lista de pedidos?
public class Cliente {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long clienteid;

    @Column(nullable = false)
    private Long cuit;
    
    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellido;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String direccion;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private Boolean activo;

    @Embedded
    private Coordenada coordenadas;

    @OneToMany(mappedBy = "cliente") //, cascade = CascadeType.ALL) //, fetch = FetchType.LAZY)   
    private List<Pedido> pedidos;

    public Cliente(Long cuit, String nombre, String apellido, String email, String direccion, String username, String password) {
        this.cuit = cuit;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.direccion = direccion;
        this.username = username;
        this.password = password;
        this.activo = true; // Por defecto el cliente está activo
        this.coordenadas = null; // Inicialmente no tiene coordenadas, lo vemos cuando hagamos el metodo obtener coordenadas
        this.pedidos = new ArrayList<>(); // Inicializamos la lista de pedidos
    }


}

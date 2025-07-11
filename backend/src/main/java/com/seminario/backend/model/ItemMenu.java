package com.seminario.backend.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED) // O SINGLE_TABLE, según el diseño deseado
@DiscriminatorColumn(name = "tipo_item", discriminatorType = DiscriminatorType.STRING)
@Entity
public abstract class ItemMenu {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemid;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column
    private String descripcion;

    @Column(nullable = false)
    private double precio;

    @Column(nullable = false)
    private double peso;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false)
    private Boolean activo;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "vendedorid", nullable = true)
    private Vendedor vendedor;

    @ManyToMany
    @JoinTable(
        name = "item_categoria",
        joinColumns = @JoinColumn(name = "itemid"),
        inverseJoinColumns = @JoinColumn(name = "categoriaid")
    )
    private Set<Categoria> categorias = new HashSet<>();

    // hasta aca definiciones actuales, a partir de aca, ver si son necesarias o reubicarlas 
    @Column
    private Boolean es_bebida;

    public void addCategoria(Categoria categoria) {
        this.categorias.add(categoria);
    }
    public boolean removeCategoria(Categoria categoria) {
        return this.categorias.remove(categoria);
    }
    public void clearCategoria() {
        this.categorias.clear();
    }

    public boolean hasCategoria(Categoria categoria) {
        return this.categorias.contains(categoria);
    }

    public abstract boolean esComida();

    public abstract boolean esBebida();

    
}

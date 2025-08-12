package com.seminario.backend.model;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.*;
import lombok.*;

@Getter
@ToString
@NoArgsConstructor
@Entity
public class ItemPedido {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itempedidoid;

    @Column(nullable = false)
    @Setter(AccessLevel.NONE)
    private Integer cantidad;

    @Column(nullable = false)
    @Setter(AccessLevel.NONE)
    private Double subtotal;

    @ManyToOne
    @JoinColumn(name = "itemid", nullable = true)
    private ItemMenu itemMenu;


    @ManyToOne
    @JoinColumn(name = "pedidoid")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Pedido pedido;

    //constructor, setters y getters 

    public ItemPedido(ItemMenu itemMenu, int cantidad){
        this.itemMenu = itemMenu;
        this.setCantidad(cantidad);
    }
    public void setPedido(Pedido pedido){
        this.pedido = pedido;
    }
    public void setCantidad(int cantidad){
        this.cantidad = cantidad;
        this.subtotal = cantidad * itemMenu.getPrecio();
    }
}
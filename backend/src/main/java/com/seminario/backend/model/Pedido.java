package com.seminario.backend.model;
import java.time.LocalDateTime;
import java.util.List;

import com.seminario.backend.enums.EstadoPedido;

import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity

public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pedidoid;

    @ManyToOne
    @JoinColumn(name = "vendedorid", nullable = false)
    private Vendedor vendedor;

    @ManyToOne
    @JoinColumn(name = "clienteid", nullable = false)
    private Cliente cliente;

    @Column
    private Double precio;

    @Column(nullable = false)
    private EstadoPedido estado;

    @Column
    private boolean calificado;

    @Column //no deberia ser nullable
    private boolean modificado;

    //falta - metodoPago: EstrategiaPago

    @Column //no deberia ser nullable
    private double distanciaEnvio;

    @Column //no deberia ser nullable
    private double costoEnvio ;

    @Column //no deberia ser nullable
    private LocalDateTime fechaModificacion;

    @Column //no deberia ser nullable
    private LocalDateTime fechaConfirmacion;

    //falta - pago: Pago

    @OneToMany(mappedBy = "itempedidoid") //, cascade = CascadeType.ALL)
    private List<ItemPedido> listaItemPedido;

    @OneToOne(mappedBy = "pedido") //, cascade = CascadeType.ALL)
    private Calificacion calificacion;

    public Pedido(Vendedor vendedor, Cliente cliente) {
        this.vendedor = vendedor;
        this.cliente = cliente;
        this.estado = EstadoPedido.EN_CARRITO; 
        this.calificado = false;
        this.modificado = false;
        this.fechaModificacion = LocalDateTime.now();
        this.fechaConfirmacion = null; // Aún no confirmado
    }
    
    
}

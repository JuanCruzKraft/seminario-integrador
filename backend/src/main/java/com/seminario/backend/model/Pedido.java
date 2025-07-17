package com.seminario.backend.model;
import java.time.LocalDateTime;
import java.util.ArrayList;
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

    @Column(nullable = false)
    private Double precio;

    @Column(nullable = false)
    private EstadoPedido estado;

    @Column(nullable = false)
    private boolean calificado;

    @Column(nullable = false)
    private boolean modificado;

    //falta - metodoPago: EstrategiaPago

    @Column(nullable = false)
    private double distanciaEnvio;

    @Column(nullable = false)
    private double costoEnvio ;

    @Column(nullable = false)
    private LocalDateTime fechaModificacion;

    @Column(nullable = false)
    private LocalDateTime fechaConfirmacion;

    //falta - pago: Pago

   @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    private List<ItemPedido> listaItemPedido = new ArrayList<>();


    @OneToOne(mappedBy = "pedido", cascade = CascadeType.ALL)
    private Calificacion calificacion;

    public Pedido(Vendedor vendedor, Cliente cliente) {
    this.vendedor = vendedor;
    this.cliente = cliente;
    this.estado = EstadoPedido.EN_CARRITO;
    this.calificado = false;
    this.modificado = false;
    this.fechaModificacion = LocalDateTime.now();
    this.fechaConfirmacion = null; // y cambiale nullable = true en la entidad
    this.distanciaEnvio = 0.0;
    this.costoEnvio = 0.0;
}

    
    
}

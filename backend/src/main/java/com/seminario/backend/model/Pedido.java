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
    @JoinColumn(name = "vendedor_id", nullable = false)
    private Vendedor vendedor;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
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
    private List<ItemPedido> listaItemPedido;
    

    //el constructor deberia crear el pedido y setearlo en estado en carrito
    
}

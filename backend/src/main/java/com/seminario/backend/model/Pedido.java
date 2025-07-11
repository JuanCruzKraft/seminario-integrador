package com.seminario.backend.model;
import java.time.LocalDateTime;

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

    @Column(nullable = false)
    private float precio;

    @Column(nullable = false)
    private boolean calificado;

    @Column(nullable = false)
    private boolean modifcado;

    @Column(nullable = false)
    private double distanciaEnvio;

    @Column(nullable = false)
    private double costoEnvio ;

    @Column(nullable = false)
    private LocalDateTime fechaModificacion;

    @Column(nullable = false)
    private LocalDateTime fechaConfirmacion;
    
    @ManyToOne
    @JoinColumn(name = "vendedor_id", nullable = false)
    private Vendedor vendedor;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;


    // falta: estado metodo de pago, pago, listaItemPedido.

    
}

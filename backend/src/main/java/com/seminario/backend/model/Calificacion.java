package com.seminario.backend.model;
import java.time.LocalDateTime;


import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Calificacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long calificacionid;

    @OneToOne
    @JoinColumn(name = "pedidoid", nullable = false)
    private Pedido pedido;

    @Column(nullable = false)
    private int puntaje;

    @Column(nullable = false)
    private String comentario;

    @Column(nullable = false)
    private LocalDateTime fechaCalificacion;

    // Constructor para crear una calificación asociada a un pedido
    public Calificacion(Pedido pedido, int puntaje, String comentario) {
        this.pedido = pedido;
        this.puntaje = puntaje;
        this.comentario = comentario;
        this.fechaCalificacion = LocalDateTime.now();
    }
}
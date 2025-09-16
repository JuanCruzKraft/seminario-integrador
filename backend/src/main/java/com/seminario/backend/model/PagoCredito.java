package com.seminario.backend.model;

import com.seminario.backend.model.interfaces.MetodoPagoInterface;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor // Constructor sin argumentos requerido por JPA
@AllArgsConstructor
@Entity
@Table(name = "pago_credito")
public class PagoCredito implements MetodoPagoInterface {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pago_credito_id")
    private Long id; // Identificador único para el pago con crédito
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pago_id", nullable = false)
    private Pago pago; // FK al pago principal
    
    @Column(name = "recargo")
    private Double recargo; // Recargo por usar tarjeta de crédito
    
    @Column(name = "numero_tarjeta", nullable = false)
    private String numeroTarjeta;
    
    @Column(name = "nombre_titular", nullable = false)
    private String nombreTitular;
    
    @Column(name = "dni_titular", nullable = false)
    private String dniTitular;
    
    @Column(name = "monto_final", nullable = false)
    private Double montoFinal; // Monto original + recargo
    
    @Override
    public void pagar(double monto) {
        // Calcular recargo (ejemplo: 3% para crédito)
        this.recargo = monto * 0.03;
        this.montoFinal = monto + this.recargo;
    }

    public PagoCredito(Pago pago, String numeroTarjeta, String nombreTitular, String dniTitular, Double monto) {
        this.pago = pago;
        this.numeroTarjeta = numeroTarjeta;
        this.nombreTitular = nombreTitular;
        this.dniTitular = dniTitular;
        this.pagar(monto); // Calcula recargo y monto final
    }
}

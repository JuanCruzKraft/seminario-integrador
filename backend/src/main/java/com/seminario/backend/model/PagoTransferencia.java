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
@Table(name = "pago_transferencia")
public class PagoTransferencia implements MetodoPagoInterface {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pago_transferencia_id")
    private Long id; // Identificador único para la transferencia
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pago_id", nullable = false)
    private Pago pago; // FK al pago principal
    
    @Column(name = "monto_final", nullable = false)
    private Double montoFinal; // Monto de la transferencia

    @Override
    public void pagar(double monto) {
        // Para transferencia no hay recargo adicional
        this.montoFinal = monto;
    }

    public PagoTransferencia(Pago pago, Double monto) {
        this.pago = pago;
        this.pagar(monto); // Establece monto final
    }
}

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
@Table(name = "pago_debito")
public class PagoDebito implements MetodoPagoInterface {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pago_debito_id")
    private Long id; // Identificador único para el pago con débito
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pago_id", nullable = false)
    private Pago pago; // FK al pago principal
    
    @Column(name = "numero_tarjeta", nullable = false)
    private String numeroTarjeta;
    
    @Column(name = "nombre_titular", nullable = false)
    private String nombreTitular;
    
    @Column(name = "dni_titular", nullable = false)
    private String dniTitular;
    
    @Column(name = "monto_final", nullable = false)
    private Double montoFinal; // Para débito no hay recargo, es igual al monto original

    @Override
    public void pagar(double monto) {
        // Para débito no hay recargo adicional
        this.montoFinal = monto;
    }

    public PagoDebito(Pago pago, String numeroTarjeta, String nombreTitular, String dniTitular, Double monto) {
        this.pago = pago;
        this.numeroTarjeta = numeroTarjeta;
        this.nombreTitular = nombreTitular;
        this.dniTitular = dniTitular;
        this.pagar(monto); // Establece monto final
    }
}

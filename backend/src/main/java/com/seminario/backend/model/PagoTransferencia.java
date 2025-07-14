package com.seminario.backend.model;

import com.seminario.backend.model.interfaces.MetodoPagoInterface;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor // Constructor sin argumentos requerido por JPA
@AllArgsConstructor
@Entity
public class PagoTransferencia implements MetodoPagoInterface {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Identificador único para la transferencia

    @Override
    public void pagar(double monto) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'pagar'");
    }


    
}

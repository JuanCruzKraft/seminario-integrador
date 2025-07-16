package com.seminario.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Entity
@DiscriminatorValue("BEBIDA")
public class Bebida extends ItemMenu {

    @Column
    private Double graduacionAlcoholica;

    @Column(nullable = false)
    private Double tamanio; // tamaño en litros o ml

    @Override
    public boolean esComida() {
        return false;
    }

    @Override
    public boolean esBebida() {
        return true;
    }

    // Constructor de conveniencia
    public Bebida(String nombre, String descripcion, double precio, double peso, Integer stock, Boolean activo, Vendedor vendedor, Double graduacionAlcoholica, Double tamanio) {
        setNombre(nombre);
        setDescripcion(descripcion);
        setPrecio(precio);
        setPeso(peso);
        setStock(stock);
        setActivo(activo);
        setVendedor(vendedor);
        this.graduacionAlcoholica = graduacionAlcoholica;
        this.tamanio = tamanio;
    }
}

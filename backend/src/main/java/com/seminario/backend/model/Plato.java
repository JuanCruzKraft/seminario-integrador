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
@DiscriminatorValue("PLATO")
public class Plato extends ItemMenu {

    @Column(nullable = false)
    private float calorias;

    @Override
    public boolean esComida() {
        return true;
    }

    @Override
    public boolean esBebida() {
        return false;
    }

    // Constructor de conveniencia
    public Plato(String nombre, String descripcion, double precio, double peso, Integer stock, Boolean activo, Vendedor vendedor, float calorias) {
        setNombre(nombre);
        setDescripcion(descripcion);
        setPrecio(precio);
        setPeso(peso);
        setStock(stock);
        setActivo(activo);
        setVendedor(vendedor);
        this.calorias = calorias;
    }
}

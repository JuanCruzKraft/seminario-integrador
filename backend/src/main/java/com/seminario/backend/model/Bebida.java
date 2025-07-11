package com.seminario.backend.model;

import jakarta.persistence.*;

import lombok.*;

@Getter
@EqualsAndHashCode(callSuper = false)
@Setter
@ToString(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Bebida extends ItemMenu {

    @Column
    private Double graduacionAlcoholica;

    @Column
    private Double tamanio;


    //deberiamos definir el constructor de modo tal que setee la categoría bebida al momento de creacion
    @Override
    public boolean esComida() {
        return false;
    }
    @Override
    public boolean esBebida() {
        return true;
    }

}
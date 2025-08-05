package com.seminario.backend.model;

import jakarta.persistence.*;

import lombok.*;

@Getter
@Setter
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
@Entity
@DiscriminatorValue("PLATO")
public class Plato extends ItemMenu {

    @Column
    private float calorias;



    //quizas  no van a ser necesarios segun implementacion actual
    //hay q definir el constructor de modo tal que setee la categoría comida al momento de creacion
    @Override
    public boolean esComida() {
        return true;
    }

    @Override
    public boolean esBebida() {
        return false;
    }



}
package com.seminario.backend.dto.request.carrito;

import java.util.Optional;

import com.seminario.backend.dto.ResultadoOperacion;
import com.seminario.backend.model.ItemMenu;

public class AgregarItemRequestDTO {

    public Long clienteid;
        //definir atributos del dto aca
    public Long vendedorid;
    public Long itemMenuId;
    public Integer cantidad;


}

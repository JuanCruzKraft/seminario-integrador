package com.seminario.backend.dto.request;

public class BuscarVendedorPorNombreRequestDTO {
    public String nombreVendedor;

    public BuscarVendedorPorNombreRequestDTO() {
    }

    public BuscarVendedorPorNombreRequestDTO(String nombreVendedor) {
        this.nombreVendedor = nombreVendedor;
    }
}

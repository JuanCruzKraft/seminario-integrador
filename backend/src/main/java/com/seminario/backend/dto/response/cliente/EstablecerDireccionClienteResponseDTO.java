package com.seminario.backend.dto.response.cliente;

import com.seminario.backend.dto.ResultadoOperacion;

public class EstablecerDireccionClienteResponseDTO {
    public ResultadoOperacion resultado;
    public Double latitud;
    public Double longitud;

public EstablecerDireccionClienteResponseDTO() {
    super();
    this.resultado = new ResultadoOperacion();

}
}
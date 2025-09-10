package com.seminario.backend.dto.response;

import com.seminario.backend.dto.ResultadoOperacion;
import com.seminario.backend.enums.EstadoPedido;

public class EstadoPedidoResponseDTO {
    public Long pedidoId;
    public EstadoPedido estado;
    public String estadoTexto;
    public Integer tiempoRestante; // minutos hasta próxima transición
    public Integer tiempoTotal; // tiempo total estimado
    public Double progreso; // porcentaje de progreso (0-100)
    public String siguienteEstado;
    public ResultadoOperacion resultado;

    public EstadoPedidoResponseDTO() {
        this.resultado = new ResultadoOperacion();
    }

    public Long getPedidoId() { return pedidoId; }
    public void setPedidoId(Long pedidoId) { this.pedidoId = pedidoId; }

    public EstadoPedido getEstado() { return estado; }
    public void setEstado(EstadoPedido estado) { this.estado = estado; }

    public String getEstadoTexto() { return estadoTexto; }
    public void setEstadoTexto(String estadoTexto) { this.estadoTexto = estadoTexto; }

    public Integer getTiempoRestante() { return tiempoRestante; }
    public void setTiempoRestante(Integer tiempoRestante) { this.tiempoRestante = tiempoRestante; }

    public Integer getTiempoTotal() { return tiempoTotal; }
    public void setTiempoTotal(Integer tiempoTotal) { this.tiempoTotal = tiempoTotal; }

    public Double getProgreso() { return progreso; }
    public void setProgreso(Double progreso) { this.progreso = progreso; }

    public String getSiguienteEstado() { return siguienteEstado; }
    public void setSiguienteEstado(String siguienteEstado) { this.siguienteEstado = siguienteEstado; }

    public ResultadoOperacion getResultado() { return resultado; }
    public void setResultado(ResultadoOperacion resultado) { this.resultado = resultado; }
}

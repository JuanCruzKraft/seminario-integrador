package com.seminario.backend.sesion;
import org.springframework.stereotype.Component;


/* La idea de esto es que simule una sesion activa. solo se puede un  usuario a la vez.*/
@Component
public class SesionMockeada {
    private Long idSesionActual;
    public Long getIdSesionActual() {
        return idSesionActual;
    }
    public void setIdSesionActual(Long idSesionActual) {
        this.idSesionActual = idSesionActual;
    }

    public boolean estaLogueado() {
        return idSesionActual != null;
    }

    public void cerrarSesion() {
        idSesionActual= null;
    }
}

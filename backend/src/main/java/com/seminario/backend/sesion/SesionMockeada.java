package com.seminario.backend.sesion;
import org.springframework.stereotype.Component;


/* La idea de esto es que simule una sesion activa. solo se puede un  usuario a la vez.*/
@Component
public class SesionMockeada {
    private Long idSesionActual = null; // Valor por defecto para testing
    private String username;
    private String password;

    public void setUserNameSesionActual(String userName) {
        this.username = userName;
    }
        public void setPasswordSesionActual(String password) {
        this.password = password;
    }
    public String getUsername() {
        return username;
    }
    public String getPassword() {
        return password;
    }
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
        this.idSesionActual = null;
        this.username = null;
        this.password = null;
    }
}

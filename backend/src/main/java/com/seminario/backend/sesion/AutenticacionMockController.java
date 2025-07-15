package com.seminario.backend.sesion;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AutenticacionMockController {

    @Autowired
    private SesionMockeada sesion;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam Long userId) {
        sesion.setIdSesionActual(userId);
        return ResponseEntity.ok("Sesión iniciada con usuario " + userId);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        sesion.cerrarSesion();
        return ResponseEntity.ok("Sesión cerrada");
    }

    @GetMapping("/estado")
    public ResponseEntity<String> estado() {
        if (sesion.estaLogueado()) {
            return ResponseEntity.ok("Usuario logueado: " + sesion.getIdSesionActual());
        } else {
            return ResponseEntity.ok("Nadie está logueado");
        }
    }
}

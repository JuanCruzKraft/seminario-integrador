package com.seminario.backend.service;

public class ApiConsumerService {

    // este service se va a encargar de las validaciones de los ""ssistemas externos"" que se van a consumir

    //esta se va a usar para registrar un cliente
    public Boolean validarcontrasena(String contrasena) {

        // Asumimos que el servicio externo hace una validacion asi:
        // Longitud mínima de 8 caracteres
        if (contrasena.length() < 8)
            return false;

        // Al menos un signo especial (@#$%*)
        if (!contrasena.matches(".*[@#$%*].*"))
            return false;

        // Al menos una letra mayúscula
        if (!contrasena.matches(".*[A-Z].*"))
            return false;

        // Al menos un dígito
        if (!contrasena.matches(".*\\d.*"))
            return false;

        return true;
    }

    //esta validacion no se si es necesaria (no esta de mas, de todos modos )
    //en el front se deberia validar con: <input type="email" id="email" name="email" required>
    public boolean validarEmail(String email) {
        // Asumimos que el servicio externo valida el email con una expresión regular
        String emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        return email.matches(emailRegex);
    }

    public String obtenerRequisitosContrasena() {
        return """
                <p>La contraseña debe cumplir los siguientes requisitos:</p>
                <ul>
                    <li>Longitud mínima de 8 caracteres</li>
                    <li>Debe contener al menos un signo especial (@#$%*)</li>
                    <li>Debe contener al menos una letra mayúscula</li>
                    <li>Debe contener al menos un dígito</li>
                </ul>
                """;
    }

}

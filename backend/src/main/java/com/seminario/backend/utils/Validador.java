package com.seminario.backend.utils;

import java.util.regex.Pattern;

public class Validador {

    // Regex para email (opción más completa)
    private static final String EMAIL_REGEX =
            "^(?=.{1,254}$)(?!\\.)(?!.*\\.$)(?!.*\\.\\.)([A-Za-z0-9._%+\\-]+(?:\\.[A-Za-z0-9._%+\\-]+)*)@(?:(?:[A-Za-z0-9](?:[A-Za-z0-9\\-]{0,61}[A-Za-z0-9])?)\\.)+[A-Za-z]{2,}$";

    // Regex para contraseña (mínimo 8, al menos una mayúscula y un dígito, sin espacios)
    private static final String PASSWORD_REGEX =
            "^(?=.{8,}$)(?=.*[A-Z])(?=.*\\d)(?!.*\\s).+$";

    private static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX);
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(PASSWORD_REGEX);

    public static boolean validarEmail(String email) {
        return EMAIL_PATTERN.matcher(email).matches();
    }

    public static boolean validarPassword(String password) {
        return PASSWORD_PATTERN.matcher(password).matches();
    }
}
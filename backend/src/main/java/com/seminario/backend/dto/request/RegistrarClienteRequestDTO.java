package com.seminario.backend.dto.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegistrarClienteRequestDTO {

    @NotBlank
    @Size(max = 32)
    private String nombre;

    @NotBlank
    @Size(max = 32)
    private String apellido;
    
    @NotNull
    @Digits(integer = 11, fraction = 0)
    private Long cuit;

    @NotBlank
    @Email
    private String email;

    //esta direccion es un mock por ahora, dps vemos como lo hacemos
    @NotBlank
    private String direccion;

    @NotBlank
    @Size(min = 4, max = 12)
    private String username;



    //ver el tema de la expresion regular para que cumpla con todos los criterios que propusimos 
    //que serian los caracteres especiales y eso
    @NotBlank
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{8,}$",
        message = "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número"
    )
    private String password;
    @NotBlank
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{8,}$",
        message = "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número"
    )
    private String confirmarPassword;


    
}

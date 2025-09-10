package com.seminario.backend.controller;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.seminario.backend.dto.request.carrito.ConfirmarCarritoRequestDTO;
import com.seminario.backend.dto.request.pago.PagoTarjetaRequestDTO;
import com.seminario.backend.dto.request.pago.PagoTransferenciaRequestDTO;
import com.seminario.backend.dto.response.carrito.ConfirmarCarritoResponseDTO;
import com.seminario.backend.enums.MetodoPago;
import com.seminario.backend.service.PagoService;

@RestController
@RequestMapping("/pago")
public class PagoController {
    
    private final PagoService pagoService;
    
    public PagoController(PagoService pagoService) {
        this.pagoService = pagoService;
    }
    
    
   @PostMapping("/pagar")
    public ConfirmarCarritoResponseDTO procesarPago(@RequestBody ConfirmarCarritoRequestDTO request) {
        return pagoService.procesarPago(request);
    }
    
    @PostMapping("/pagar-tarjeta")
    public ConfirmarCarritoResponseDTO procesarPagoTarjeta(@RequestBody PagoTarjetaRequestDTO request) {
        // Convert PagoTarjetaRequestDTO to ConfirmarCarritoRequestDTO for service compatibility
        ConfirmarCarritoRequestDTO carritoRequest = new ConfirmarCarritoRequestDTO();
        carritoRequest.setNumeroTarjeta(request.getNumeroTarjeta());
        carritoRequest.setNombreTitular(request.getNombreTitular());
        carritoRequest.setFechaVencimiento(request.getFechaVencimiento());
        carritoRequest.setCodigoSeguridad(request.getCodigoSeguridad());
        carritoRequest.setObservaciones(request.getObservaciones());
        
        // Determinar el método de pago basado en el primer dígito de la tarjeta
        if (request.getNumeroTarjeta() != null && request.getNumeroTarjeta().startsWith("5")) {
            carritoRequest.setMetodoPago(MetodoPago.TARJETA_CREDITO);
        } else if (request.getNumeroTarjeta() != null && request.getNumeroTarjeta().startsWith("4")) {
            carritoRequest.setMetodoPago(MetodoPago.TARJETA_DEBITO);
        }
        
        return pagoService.procesarPago(carritoRequest);
    }
    
    @PostMapping("/pagar-transferencia")
    public ConfirmarCarritoResponseDTO procesarPagoTransferencia(@RequestBody PagoTransferenciaRequestDTO request) {
        // Convert PagoTransferenciaRequestDTO to ConfirmarCarritoRequestDTO for service compatibility
        ConfirmarCarritoRequestDTO carritoRequest = new ConfirmarCarritoRequestDTO();
        carritoRequest.setObservaciones(request.getObservaciones());
        carritoRequest.setMetodoPago(MetodoPago.TRANSFERENCIA);
        
        return pagoService.procesarPago(carritoRequest);
    }
    
    @GetMapping("/preparar")
    public ConfirmarCarritoResponseDTO prepararPago(@RequestParam MetodoPago metodoPago) {
        return pagoService.prepararPago(metodoPago);
    }
    
    @GetMapping("/resumen")
    public ConfirmarCarritoResponseDTO obtenerResumenPago(@RequestParam Long pedidoId) {
        return pagoService.obtenerResumenPago(pedidoId);
    }
    
    @GetMapping("/pdf")
    public ResponseEntity<byte[]> descargarPDF(@RequestParam Long pedidoId) {
        byte[] pdf = pagoService.generarPDF(pedidoId);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.builder("attachment")
                .filename("pedido_" + pedidoId + ".pdf")
                .build());
                
        return ResponseEntity.ok()
                .headers(headers)
                .body(pdf);
    }
}

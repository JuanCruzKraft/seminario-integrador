package com.seminario.backend.model;
import lombok.*;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;

import com.seminario.backend.enums.EstadoPago;
import com.seminario.backend.enums.MetodoPago;
import com.seminario.backend.model.interfaces.MetodoPagoInterface;

import jakarta.persistence.*;

@Data
@NoArgsConstructor // Constructor sin argumentos requerido por JPA
@AllArgsConstructor
@Entity
public class Pago {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column
    private LocalDateTime fechaEmision;

    @Column
    private String numeroFactura;

    @Column
    private Double monto;

    @Column
    private EstadoPago estado;

    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @Column
    private MetodoPagoInterface metodo;

    @Column
    private String resumen;

    @Column
    private String archivoFacturaPDF;

    //constructor HAY QUE REVISAR Y HACERLO NUEVO
    public Pago(Pedido pedido) {
        this.pedido = pedido;
        this.monto = pedido.getPrecio();
        this.fechaEmision = LocalDateTime.now(); // Establece la fecha de pago al momento actual
        //asumiendo que el pago se crea al momento de confirmado, no se si estaria bien
    }
    //si no, hacer this.fechaPago = null y dps de confirmarel pago un setfechapago now
    public Pago(Pedido pedido, MetodoPagoInterface metodo) {
        this(pedido);
        this.metodo = metodo;
        this.estado = EstadoPago.PENDIENTE;
     } // Asignar estado inicial
    public void procesarPago(double monto) {
        if (metodo == null) {
            throw new IllegalStateException("No se ha definido un método de pago.");
        }
        metodo.pagar(monto);
    }

     public void setMetodoPago(MetodoPagoInterface metodo) {
        this.metodo = metodo;
    }
    // Método para obtener un resumen del pago, no lo vamos a usar pero lo dejo para revisar
    public String getResumen() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Cliente cliente = pedido.getCliente(); 
        Vendedor vendedor = pedido.getVendedor(); 
        return String.format("Pago ID: %d, Pedido ID: %d, Cliente: %s, Vendedor: %s, Monto: %.2f, Fecha de Pago: %s",
                id, pedido.getPedidoid(), cliente.getNombre(), vendedor.getNombre(), monto, sdf.format(fechaEmision));
    }
}
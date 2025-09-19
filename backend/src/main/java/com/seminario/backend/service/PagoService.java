package com.seminario.backend.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.seminario.backend.dto.ItemPedidoDTO;
import com.seminario.backend.dto.request.carrito.ConfirmarCarritoRequestDTO;
import com.seminario.backend.dto.response.carrito.ConfirmarCarritoResponseDTO;
import com.seminario.backend.enums.EstadoPago;
import com.seminario.backend.enums.EstadoPedido;
import com.seminario.backend.enums.MetodoPago;
import com.seminario.backend.model.ItemPedido;
import com.seminario.backend.model.Pago;
import com.seminario.backend.model.PagoCredito;
import com.seminario.backend.model.PagoDebito;
import com.seminario.backend.model.PagoTransferencia;
import com.seminario.backend.model.Pedido;
import com.seminario.backend.repository.ItemPedidoRepository;
import com.seminario.backend.repository.PagoRepository;
import com.seminario.backend.repository.PagoCreditoRepository;
import com.seminario.backend.repository.PagoDebitoRepository;
import com.seminario.backend.repository.PagoTransferenciaRepository;
import com.seminario.backend.repository.PedidoRepository;
import com.seminario.backend.sesion.SesionMockeada;

@Service
public class PagoService {
    
    private final PedidoRepository pedidoRepository;
    private final PagoRepository pagoRepository;
    private final PagoCreditoRepository pagoCreditoRepository;
    private final PagoDebitoRepository pagoDebitoRepository;
    private final PagoTransferenciaRepository pagoTransferenciaRepository;
    private final ItemPedidoRepository itemPedidoRepository;
    private final SesionMockeada sesion;
    private final PedidoService pedidoService;
    private final EnvioService envioService;

    public PagoService(PedidoRepository pedidoRepository, PagoRepository pagoRepository, 
                      PagoCreditoRepository pagoCreditoRepository, PagoDebitoRepository pagoDebitoRepository, 
                      PagoTransferenciaRepository pagoTransferenciaRepository, ItemPedidoRepository itemPedidoRepository, 
                      SesionMockeada sesion, PedidoService pedidoService, EnvioService envioService) {
        this.pedidoRepository = pedidoRepository;
        this.pagoRepository = pagoRepository;
        this.pagoCreditoRepository = pagoCreditoRepository;
        this.pagoDebitoRepository = pagoDebitoRepository;
        this.pagoTransferenciaRepository = pagoTransferenciaRepository;
        this.itemPedidoRepository = itemPedidoRepository;
        this.sesion = sesion;
        this.pedidoService = pedidoService;
        this.envioService = envioService;
    }
    
    @Transactional
    public ConfirmarCarritoResponseDTO procesarPago(ConfirmarCarritoRequestDTO request) {
        ConfirmarCarritoResponseDTO response = new ConfirmarCarritoResponseDTO();
        
        try {
            // Obtener el carrito del cliente actual
            Pedido carrito = pedidoRepository.findByClienteClienteidAndEstado(sesion.getIdSesionActual(), EstadoPedido.EN_CARRITO);
            
            if (carrito == null) {
                response.resultado.setStatus(404);
                response.resultado.setMensaje("No hay un carrito activo para procesar el pago");
                return response;
            }
            
            // Validar el método de pago y datos específicos
            String validationMessage = validarDatosPago(request);
            if (validationMessage != null) {
                response.resultado.setStatus(400);
                response.resultado.setMensaje(validationMessage);
                return response;
            }
            
            // Procesar el pago según el método elegido
            boolean pagoExitoso = procesarMetodoPago(request);
            
            if (!pagoExitoso) {
                response.resultado.setStatus(400);
                response.resultado.setMensaje("Error al procesar el pago");
                return response;
            }

            // Calcular subtotal de items y costo de envío
            Set<ItemPedido> items = itemPedidoRepository.findByPedido(carrito);
            double subtotalItems = items.stream().mapToDouble(ItemPedido::getSubtotal).sum();
            
            // Obtener o calcular el costo de envío
            Double costoEnvio = carrito.getCostoEnvio();
            if (costoEnvio == null && carrito.getDistanciaEnvio() > 0){
                costoEnvio = envioService.calcularCostoEnvio(carrito.getDistanciaEnvio());
                carrito.setCostoEnvio(costoEnvio);
            } else if (costoEnvio == null) {
                costoEnvio = 0.0; // Si no hay datos de envío
            }
            
            // Calcular precio final según el método de pago
            double precioFinal;
            double recargo = 0.0;
            
            if (request.getMetodoPago() == MetodoPago.TARJETA_CREDITO) {
                // Tarjeta de crédito: (subtotal + envío) + 10%
                double baseTotal = subtotalItems + costoEnvio;
                recargo = baseTotal * 0.10;
                precioFinal = baseTotal + recargo;
            } else {
                // Débito y transferencia: subtotal + envío (sin recargo)
                precioFinal = subtotalItems + costoEnvio;
            }
            
            // Actualizar el precio final del pedido
            carrito.setPrecio(precioFinal);

            // Crear registro de pago
            Pago pago = new Pago();
            pago.setPedido(carrito);
            pago.setMonto(precioFinal);
            // Usar el setter correcto para el enum
            pago.setMetodoPago(request.getMetodoPago());
            pago.setEstado(EstadoPago.PAGADO);
            pago.setFechaEmision(LocalDateTime.now());
            pago.setResumen(generarResumenPago(request, precioFinal));
            
            // Guardar el pago
            Pago pagoGuardado = pagoRepository.save(pago);
            
            // Guardar los datos específicos según el método de pago
            guardarDatosEspecificosPago(pagoGuardado, request, precioFinal, recargo);
            
            // Actualizar el estado del pedido
            System.out.println("Estado del pedido antes del pago: " + carrito.getEstado());
            carrito.setEstado(EstadoPedido.CONFIRMADO);
            carrito.setFechaConfirmacion(LocalDateTime.now());
            
            // Guardar los cambios en el pedido
            Pedido pedidoGuardado = pedidoRepository.save(carrito);
            System.out.println("Pedido guardado con estado: " + pedidoGuardado.getEstado() + " e ID: " + pedidoGuardado.getPedidoid());
            System.out.println("Fecha de confirmación: " + pedidoGuardado.getFechaConfirmacion());
            
            // Configurar la respuesta
            response.setSubtotal(subtotalItems);
            response.setCostoEnvio(costoEnvio);
            response.setRecargo(recargo);
            response.setTotal(precioFinal);
            response.setItems(convertirItemsADTO(carrito));
            response.setVendedorId(carrito.getVendedor().getVendedorid());
            response.setVendedorNombre(carrito.getVendedor().getNombre());
            response.setVendedorCuit(carrito.getVendedor().getCuit());
            response.setVendedorCbu(carrito.getVendedor().getCbu());
            response.setMetodoPago(request.getMetodoPago());
            response.setPedidoId(pedidoGuardado.getPedidoid());
            response.resultado.setStatus(0);
            response.resultado.setMensaje("Pago procesado exitosamente. Pedido confirmado.");
            
            pedidoService.programarTransicionesPedido(pedidoGuardado.getPedidoid());

        } catch (Exception e) {
            response.resultado.setStatus(500);
            response.resultado.setMensaje("Error interno del servidor: " + e.getMessage());
        }
        
        return response;
    }
    
    public ConfirmarCarritoResponseDTO prepararPago(MetodoPago metodoPago) {
        ConfirmarCarritoResponseDTO response = new ConfirmarCarritoResponseDTO();
        
        try {
            // Obtener el carrito del cliente actual
            Pedido carrito = pedidoRepository.findByClienteClienteidAndEstado(sesion.getIdSesionActual(), EstadoPedido.EN_CARRITO);
            
            if (carrito == null) {
                response.resultado.setStatus(404);
                response.resultado.setMensaje("No hay un carrito activo");
                return response;
            }
            
            // Calcular subtotal de items y costo de envío
            Set<ItemPedido> items = itemPedidoRepository.findByPedido(carrito);
            double subtotalItems = items.stream().mapToDouble(ItemPedido::getSubtotal).sum();
            
            // Obtener o calcular el costo de envío
            Double costoEnvio = carrito.getCostoEnvio();
            if (costoEnvio == null && carrito.getDistanciaEnvio() > 0) {
                costoEnvio = envioService.calcularCostoEnvio(carrito.getDistanciaEnvio());
            } else if (costoEnvio == null) {
                costoEnvio = 0.0; // Si no hay datos de envío
            }
            
            // Calcular precio final según el método de pago (solo para mostrar en la respuesta)
            double precioFinal;
            double recargo = 0.0;
            
            if (metodoPago == MetodoPago.TARJETA_CREDITO) {
                // Tarjeta de crédito: (subtotal + envío) + 10%
                double baseTotal = subtotalItems + costoEnvio;
                recargo = baseTotal * 0.10;
                precioFinal = baseTotal + recargo;
            } else {
                // Débito y transferencia: subtotal + envío (sin recargo)
                precioFinal = subtotalItems + costoEnvio;
            }
            
            // Configurar la respuesta
            response.setSubtotal(subtotalItems);
            response.setCostoEnvio(costoEnvio);
            response.setRecargo(recargo);
            response.setTotal(precioFinal);
            response.setItems(convertirItemsADTO(carrito));
            response.setVendedorId(carrito.getVendedor().getVendedorid());
            response.setVendedorNombre(carrito.getVendedor().getNombre());
            response.setVendedorCuit(carrito.getVendedor().getCuit());
            response.setVendedorCbu(carrito.getVendedor().getCbu());
            response.resultado.setStatus(0);
            response.resultado.setMensaje("Información de pago preparada");
            
        } catch (Exception e) {
            response.resultado.setStatus(500);
            response.resultado.setMensaje("Error interno del servidor: " + e.getMessage());
        }
        
        return response;
    }
    
    private String validarDatosPago(ConfirmarCarritoRequestDTO request) {
        if (request.getMetodoPago() == null) {
            return "Debe seleccionar un método de pago";
        }
        
        switch (request.getMetodoPago()) {
            case TARJETA_CREDITO:
            case TARJETA_DEBITO:
                return validarDatosTarjeta(request);
            case TRANSFERENCIA:
                return validarDatosTransferencia(request);
            default:
                return "Método de pago no válido";
        }
    }
    
    private String validarDatosTarjeta(ConfirmarCarritoRequestDTO request) {
        if (request.getNumeroTarjeta() == null || request.getNumeroTarjeta().length() < 15) {
            return "El número de tarjeta debe tener al menos 15 dígitos";
        }
        
        // Validar que tarjeta de crédito empiece con 5 y débito con 4
        if (request.getMetodoPago() == MetodoPago.TARJETA_CREDITO) {
            if (!request.getNumeroTarjeta().startsWith("5")) {
                return "El número de tarjeta de crédito debe comenzar con 5";
            }
        } else if (request.getMetodoPago() == MetodoPago.TARJETA_DEBITO) {
            if (!request.getNumeroTarjeta().startsWith("4")) {
                return "El número de tarjeta de débito debe comenzar con 4";
            }
        }
        
        if (request.getNombreTitular() == null || request.getNombreTitular().trim().isEmpty()) {
            return "El nombre del titular es obligatorio";
        }
        
        if (request.getFechaVencimiento() == null || request.getFechaVencimiento().trim().isEmpty()) {
            return "La fecha de vencimiento es obligatoria";
        }
        
        // Validar que la fecha de vencimiento no sea pasada
        if (!validarFechaVencimiento(request.getFechaVencimiento())) {
            return "La fecha de vencimiento debe ser mayor a la fecha actual";
        }
        
        if (request.getCodigoSeguridad() == null || request.getCodigoSeguridad().trim().isEmpty()) {
            return "El código de seguridad es obligatorio";
        }
        
        return null; // Validación exitosa
    }
    
    private String validarDatosTransferencia(ConfirmarCarritoRequestDTO request) {
        // Para transferencias, el usuario no necesita proporcionar CBU/alias
        // porque va a transferir AL vendedor, no recibir dinero
        // Solo validamos que tenga observaciones si fuera necesario (opcional)
        return null; // Validación exitosa - no se requieren datos adicionales
    }
    
    private boolean validarFechaVencimiento(String fechaVencimiento) {
        try {
            // Formato esperado: MM/AA
            if (!fechaVencimiento.matches("\\d{2}/\\d{2}")) {
                return false;
            }
            
            String[] partes = fechaVencimiento.split("/");
            int mes = Integer.parseInt(partes[0]);
            int año = Integer.parseInt("20" + partes[1]); // Asumimos 20XX
            
            // Validar mes válido
            if (mes < 1 || mes > 12) {
                return false;
            }
            
            LocalDateTime ahora = LocalDateTime.now();
            int mesActual = ahora.getMonthValue();
            int añoActual = ahora.getYear();
            
            // La tarjeta debe vencer en el futuro (mes siguiente o año posterior)
            return (año > añoActual) || (año == añoActual && mes > mesActual);
            
        } catch (Exception e) {
            return false;
        }
    }
    
    private boolean procesarMetodoPago(ConfirmarCarritoRequestDTO request) {
        // Aquí iría la lógica real de procesamiento de pago
        // Por ahora simulamos que siempre es exitoso
        
        switch (request.getMetodoPago()) {
            case TARJETA_CREDITO:
                return procesarPagoTarjetaCredito(request);
            case TARJETA_DEBITO:
                return procesarPagoTarjetaDebito(request);
            case TRANSFERENCIA:
                return procesarPagoTransferencia(request);
            default:
                return false;
        }
    }
    
    private boolean procesarPagoTarjetaCredito(ConfirmarCarritoRequestDTO request) {
        // Simular procesamiento de tarjeta de crédito
        System.out.println("Procesando pago con tarjeta de crédito: " + request.getNumeroTarjeta().substring(0, 4) + "****");
        return true; // Simulamos que siempre es exitoso
    }
    
    private boolean procesarPagoTarjetaDebito(ConfirmarCarritoRequestDTO request) {
        // Simular procesamiento de tarjeta de débito
        System.out.println("Procesando pago con tarjeta de débito: " + request.getNumeroTarjeta().substring(0, 4) + "****");
        return true; // Simulamos que siempre es exitoso
    }
    
    private boolean procesarPagoTransferencia(ConfirmarCarritoRequestDTO request) {
        // Simular procesamiento de transferencia
        // El usuario transferirá al vendedor usando los datos mostrados en el frontend
        System.out.println("Procesando pago por transferencia");
        if (request.getObservaciones() != null && !request.getObservaciones().trim().isEmpty()) {
            System.out.println("Observaciones del cliente: " + request.getObservaciones());
        }
        return true; // Simulamos que siempre es exitoso
    }
    
    private String generarResumenPago(ConfirmarCarritoRequestDTO request, double monto) {
        StringBuilder resumen = new StringBuilder();
        resumen.append("Pago procesado - ");
        resumen.append("Método: ").append(request.getMetodoPago().name()).append(" - ");
        resumen.append("Monto: $").append(String.format("%.2f", monto));
        
        switch (request.getMetodoPago()) {
            case TARJETA_CREDITO:
            case TARJETA_DEBITO:
                String ultimosDigitos = request.getNumeroTarjeta().length() >= 4 ? 
                    request.getNumeroTarjeta().substring(request.getNumeroTarjeta().length() - 4) : "****";
                resumen.append(" - Tarjeta terminada en: ").append(ultimosDigitos);
                break;
            case TRANSFERENCIA:
                if (request.getCbu() != null && !request.getCbu().isEmpty()) {
                    resumen.append(" - CBU: ").append(request.getCbu());
                } else if (request.getAlias() != null && !request.getAlias().isEmpty()) {
                    resumen.append(" - Alias: ").append(request.getAlias());
                }
                break;
        }
        
        if (request.getObservaciones() != null && !request.getObservaciones().isEmpty()) {
            resumen.append(" - Observaciones: ").append(request.getObservaciones());
        }
        
        return resumen.toString();
    }
    
    private List<ItemPedidoDTO> convertirItemsADTO(Pedido carrito) {
        List<ItemPedidoDTO> itemsDTO = new ArrayList<>();
        
        // Obtener items del carrito usando el repositorio
        Set<ItemPedido> items = itemPedidoRepository.findByPedido(carrito);
        
        System.out.println("Cantidad de items encontrados: " + items.size());
        
        for (ItemPedido item : items) {
            ItemPedidoDTO dto = new ItemPedidoDTO();
            dto.itemPedidoId = item.getItempedidoid();
            dto.itemMenuId = item.getItemMenu().getItemid();
            dto.nombre = item.getItemMenu().getNombre();
            dto.precioUnitario = item.getItemMenu().getPrecio();
            dto.cantidad = item.getCantidad();
            dto.subtotal = item.getSubtotal();
            itemsDTO.add(dto);
            
            System.out.println("Item agregado: " + dto.nombre + " - Cantidad: " + dto.cantidad);
        }
        
        return itemsDTO;
    }
    
    public ConfirmarCarritoResponseDTO obtenerResumenPago(Long pedidoId) {
        ConfirmarCarritoResponseDTO response = new ConfirmarCarritoResponseDTO();
        
        try {
            // Buscar el pedido por ID
            Pedido pedido = pedidoRepository.findById(pedidoId).orElse(null);
            
            if (pedido == null) {
                response.resultado.setStatus(404);
                response.resultado.setMensaje("Pedido no encontrado");
                return response;
            }
            
            // Verificar que el pedido pertenezca al cliente actual
            if (!pedido.getCliente().getClienteid().equals(sesion.getIdSesionActual())) {
                response.resultado.setStatus(403);
                response.resultado.setMensaje("No tienes permisos para ver este pedido");
                return response;
            }
            
            // Llenar la respuesta con los datos del pedido
            response.setVendedorId(pedido.getVendedor().getVendedorid());
            response.setVendedorNombre(pedido.getVendedor().getNombre());
            response.setVendedorCuit(pedido.getVendedor().getCuit());
            response.setVendedorCbu(pedido.getVendedor().getCbu());
            
            // Obtener items del pedido
            response.setItems(convertirItemsADTO(pedido));
            
            // Calcular subtotal
            double subtotal = response.getItems().stream().mapToDouble(item -> item.subtotal).sum();
            response.setSubtotal(subtotal);
            
            // Obtener costo de envío del pedido (ya está seteado en el pedido)
            double costoEnvio = pedido.getCostoEnvio();
            response.setCostoEnvio(costoEnvio);
            
            // Obtener información del pago para calcular recargo y método de pago
            List<Pago> pagos = pagoRepository.findByPedidoPedidoid(pedido.getPedidoid());
            if (!pagos.isEmpty()) {
                MetodoPago metodoPago = pagos.get(0).getMetodoPago();
                response.setMetodoPago(metodoPago);
                
                if (metodoPago == MetodoPago.TARJETA_CREDITO) {
                    // El recargo se aplica sobre subtotal + envío
                    double baseTotal = subtotal + costoEnvio;
                    response.setRecargo(baseTotal * 0.10); // 10% de recargo
                } else {
                    response.setRecargo(0.0);
                }
            } else {
                response.setRecargo(0.0);
            }
            
            // Total = subtotal + costo envío + recargo
            response.setTotal(subtotal + costoEnvio + response.getRecargo());
            
            // Usar el tiempo de envío del pedido (ya calculado en CarritoService)
            Integer tiempoEnvio = pedido.getTiempo_envio();
            response.setTiempoEnvio(tiempoEnvio != null ? tiempoEnvio : 30); // Por defecto 30 minutos
            
            response.setPedidoId(pedido.getPedidoid());
            
            response.resultado.setStatus(200);
            response.resultado.setMensaje("Resumen obtenido correctamente");
            
        } catch (Exception e) {
            response.resultado.setStatus(500);
            response.resultado.setMensaje("Error al obtener el resumen: " + e.getMessage());
        }
        
        return response;
    }
    
    public byte[] generarPDF(Long pedidoId) {
        try {
            // Crear documento PDF usando iText
            java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();
            com.itextpdf.kernel.pdf.PdfWriter writer = new com.itextpdf.kernel.pdf.PdfWriter(baos);
            com.itextpdf.kernel.pdf.PdfDocument pdf = new com.itextpdf.kernel.pdf.PdfDocument(writer);
            com.itextpdf.layout.Document document = new com.itextpdf.layout.Document(pdf);
            
            // Formatter para fecha y hora
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy, HH:mm");
            
            // Intentar agregar el logo y header
            try {
                // Intentar múltiples rutas posibles para el logo
                String[] logoPaths = {
                    "src/main/resources/static/logo_fixed.png",
                    "backend/src/main/resources/static/logo_fixed.png",
                    "classpath:static/logo_fixed.png"
                };
                
                com.itextpdf.layout.element.Image logo = null;
                
                // Probar diferentes rutas
                for (String path : logoPaths) {
                    try {
                        if (path.startsWith("classpath:")) {
                            // Intentar cargar desde classpath
                            java.io.InputStream logoStream = getClass().getClassLoader().getResourceAsStream("static/logo_fixed.png");
                            if (logoStream != null) {
                                byte[] logoBytes = logoStream.readAllBytes();
                                com.itextpdf.io.image.ImageData imageData = com.itextpdf.io.image.ImageDataFactory.create(logoBytes);
                                logo = new com.itextpdf.layout.element.Image(imageData);
                                logoStream.close();
                                break;
                            }
                        } else {
                            // Intentar cargar desde archivo
                            java.io.File logoFile = new java.io.File(path);
                            if (logoFile.exists()) {
                                com.itextpdf.io.image.ImageData imageData = com.itextpdf.io.image.ImageDataFactory.create(path);
                                logo = new com.itextpdf.layout.element.Image(imageData);
                                break;
                            }
                        }
                    } catch (Exception e) {
                        // Continuar probando otras rutas
                        continue;
                    }
                }
                
                if (logo != null) {
                    // Crear una tabla para el header con logo y texto
                    float[] columnWidths = {1f, 4f}; // Logo ocupa menos espacio que el texto
                    com.itextpdf.layout.element.Table headerTable = new com.itextpdf.layout.element.Table(columnWidths);
                    headerTable.setWidth(com.itextpdf.layout.properties.UnitValue.createPercentValue(100));
                    
                    // Configurar el logo
                    logo.setWidth(80);
                    logo.setHeight(80);
                    
                    // Celda del logo
                    com.itextpdf.layout.element.Cell logoCell = new com.itextpdf.layout.element.Cell();
                    logoCell.add(logo);
                    logoCell.setBorder(com.itextpdf.layout.borders.Border.NO_BORDER);
                    logoCell.setVerticalAlignment(com.itextpdf.layout.properties.VerticalAlignment.MIDDLE);
                    
                    // Celda del texto de la empresa
                    com.itextpdf.layout.element.Cell textCell = new com.itextpdf.layout.element.Cell();
                    textCell.add(new com.itextpdf.layout.element.Paragraph("SantaFood")
                            .setFontSize(48)
                            .setBold()
                            .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.LEFT));
                    textCell.setBorder(com.itextpdf.layout.borders.Border.NO_BORDER);
                    textCell.setVerticalAlignment(com.itextpdf.layout.properties.VerticalAlignment.MIDDLE);
                    
                    headerTable.addCell(logoCell);
                    headerTable.addCell(textCell);
                    
                    document.add(headerTable);
                    document.add(new com.itextpdf.layout.element.Paragraph("\n"));
                } else {
                    // Si no se puede cargar el logo, solo mostrar texto
                    document.add(new com.itextpdf.layout.element.Paragraph("SantaFood")
                            .setFontSize(48)
                            .setBold()
                            .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.LEFT));
                    
                    document.add(new com.itextpdf.layout.element.Paragraph("\n"));
                }
            } catch (Exception e) {
                // Si no se puede cargar el logo, continuar sin él
                System.out.println("No se pudo cargar el logo: " + e.getMessage());
                document.add(new com.itextpdf.layout.element.Paragraph("SantaFood")
                        .setFontSize(48)
                        .setBold()
                        .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.LEFT));
                document.add(new com.itextpdf.layout.element.Paragraph("Sistema de Delivery")
                        .setFontSize(12)
                        .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.LEFT));
                document.add(new com.itextpdf.layout.element.Paragraph("\n"));
            }
            
            // Agregar contenido al PDF
            Pedido pedido = pedidoRepository.findById(pedidoId).orElse(null);

            document.add(new com.itextpdf.layout.element.Paragraph("COMPROBANTE DE PAGO - Recibo N° " + String.format("%08d", pedidoId))
                    .setFontSize(18)
                    .setBold()
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
            document.add(new com.itextpdf.layout.element.Paragraph( pedido.getVendedor().getNombre())
                        .setFontSize(24)
                        .setBold()
                        .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
            
            // // Número de recibo (basado en el ID del pedido)
            // document.add(new com.itextpdf.layout.element.Paragraph("Recibo N° " + String.format("%08d", pedidoId))
            //         .setFontSize(14)
            //         .setBold()
            //         .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
            
            // Fecha y hora actual formateada
            String fechaHoraActual = LocalDateTime.now().format(formatter);
            document.add(new com.itextpdf.layout.element.Paragraph("Fecha: " + fechaHoraActual)
                    .setFontSize(12)
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.RIGHT));
            
            document.add(new com.itextpdf.layout.element.Paragraph("\n"));
            
                        if (pedido != null) {
                // Datos del Cliente
                document.add(new com.itextpdf.layout.element.Paragraph("DATOS DEL CLIENTE:")
                        .setFontSize(14)
                        .setBold());
                
                document.add(new com.itextpdf.layout.element.Paragraph("Nombre: " + pedido.getCliente().getNombre() + " " + pedido.getCliente().getApellido())
                        .setFontSize(12)
                        .setMarginLeft(20));
                document.add(new com.itextpdf.layout.element.Paragraph("CUIT: " + pedido.getCliente().getCuit())
                        .setFontSize(12)
                        .setMarginLeft(20));
                document.add(new com.itextpdf.layout.element.Paragraph("Email: " + pedido.getCliente().getEmail())
                        .setFontSize(12)
                        .setMarginLeft(20));
                
                document.add(new com.itextpdf.layout.element.Paragraph("\n"));
                
                // Dirección de entrega (usar dirección del cliente)
                String direccionEntrega = pedido.getCliente().getDireccion() != null ? 
                    pedido.getCliente().getDireccion() : "No especificada";
                document.add(new com.itextpdf.layout.element.Paragraph("Dirección de Entrega: " + direccionEntrega)
                        .setFontSize(12)
                        .setBold());
                
                // Información del vendedor
                // document.add(new com.itextpdf.layout.element.Paragraph("Vendedor: " + pedido.getVendedor().getNombre())
                //         .setFontSize(12));
                
                document.add(new com.itextpdf.layout.element.Paragraph("\n"));
                
                // Items del pedido
                document.add(new com.itextpdf.layout.element.Paragraph("DETALLES DEL PEDIDO:")
                        .setFontSize(14)
                        .setBold());
                
                Set<ItemPedido> items = itemPedidoRepository.findByPedido(pedido);
                double subtotal = 0;
                
                for (ItemPedido item : items) {
                    String lineaItem = item.getCantidad() + " x " + item.getItemMenu().getNombre() + 
                                     " - $" + String.format("%.2f", item.getItemMenu().getPrecio()) +
                                     " c/u = $" + String.format("%.2f", item.getSubtotal());
                    document.add(new com.itextpdf.layout.element.Paragraph(lineaItem)
                            .setFontSize(10)
                            .setMarginLeft(20));
                    subtotal += item.getSubtotal();
                }
                
                document.add(new com.itextpdf.layout.element.Paragraph("\n"));
                
                // Información de pago y costos
                List<Pago> pagos = pagoRepository.findByPedidoPedidoid(pedido.getPedidoid());
                if (!pagos.isEmpty()) {
                    Pago pago = pagos.get(0);
                    
                    document.add(new com.itextpdf.layout.element.Paragraph("DESGLOSE DE COSTOS:")
                            .setFontSize(14)
                            .setBold());
                    
                    document.add(new com.itextpdf.layout.element.Paragraph(String.format("Subtotal: $%.2f", subtotal))
                            .setFontSize(12)
                            .setMarginLeft(20));
                    
                    // Calcular costo de envío desde el servicio
                    Double costoEnvio = 0.0;
                    try {
                        if (pedido.getDistanciaEnvio() > 0) {
                            costoEnvio = envioService.calcularCostoEnvio(pedido.getDistanciaEnvio());
                        }
                    } catch (Exception e) {
                        // Si hay error calculando envío, usar valor por defecto
                        costoEnvio = 300.0;
                    }
                    
                    document.add(new com.itextpdf.layout.element.Paragraph(String.format("Costo de Envío: $%.2f", costoEnvio))
                            .setFontSize(12)
                            .setMarginLeft(20));
                    
                    // Si es tarjeta de crédito, mostrar recargo
                    String metodoPagoTexto = "";
                    if ("CREDITO".equals(pago.getMetodoPago().toString())) {
                        double recargoCredito = (subtotal + costoEnvio) * 0.05;
                        document.add(new com.itextpdf.layout.element.Paragraph(String.format("Recargo Tarjeta de Crédito (5%%): $%.2f", recargoCredito))
                                .setFontSize(12)
                                .setMarginLeft(20));
                        metodoPagoTexto = "Tarjeta de Crédito";
                    } else if ("DEBITO".equals(pago.getMetodoPago().toString())) {
                        metodoPagoTexto = "Tarjeta de Débito";
                    } else if ("EFECTIVO".equals(pago.getMetodoPago().toString())) {
                        metodoPagoTexto = "Efectivo";
                    } else if ("TRANSFERENCIA".equals(pago.getMetodoPago().toString())) {
                        metodoPagoTexto = "Transferencia Bancaria";
                    } else {
                        metodoPagoTexto = pago.getMetodoPago().toString();
                    }
                    
                    // Total final
                    document.add(new com.itextpdf.layout.element.Paragraph(String.format("TOTAL FINAL: $%.2f", pago.getMonto()))
                            .setFontSize(14)
                            .setBold()
                            .setMarginLeft(20));
                    
                    document.add(new com.itextpdf.layout.element.Paragraph("\n"));
                    
                    // Método de pago
                    document.add(new com.itextpdf.layout.element.Paragraph("Método de Pago: " + metodoPagoTexto)
                            .setFontSize(12)
                            .setBold());
                    
                    document.add(new com.itextpdf.layout.element.Paragraph("Estado del Pago: " + pago.getEstado())
                            .setFontSize(12));
                }
            } else {
                document.add(new com.itextpdf.layout.element.Paragraph("Pedido no encontrado"));
            }
            
            // Agregar footer con logo
            document.add(new com.itextpdf.layout.element.Paragraph("\n\n"));
            document.add(new com.itextpdf.layout.element.Paragraph("──────────────────────────────────────────────────────────")
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER)
                    .setFontSize(10));
            
            // Intentar agregar el logo en el footer
            try {
                String logoPath = "src/main/resources/static/Logo.png";
                java.io.File logoFile = new java.io.File(logoPath);
                if (logoFile.exists()) {
                    com.itextpdf.io.image.ImageData imageData = com.itextpdf.io.image.ImageDataFactory.create(logoPath);
                    com.itextpdf.layout.element.Image logo = new com.itextpdf.layout.element.Image(imageData);
                    logo.setWidth(30);
                    logo.setHeight(30);
                    logo.setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.LEFT);
                    document.add(logo);
                }
            } catch (Exception e) {
                // Si no se puede cargar el logo, continuar sin él
                System.out.println("No se pudo cargar el logo en el footer: " + e.getMessage());
            }
            
            document.add(new com.itextpdf.layout.element.Paragraph("SantaFood - Tu plataforma de delivery de confianza")
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.LEFT)
                    .setFontSize(10)
                    .setItalic());
            
            // Cerrar documento
            document.close();
            
            return baos.toByteArray();
            
        } catch (Exception e) {
            // En caso de error, generar un PDF simple con el mensaje de error
            try {
                java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();
                com.itextpdf.kernel.pdf.PdfWriter writer = new com.itextpdf.kernel.pdf.PdfWriter(baos);
                com.itextpdf.kernel.pdf.PdfDocument pdf = new com.itextpdf.kernel.pdf.PdfDocument(writer);
                com.itextpdf.layout.Document document = new com.itextpdf.layout.Document(pdf);
                
                document.add(new com.itextpdf.layout.element.Paragraph("Error generando PDF: " + e.getMessage()));
                document.close();
                
                return baos.toByteArray();
            } catch (Exception ex) {
                return ("Error crítico generando PDF: " + ex.getMessage()).getBytes();
            }
        }
    }

    /**
     * Guarda los datos específicos del pago según el método utilizado
     */
    private void guardarDatosEspecificosPago(Pago pago, ConfirmarCarritoRequestDTO request, double precioFinal, double recargo) {
        switch (request.getMetodoPago()) {
            case TARJETA_CREDITO:
                PagoCredito pagoCredito = new PagoCredito();
                pagoCredito.setPago(pago);
                pagoCredito.setNumeroTarjeta(request.getNumeroTarjeta());
                pagoCredito.setNombreTitular(request.getNombreTitular());
                pagoCredito.setDniTitular(request.getDniTitular());
                pagoCredito.setRecargo(recargo);
                pagoCredito.setMontoFinal(precioFinal);
                pagoCreditoRepository.save(pagoCredito);
                break;
                
            case TARJETA_DEBITO:
                PagoDebito pagoDebito = new PagoDebito();
                pagoDebito.setPago(pago);
                pagoDebito.setNumeroTarjeta(request.getNumeroTarjeta());
                pagoDebito.setNombreTitular(request.getNombreTitular());
                pagoDebito.setDniTitular(request.getDniTitular());
                pagoDebito.setMontoFinal(precioFinal);
                pagoDebitoRepository.save(pagoDebito);
                break;
                
            case TRANSFERENCIA:
                PagoTransferencia pagoTransferencia = new PagoTransferencia();
                pagoTransferencia.setPago(pago);
                pagoTransferencia.setMontoFinal(precioFinal);
                pagoTransferenciaRepository.save(pagoTransferencia);
                break;
                
            default:
                System.out.println("Método de pago no soportado: " + request.getMetodoPago());
                break;
        }
    }
}

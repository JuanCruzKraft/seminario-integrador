package com.seminario.backend.service;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.seminario.backend.dto.ItemPedidoDTO;
import com.seminario.backend.dto.request.carrito.AgregarItemRequestDTO;
import com.seminario.backend.dto.request.carrito.ConfirmarCarritoRequestDTO;
import com.seminario.backend.dto.request.carrito.CrearCarritoRequestDTO;
import com.seminario.backend.dto.request.carrito.EliminarCarritoRequestDTO;
import com.seminario.backend.dto.request.carrito.EliminarItemRequestDTO;
import com.seminario.backend.dto.request.carrito.ModificarCantidadRequestDTO;
import com.seminario.backend.dto.response.carrito.AgregarItemResponseDTO;
import com.seminario.backend.dto.response.carrito.ConfirmarCarritoResponseDTO;
import com.seminario.backend.dto.response.carrito.CrearCarritoResponseDTO;
import com.seminario.backend.dto.response.carrito.EliminarCarritoResponseDTO;
import com.seminario.backend.dto.response.carrito.EliminarItemResponseDTO;
import com.seminario.backend.dto.response.carrito.ModificarCantidadResponseDTO;
import com.seminario.backend.dto.response.carrito.VisualizarCarritoResponseDTO;
import com.seminario.backend.enums.EstadoPedido;
import com.seminario.backend.enums.MetodoPago;
import com.seminario.backend.model.Cliente;
import com.seminario.backend.model.ItemMenu;
import com.seminario.backend.model.ItemPedido;
import com.seminario.backend.model.Pedido;
import com.seminario.backend.repository.ClienteRepository;
import com.seminario.backend.repository.ItemMenuRepository;
import com.seminario.backend.repository.ItemPedidoRepository;
import com.seminario.backend.repository.PedidoRepository;
import com.seminario.backend.repository.VendedorRepository;
import com.seminario.backend.sesion.SesionMockeada;

@Service
public class CarritoService {
    private final PedidoRepository pedidoRepository;
    private final ItemMenuRepository itemMenuRepository;
    private final ItemPedidoRepository itemPedidoRepository;
    private final ClienteRepository clienteRepository;
    private final VendedorRepository vendedorRepository;
    private final SesionMockeada sesion;
    private final EnvioService envioService;
    
    public CarritoService(PedidoRepository pedidoRepository, 
                         ItemMenuRepository itemMenuRepository,
                         ItemPedidoRepository itemPedidoRepository, 
                         ClienteRepository clienteRepository,
                         VendedorRepository vendedorRepository,
                         SesionMockeada sesion,
                         EnvioService envioService) {
        this.pedidoRepository = pedidoRepository;
        this.itemMenuRepository = itemMenuRepository;
        this.itemPedidoRepository = itemPedidoRepository;
        this.clienteRepository = clienteRepository;
        this.vendedorRepository = vendedorRepository;   
        this.sesion = sesion;
        this.envioService = envioService;
    }

    public AgregarItemResponseDTO agregarItem(AgregarItemRequestDTO request) {
        AgregarItemResponseDTO response = new AgregarItemResponseDTO();
        ItemMenu item = itemMenuRepository.findById(request.itemMenuId).orElse(null);
        Pedido carrito = pedidoRepository.findByClienteClienteidAndEstado(request.clienteid, EstadoPedido.EN_CARRITO);
        if(request.cantidad > item.getStock() ) {
            // No hay stock suficiente del itemMenu
            response.resultado.setMensaje("No hay stock suficiente del itemMenu");
            response.resultado.setStatus(400);//ver que numero poner.
            return response;
        }
        if(carrito == null) { // NO hay un carrito activo->se crea uno llamando a crearCarrito
            carrito = crearCarrito(request.clienteid, item.getVendedor().getVendedorid());
            //carrito = pedidoRepository.findByClienteClienteidAndEstado(request.clienteid, EstadoPedido.EN_CARRITO);
            ItemPedido nuevoItemPedido = new ItemPedido(item, request.cantidad);
            nuevoItemPedido.setPedido(carrito);
            itemPedidoRepository.save(nuevoItemPedido);
            carrito.setSubTotal_Total(carrito.getSubTotal_Total() + (item.getPrecio() * request.cantidad));
            pedidoRepository.save(carrito); // Actualizar el carrito
            response.resultado.setMensaje("Item agregado al carrito");
            response.resultado.setStatus(0); 
            item.setStock(item.getStock() - request.cantidad);
            itemMenuRepository.save(item);
        
            
            return response;
        }
        if(carrito.getVendedor().getVendedorid() != item.getVendedor().getVendedorid()) {
            // El vendedor del carrito no coincide con el vendedor del itemMenu
            // deberia dejarle opc al cliente de crear un nuevo carrito con el vendedor correcto, eliminando el actual
            response.resultado.setMensaje("El vendedor del carrito no coincide con el vendedor del itemMenu");
            response.resultado.setStatus(1); //ver que numero poner.
            return response;
        }
        if(itemPedidoRepository.existsByPedidoAndItemMenu_Itemid(carrito, item.getItemid())) {
            // El itemMenu ya existe en el carrito, se actualiza la cantidad
            if(modificarCantidadItem(itemPedidoRepository.findByPedidoAndItemMenu_Itemid(carrito, request.itemMenuId).getItempedidoid(), request.itemMenuId ,request.cantidad)){
                response.resultado.setMensaje("Cantidad del item actualizada en el carrito");
                response.resultado.setStatus(0); 
                //itemMenuRepository.findById(request.itemMenuId).get().setStock(itemMenuRepository.findById(request.itemMenuId).get().getStock() - request.cantidad);
                //itemMenuRepository.save(itemMenuRepository.findById(request.itemMenuId).get());
            } else {
                response.resultado.setMensaje("No se pudo actualizar la cantidad del item en el carrito");
                response.resultado.setStatus(1);//ver que numero poner.
            }
            return response;
        
        } else {
            if(request.cantidad>0){
                        // camino feliz
                ItemPedido nuevoItemPedido = new ItemPedido(item, request.cantidad);
                nuevoItemPedido.setPedido(carrito);
                itemPedidoRepository.save(nuevoItemPedido);
                pedidoRepository.save(carrito); // Actualizar el carrito
                response.resultado.setMensaje("Item agregado al carrito");
                response.resultado.setStatus(0); 
                item.setStock(item.getStock() - request.cantidad);
                itemMenuRepository.save(item);

            }else{
                response.resultado.setMensaje("error");
                response.resultado.setStatus(500);//ver que numero poner.
            }
            return response;
        }
        

}

    public EliminarCarritoResponseDTO eliminarCarrito() {
        Pedido carrito = pedidoRepository.findByClienteClienteidAndEstado(sesion.getIdSesionActual(), EstadoPedido.EN_CARRITO);
        EliminarCarritoResponseDTO response = new EliminarCarritoResponseDTO();

        if (carrito != null) {
            //este for no hace falta porq los items se eliminan en cascada

            //long pedidoId = carrito.getPedidoid();
            // for (ItemPedido itemPedido : itemPedidoRepository.findByPedido(carrito)) {
            //     ItemMenu itemMenu = itemMenuRepository.findById(itemPedido.getItemMenu().getItemid()).get();
            //     itemMenu.setStock(itemMenu.getStock() + itemPedido.getCantidad());
            //     itemMenuRepository.save(itemMenu);
            //     itemPedidoRepository.delete(itemPedido);
            // }
            pedidoRepository.delete(carrito);
            response.resultado.setMensaje("Carrito eliminado");
            response.resultado.setStatus(0);
        } else {
            response.resultado.setMensaje("Carrito no encontrado");
            response.resultado.setStatus(404);
        }
        return response;
    }

    public VisualizarCarritoResponseDTO visualizarCarrito() {
        VisualizarCarritoResponseDTO response = new VisualizarCarritoResponseDTO();
        Pedido carrito = pedidoRepository.findByClienteClienteidAndEstado(sesion.getIdSesionActual(), EstadoPedido.EN_CARRITO);
        if (carrito != null) {
            Pedido pedido = new Pedido();
            Set<ItemPedido> itemsPedido = itemPedidoRepository.findByPedido(carrito);
            Double subtotalItemsPedido = 0.0;
            response.items = new ArrayList<>();
            for(ItemPedido itemPedido:itemsPedido){
                ItemPedidoDTO itemPedidoDto = new ItemPedidoDTO();
                itemPedidoDto.itemPedidoId = itemPedido.getItempedidoid();
                itemPedidoDto.itemMenuId = itemPedido.getItemMenu().getItemid();
                itemPedidoDto.nombre = itemPedido.getItemMenu().getNombre();
                itemPedidoDto.precioUnitario = itemPedido.getItemMenu().getPrecio();
                itemPedidoDto.cantidad = itemPedido.getCantidad();
                itemPedidoDto.subtotal = itemPedido.getItemMenu().getPrecio() * itemPedido.getCantidad();
                subtotalItemsPedido += itemPedidoDto.subtotal;
                response.items.add(itemPedidoDto);
            }
            response.distancia = envioService.calcularDistancia(
                carrito.getVendedor().getCoordenadas(),
                carrito.getCliente().getCoordenadas()   
            );
            response.costoEnvio = envioService.calcularCostoEnvio(response.distancia);
            response.tiempo = envioService.calcularTiempoEnvio(response.distancia);
            response.resultado.setMensaje("Carrito encontrado");
            response.resultado.setStatus(0);
            response.subtotalTotal = subtotalItemsPedido + response.costoEnvio;
            response.direccionEntrega = carrito.getCliente().getDireccion();
            pedido.setSubTotal_Total= response.subtotalTotal;

        } else {
            response.resultado.setMensaje("Carrito no encontrado");
            response.resultado.setStatus(1);
        }
        return response;
    }
    

    //Persistir datos logistico , que llame a envie service y que actualice el carrito con esos datos.

    public ModificarCantidadResponseDTO modificarCantidadItem(ModificarCantidadRequestDTO request) {
        ModificarCantidadResponseDTO response = new ModificarCantidadResponseDTO();

        try {
            ItemPedido itemPedido = itemPedidoRepository.findById(request.itemPedidoId).orElse(null);
            if (itemPedido == null) {
                response.resultado.setStatus(404);
                response.resultado.setMensaje("Item del pedido no encontrado");
                return response;
            }

            // Verificar que el item pertenece al carrito del cliente logueado
            if (!itemPedido.getPedido().getCliente().getClienteid().equals(sesion.getIdSesionActual())) {
                response.resultado.setStatus(403);
                response.resultado.setMensaje("No tienes permisos para modificar este item");
                return response;
            }

            ItemMenu itemMenu = itemMenuRepository.findById(request.itemMenuId).orElse(null);
            Pedido carrito = pedidoRepository.findById(itemPedido.getPedido().getPedidoid()).orElse(null);
            if (itemMenu == null) {
                response.resultado.setStatus(404);
                response.resultado.setMensaje("Item del menú no encontrado");
                return response;
            }

            // Calcular diferencia de cantidad
            int diferenciaStock = request.nuevaCantidad - itemPedido.getCantidad();
            
            // Verificar stock disponible si se está aumentando la cantidad
            if (diferenciaStock > 0 && itemMenu.getStock() < diferenciaStock) {
                response.resultado.setStatus(400);
                response.resultado.setMensaje("No hay stock suficiente");
                return response;
            }

            // Si la nueva cantidad es 0 o menor, eliminar el item
            if (request.nuevaCantidad <= 0) {
                carrito.setSubTotal_Total(carrito.getSubTotal_Total() - (itemPedido.getCantidad() * itemPedido.getItemMenu().getPrecio()));
                pedidoRepository.save(carrito);
                eliminarItem(itemPedido.getItempedidoid());
                response.resultado.setStatus(0);
                response.resultado.setMensaje("Item eliminado del carrito");
                return response;
            }

            // Actualizar stock del item menu
            itemMenu.setStock(itemMenu.getStock() - diferenciaStock);
            itemMenuRepository.save(itemMenu);

            // Actualizar cantidad del item pedido
            itemPedido.setCantidad(request.nuevaCantidad);
            itemPedidoRepository.save(itemPedido);
            carrito.setSubTotal_Total(carrito.getSubTotal_Total() + (diferenciaStock * itemPedido.getItemMenu().getPrecio()));
            pedidoRepository.save(carrito);

            response.resultado.setStatus(0);
            response.resultado.setMensaje("Cantidad modificada exitosamente");
            
        } catch (Exception e) {
            response.resultado.setStatus(500);
            response.resultado.setMensaje("Error interno del servidor: " + e.getMessage());
        }
        
        return response;
    }

    //ver de borrar esto si no se usa, para no tener duplicado con el de arriba
       Boolean modificarCantidadItem(Long itemPedidoId, Long itemMenuId, int cantidad) {
        ItemPedido itemPedido = itemPedidoRepository.findById(itemPedidoId).orElse(null);
        if (itemPedido == null) return false; 
        ItemMenu itemMenu = itemMenuRepository.findById(itemMenuId).get();
        Integer nuevaCantidadPedido = itemPedido.getCantidad() + cantidad;
        if(nuevaCantidadPedido <= 0 ){ // si la cantidad queda cero entonces eliminamos el item del carrit
            return eliminarItem(itemPedidoId);
        }else{
            itemMenu.setStock(itemMenu.getStock() - cantidad);
            itemMenuRepository.save(itemMenu);
            itemPedido.setCantidad(nuevaCantidadPedido);
            itemPedidoRepository.save(itemPedido);
            return true;
        }
   }

    public EliminarItemResponseDTO eliminarItem(EliminarItemRequestDTO request) {
        EliminarItemResponseDTO response = new EliminarItemResponseDTO();
        
        try {
            ItemPedido itemPedido = itemPedidoRepository.findById(request.itemPedidoId).orElse(null);
            if (itemPedido == null) {
                response.resultado.setStatus(404);
                response.resultado.setMensaje("Item del pedido no encontrado");
                return response;
            }

            // Verificar que el item pertenece al carrito del cliente logueado
            if (!itemPedido.getPedido().getCliente().getClienteid().equals(sesion.getIdSesionActual())) {
                response.resultado.setStatus(403);
                response.resultado.setMensaje("No tienes permisos para eliminar este item");
                return response;
            }

            if (eliminarItem(itemPedido.getItempedidoid())) {
                response.resultado.setStatus(0);
                response.resultado.setMensaje("Item eliminado exitosamente del carrito");
            } else {
                response.resultado.setStatus(500);
                response.resultado.setMensaje("No se pudo eliminar el item del carrito");
            }
            
        } catch (Exception e) {
            response.resultado.setStatus(500);
            response.resultado.setMensaje("Error interno del servidor: " + e.getMessage());
        }
        
        return response;
    }



   Boolean eliminarItem(Long itemPedidoId) {
        ItemPedido itemPedido = itemPedidoRepository.findById(itemPedidoId).orElse(null);
        if (itemPedido == null) return false; 
        ItemMenu itemMenu = itemMenuRepository.findById(itemPedido.getItemMenu().getItemid()).get();
        itemMenu.setStock(itemMenu.getStock() + itemPedido.getCantidad());
        itemMenuRepository.save(itemMenu);
        itemPedidoRepository.delete(itemPedido);
        return true;
   }
   
   Boolean tieneStock(Long itemMenuId, int cantidad) {
        return itemMenuRepository.findById(itemMenuId).get().getStock() >= cantidad;
    }

    Pedido crearCarrito(Long clienteId, Long vendedorId) {
        Pedido nuevoCarrito = new Pedido();
        nuevoCarrito.setCliente(clienteRepository.findById(clienteId).get());
        nuevoCarrito.setVendedor(vendedorRepository.findById(vendedorId).get());
        nuevoCarrito.setEstado(EstadoPedido.EN_CARRITO);
        nuevoCarrito.setDistanciaEnvio(envioService.calcularDistancia(nuevoCarrito.getCliente().getCoordenadas(), nuevoCarrito.getVendedor().getCoordenadas()));
        nuevoCarrito.setTiempo_envio(envioService.calcularTiempoEnvio(nuevoCarrito.getDistanciaEnvio()));
        nuevoCarrito.setCostoEnvio(envioService.calcularCostoEnvio(nuevoCarrito.getDistanciaEnvio()));
        nuevoCarrito.setSubTotal_Total(nuevoCarrito.getCostoEnvio());
        Pedido carritoGuardado = pedidoRepository.save(nuevoCarrito);
        //System.out.println("Carrito guardado con estado: " + carritoGuardado.getEstado() + " e ID: " + carritoGuardado.getPedidoid());
        
        return carritoGuardado;
    }
}
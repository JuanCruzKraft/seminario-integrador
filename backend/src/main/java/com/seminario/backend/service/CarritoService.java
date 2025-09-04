package com.seminario.backend.service;
import org.springframework.stereotype.Service;

import com.seminario.backend.dto.request.carrito.AgregarItemRequestDTO;
import com.seminario.backend.dto.request.carrito.CrearCarritoRequestDTO;
import com.seminario.backend.dto.response.carrito.AgregarItemResponseDTO;
import com.seminario.backend.dto.response.carrito.CrearCarritoResponseDTO;
import com.seminario.backend.enums.EstadoPedido;
import com.seminario.backend.model.Cliente;
import com.seminario.backend.model.ItemMenu;
import com.seminario.backend.model.ItemPedido;
import com.seminario.backend.model.Pedido;
import com.seminario.backend.repository.ClienteRepository;
import com.seminario.backend.repository.ItemMenuRepository;
import com.seminario.backend.repository.ItemPedidoRepository;
import com.seminario.backend.repository.PedidoRepository;
import com.seminario.backend.repository.VendedorRepository;

@Service
public class CarritoService {
    private final PedidoRepository pedidoRepository;
    private final ItemMenuRepository itemMenuRepository;
    private final ItemPedidoRepository itemPedidoRepository;
    private final ClienteRepository clienteRepository;
    private final VendedorRepository vendedorRepository;
    
    public CarritoService(PedidoRepository pedidoRepository, 
                         ItemMenuRepository itemMenuRepository,
                         ItemPedidoRepository itemPedidoRepository, 
                         ClienteRepository clienteRepository,
                         VendedorRepository vendedorRepository) {
        this.pedidoRepository = pedidoRepository;
        this.itemMenuRepository = itemMenuRepository;
        this.itemPedidoRepository = itemPedidoRepository;
        this.clienteRepository = clienteRepository;
        this.vendedorRepository = vendedorRepository;   
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
        return pedidoRepository.save(nuevoCarrito);
        
    }
}

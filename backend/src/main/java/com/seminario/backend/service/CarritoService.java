package com.seminario.backend.service;
import org.springframework.stereotype.Service;

import com.seminario.backend.dto.request.carrito.AgregarItemRequestDTO;
import com.seminario.backend.dto.request.carrito.CrearCarritoRequestDTO;
import com.seminario.backend.dto.request.carrito.EliminarCarritoRequestDTO;
import com.seminario.backend.dto.response.carrito.AgregarItemResponseDTO;
import com.seminario.backend.dto.response.carrito.CrearCarritoResponseDTO;
import com.seminario.backend.dto.response.carrito.EliminarCarritoResponseDTO;
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
        Pedido carrito = pedidoRepository.findByClienteClienteidAndEstado(request.clienteid, EstadoPedido.EN_CARRITO);
        if(request.cantidad > itemMenuRepository.findById(request.itemMenuId).get().getStock() ) {
            // No hay stock suficiente del itemMenu
            response.resultado.setMensaje("No hay stock suficiente del itemMenu");
            response.resultado.setStatus(400);//ver que numero poner.
            return response;
        }
        if(carrito == null) { // NO hay un carrito activo->se crea uno llamando a crearCarrito
            carrito = crearCarrito(request.clienteid, request.vendedorid);
            //carrito = pedidoRepository.findByClienteClienteidAndEstado(request.clienteid, EstadoPedido.EN_CARRITO);
            ItemPedido nuevoItemPedido = new ItemPedido(itemMenuRepository.findById(request.itemMenuId).get(), request.cantidad);
            nuevoItemPedido.setPedido(carrito);
            itemPedidoRepository.save(nuevoItemPedido);
            pedidoRepository.save(carrito); // Actualizar el carrito
            response.resultado.setMensaje("Item agregado al carrito");
            response.resultado.setStatus(200); 
            itemMenuRepository.findById(request.itemMenuId).get().setStock(itemMenuRepository.findById(request.itemMenuId).get().getStock() - request.cantidad);
            itemMenuRepository.save(itemMenuRepository.findById(request.itemMenuId).get());
            
            return response;
        }
        if(carrito.getVendedor().getVendedorid() != request.vendedorid) {
            // El vendedor del carrito no coincide con el vendedor del itemMenu
            // deberia dejarle opc al cliente de crear un nuevo carrito con el vendedor correcto, eliminando el actual
            response.resultado.setMensaje("El vendedor del carrito no coincide con el vendedor del itemMenu");
            response.resultado.setStatus(400); //ver que numero poner.
            return response;
        }
        if(itemPedidoRepository.existsByPedidoAndItemMenu_Itemid(carrito, request.itemMenuId)) {
            // El itemMenu ya existe en el carrito, se actualiza la cantidad
            if(modificarCantidadItem(itemPedidoRepository.findByPedidoAndItemMenu_Itemid(carrito, request.itemMenuId).getItempedidoid(), request.itemMenuId ,request.cantidad)){
                response.resultado.setMensaje("Cantidad del item actualizada en el carrito");
                response.resultado.setStatus(200); 
                //itemMenuRepository.findById(request.itemMenuId).get().setStock(itemMenuRepository.findById(request.itemMenuId).get().getStock() - request.cantidad);
                //itemMenuRepository.save(itemMenuRepository.findById(request.itemMenuId).get());
            } else {
                response.resultado.setMensaje("No se pudo actualizar la cantidad del item en el carrito");
                response.resultado.setStatus(500);//ver que numero poner.
            }
            return response;
        
        } else {
            if(request.cantidad>0){
                        // camino feliz
                ItemPedido nuevoItemPedido = new ItemPedido(itemMenuRepository.findById(request.itemMenuId).get(), request.cantidad);
                nuevoItemPedido.setPedido(carrito);
                itemPedidoRepository.save(nuevoItemPedido);
                pedidoRepository.save(carrito); // Actualizar el carrito
                response.resultado.setMensaje("Item agregado al carrito");
                response.resultado.setStatus(200); 
                itemMenuRepository.findById(request.itemMenuId).get().setStock(itemMenuRepository.findById(request.itemMenuId).get().getStock() - request.cantidad);
                itemMenuRepository.save(itemMenuRepository.findById(request.itemMenuId).get());

            }else{
                response.resultado.setMensaje("calmate un poco");
                response.resultado.setStatus(500);//ver que numero poner.
            }
            return response;
        }
    }

        public EliminarCarritoResponseDTO eliminarCarrito(EliminarCarritoRequestDTO request) {
        Pedido carrito = pedidoRepository.findByClienteClienteidAndEstado(request.clienteId, EstadoPedido.EN_CARRITO);
        EliminarCarritoResponseDTO response = new EliminarCarritoResponseDTO();
        //encuentro pedido del id cliente en estado "EN_CARRITO"
            //encuentro Item_pedido con "id_pedido" del anterior paso
            //De ese item_pedido saco los "Item_menu" y cantidad
            //luego en Item_menuRepository incremento el stock con la cantidad encontrada 
        if (carrito != null) {
            long pedidoId = carrito.getPedidoid();
            for (ItemPedido itemPedido : itemPedidoRepository.findByPedido(pedidoId)) {
                ItemMenu itemMenu = itemMenuRepository.findById(itemPedido.getItemMenu().getItemid()).get();
                itemMenu.setStock(itemMenu.getStock() + itemPedido.getCantidad());
                itemMenuRepository.save(itemMenu);
                itemPedidoRepository.delete(itemPedido);
            }
            pedidoRepository.delete(carrito);
            response.resultado.setMensaje("Carrito eliminado");
            response.resultado.setStatus(200);
        } else {
            response.resultado.setMensaje("Carrito no encontrado");
            response.resultado.setStatus(404);
        }
        return response;
    }





   Boolean modificarCantidadItem(Long itemPedidoId, Long itemMenuId, int cantidad) {
        ItemPedido itemPedido = itemPedidoRepository.findById(itemPedidoId).orElse(null);
        if (itemPedido == null) return false; 
        ItemMenu itemMenu = itemMenuRepository.findById(itemMenuId).get();
        Integer nuevaCantidad = itemPedido.getCantidad() + cantidad;
        if(nuevaCantidad <= 0 ){
            itemMenu.setStock(itemMenu.getStock() + itemPedido.getCantidad());
            itemPedidoRepository.delete(itemPedido); // Eliminar el item si la cantidad es 0 o menor
            itemMenuRepository.save(itemMenu);
            return true;
        }else{
            itemMenu.setStock(itemMenu.getStock() - nuevaCantidad);
            itemMenuRepository.save(itemMenu);
            itemPedido.setCantidad(nuevaCantidad);
            itemPedidoRepository.save(itemPedido);
            return true;
        }
   }


   
   Boolean tieneStock(Long itemMenuId, int cantidad) {
        return itemMenuRepository.findById(itemMenuId).get().getStock() >= cantidad;
    }




    Pedido crearCarrito(Long clienteId, Long vendedorId) {
        Pedido nuevoCarrito = new Pedido();
        nuevoCarrito.setCliente(clienteRepository.findById(clienteId).get());
        nuevoCarrito.setVendedor(vendedorRepository.findById(vendedorId).get());
        nuevoCarrito.setEstado(EstadoPedido.EN_CARRITO);
        pedidoRepository.save(nuevoCarrito);
        return nuevoCarrito;
    }
}

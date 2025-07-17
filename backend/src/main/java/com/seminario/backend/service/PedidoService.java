package com.seminario.backend.service;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.seminario.backend.dto.request.CrearPedidoRequestDTO;
import com.seminario.backend.dto.request.ItemPedidoRequestDTO;
import com.seminario.backend.dto.request.ItemPedidoRequestDTO;
import com.seminario.backend.dto.response.CrearPedidoResponseDTO;
import com.seminario.backend.dto.response.ItemPedidoResponseDTO;
import com.seminario.backend.enums.EstadoPedido;
import com.seminario.backend.model.Cliente;
import com.seminario.backend.model.ItemMenu;
import com.seminario.backend.model.ItemPedido;
import com.seminario.backend.model.Pedido;
import com.seminario.backend.model.Vendedor;
import com.seminario.backend.repository.ItemMenuRepository;
import com.seminario.backend.repository.PedidoRepository;
import com.seminario.backend.service.ClienteService;
import com.seminario.backend.service.VendedorService;
import com.seminario.backend.sesion.SesionMockeada;
@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteService clienteService;
    private final VendedorService vendedorService;
    private final SesionMockeada sesion;
    private final ItemMenuRepository itemMenuRepository;

    public PedidoService(
            PedidoRepository pedidoRepository,
            ClienteService clienteService,
            VendedorService vendedorService,
            SesionMockeada sesion,
            ItemMenuRepository itemMenuRepository) {
        this.pedidoRepository = pedidoRepository;
        this.clienteService = clienteService;
        this.vendedorService = vendedorService;
        this.sesion = sesion;
        this.itemMenuRepository = itemMenuRepository;
    }

    public Pedido crearPedido(CrearPedidoRequestDTO request) {
        // 1. Verificar sesión
        if (!sesion.estaLogueado()) {
            throw new RuntimeException("No hay sesión activa. Inicie sesión primero.");
        }

        Long clienteId = sesion.getIdSesionActual();

        // 2. Obtener cliente y vendedor
        Cliente cliente = clienteService.obtenerClientePorId(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        Vendedor vendedor = vendedorService.obtenerVendedorPorId(request.getVendedorId())
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado"));

        // 3. Crear pedido vacío
        Pedido pedido = new Pedido(vendedor, cliente);
        pedido.setPrecio(0.0);
        pedido.setEstado(EstadoPedido.EN_CARRITO);
        pedido.setListaItemPedido(new ArrayList<>());

        // 4. Crear lista de items
        List<ItemPedido> items = new ArrayList<>();
        double precioTotal = 0.0;

        for (ItemPedidoRequestDTO dto : request.getItems()) {
    ItemMenu itemMenu = itemMenuRepository.findById(dto.getItemMenuId())
            .orElseThrow(() -> new RuntimeException("Item no encontrado"));

    ItemPedido itemPedido = new ItemPedido(itemMenu, dto.getCantidad(), pedido);
    items.add(itemPedido);

    precioTotal += itemMenu.getPrecio() * dto.getCantidad();
}
        pedido.setListaItemPedido(items);
        pedido.setPrecio(precioTotal);

        return pedidoRepository.save(pedido);
    }
public CrearPedidoResponseDTO armarResponse(Pedido pedido) {
    CrearPedidoResponseDTO response = new CrearPedidoResponseDTO();

    response.setPedidoId(pedido.getPedidoid());
    response.setClienteId(pedido.getCliente().getClienteid());
    response.setVendedorId(pedido.getVendedor().getVendedorid());
    response.setPrecioTotal(pedido.getPrecio());
    response.setEstado(pedido.getEstado().toString());

    List<ItemPedidoResponseDTO> itemsResponse = new ArrayList<>();
    for (ItemPedido item : pedido.getListaItemPedido()) {
        ItemPedidoResponseDTO dto = new ItemPedidoResponseDTO();
        dto.setItemPedidoId(item.getItempedidoid());
        dto.setItemMenuId(item.getItemMenu().getItemid());
        dto.setNombreItem(item.getItemMenu().getNombre());
        dto.setCantidad(item.getCantidad());
        dto.setPrecioUnitario(item.getItemMenu().getPrecio());
        dto.setSubtotal(item.getCantidad() * item.getItemMenu().getPrecio());
        itemsResponse.add(dto);
    }
    response.setItems(itemsResponse);

    return response;
    }

}


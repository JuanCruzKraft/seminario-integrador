package com.seminario.backend.service;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.seminario.backend.dto.CategoriaDTO;
import com.seminario.backend.dto.ItemMenuDTO;
import com.seminario.backend.dto.VendedorDTO;
import com.seminario.backend.dto.request.VisualizarItemMenuRequestDTO;
import com.seminario.backend.dto.response.VisualizarItemMenuResponseDTO;
import com.seminario.backend.model.Bebida;
import com.seminario.backend.model.Categoria;
import com.seminario.backend.model.ItemMenu;
import com.seminario.backend.model.Plato;
import com.seminario.backend.model.Vendedor;
import com.seminario.backend.repository.ItemMenuRepository;
import com.seminario.backend.dto.VendedorResumenDTO; 
@Service
public class ItemMenuService {
    private final ItemMenuRepository itemMenuRepository;

    public ItemMenuService(ItemMenuRepository itemMenuRepository) {
        this.itemMenuRepository = itemMenuRepository;
    }

    public VisualizarItemMenuResponseDTO visualizarItemMenu(VisualizarItemMenuRequestDTO request) {
       VisualizarItemMenuResponseDTO response = new VisualizarItemMenuResponseDTO();
        
        try {
            List<ItemMenu> itemMenus = itemMenuRepository.findByVendedor_vendedorid(request.vendedorid);
            if (itemMenus.isEmpty()) {
                response.resultado.status = 1;
                response.resultado.mensaje ="No se encontraron items del menú.";
                return response;
            }
            for (ItemMenu itemMenu : itemMenus) {
                ItemMenuDTO itemMenuDTO = new ItemMenuDTO();
                Set<Categoria> categorias = itemMenu.getCategorias();   
                // Asegúrate de que el campo itemid en ItemMenu se mapee a itemMenuId en ItemMenuDTO
                // Si el getter en ItemMenu es getItemid() y el campo en ItemMenuDTO es itemMenuId
                itemMenuDTO.itemMenuId = itemMenu.getItemid(); 
                itemMenuDTO.nombre = itemMenu.getNombre();
                itemMenuDTO.precio = itemMenu.getPrecio();
                itemMenuDTO.descripcion = itemMenu.getDescripcion();
                itemMenuDTO.activo = itemMenu.getActivo();
                itemMenuDTO.peso = itemMenu.getPeso();
                itemMenuDTO.stock = itemMenu.getStock();
                itemMenuDTO.esBebida = itemMenu.esBebida();
                for (Categoria categoria : categorias) {
                    CategoriaDTO categoriaDTO = new CategoriaDTO();
                    categoriaDTO.id = categoria.getCategoriaid();
                    categoriaDTO.nombre = categoria.getNombre();
                    itemMenuDTO.categorias.add(categoriaDTO);
                }
                if(itemMenu instanceof Bebida bebida){
                    itemMenuDTO.tamanio = bebida.getTamanio();
                    itemMenuDTO.graduacionAlcoholica = bebida.getGraduacionAlcoholica();
                } else if (itemMenu instanceof Plato plato){
                    itemMenuDTO.calorias = plato.getCalorias();
                }

        
                response.itemMenus.add(itemMenuDTO);
            
            }
            response.resultado.status = 0;
            response.resultado.mensaje = "Items del menú obtenidos exitosamente.";
        } catch (Exception e) {
            response.resultado.status = 1;
            response.resultado.mensaje = "Error al obtener los items del menú: " + e.getMessage();
            // Para depuración, es buena práctica imprimir la traza de la excepción
            e.printStackTrace(); 
        }

        return response;
    }
}


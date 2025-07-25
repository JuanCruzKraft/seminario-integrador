package com.seminario.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.seminario.backend.model.Bebida;

public interface BebidaRepository extends JpaRepository<Bebida, Long> {

        List<Bebida> findByNombreContaining(String nombre);
        List<Bebida> findByDescripcionContaining(String descripcion);
        List<Bebida> findByVendedor_nombre(String nombre);
        List<Bebida> findByVendedor_Vendedorid(Long vendedorId);
        List<Bebida> findByPrecioGreaterThanEqual(Double precio);
        List<Bebida> findByPrecioLessThanEqual(Double precio);
        List<Bebida> findByGraduacionAlcoholicaGreaterThanEqual(Float graduacion);
        List<Bebida> findByGraduacionAlcoholicaLessThanEqual(Float graduacion); 
        List<Bebida> findBytamanioGreaterThanEqual(Float tamanio);
        List<Bebida> findBytamanioLessThanEqual(Float tamanio);
        List<Bebida> findByPesoGreaterThanEqual(Float peso);
        List<Bebida> findByPesoLessThanEqual(Float peso);
        List<Bebida> findByCategorias_nombreContaining(String nombre);

        List<Bebida> findByNombreContainingAndVendedor_Vendedorid(String nombre, Long idVendedor);
        List<Bebida> findByDescripcionContainingAndVendedor_Vendedorid(String descripcion, Long idVendedor);
        List<Bebida> findByPrecioGreaterThanEqualAndVendedor_Vendedorid(Double precio, Long idVendedor);
        List<Bebida> findByPrecioLessThanEqualAndVendedor_Vendedorid(Double precio, Long idVendedor);
        List<Bebida> findByGraduacionAlcoholicaGreaterThanEqualAndVendedor_Vendedorid(Float graduacion, Long idVendedor);
        List<Bebida> findByGraduacionAlcoholicaLessThanEqualAndVendedor_Vendedorid(Float graduacion, Long idVendedor); 
        List<Bebida> findBytamanioGreaterThanEqualAndVendedor_Vendedorid(Float tamanio, Long idVendedor);
        List<Bebida> findBytamanioLessThanEqualAndVendedor_Vendedorid(Float tamanio, Long idVendedor);
        List<Bebida> findByPesoGreaterThanEqualAndVendedor_Vendedorid(Float peso, Long idVendedor);
        List<Bebida> findByPesoLessThanEqualAndVendedor_Vendedorid(Float peso, Long idVendedor);
        List<Bebida> findByCategorias_nombreContainingAndVendedor_Vendedorid(String nombre, Long idVendedor);
        Optional<Bebida> findByItemidAndVendedor_Vendedorid(Long id, Long idVendedor);
}
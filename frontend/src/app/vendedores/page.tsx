"use client";
import { useEffect, useState } from "react";
import { getVendedores } from "../../services/vendedorService";
import { getItemMenusByVendedor } from "../../services/itemMenuService";
import { VendedorDTO } from "../../types/vendedor";
import { ItemMenuDTO } from "../../types/itemMenu";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";

export default function VendedoresPage() {
  const { isAuthenticated } = useAuth();
  const [vendedores, setVendedores] = useState<VendedorDTO[]>([]);
  const [selectedVendedor, setSelectedVendedor] = useState<VendedorDTO | null>(null);
  const [itemMenus, setItemMenus] = useState<ItemMenuDTO[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      getVendedores()
        .then(setVendedores)
        .catch(() => setError("No se pudieron cargar los vendedores."));
    }
  }, [isAuthenticated]);

  const handleVerMenu = async (vendedor: VendedorDTO) => {
    setSelectedVendedor(vendedor);
    setLoadingMenu(true);
    setError(null);
    setItemMenus([]);
    try {
  const items = await getItemMenusByVendedor(vendedor.vendedorId);
      setItemMenus(items);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.resultado?.mensaje ||
          "No se pudo cargar el menú del vendedor."
        );
      } else {
        setError("Error inesperado al cargar el menú.");
      }
    } finally {
      setLoadingMenu(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Debes iniciar sesión para ver los vendedores.</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 500, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 24 }}>Vendedores</h1>
      {error && (
        <div style={{ color: "red", marginBottom: 16 }}>
          {error}
        </div>
      )}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {vendedores.map((v) => (
          <li key={v.vendedorId} style={{ marginBottom: 16, display: "flex", alignItems: "center" }}>
            <span>
              <b>{v.nombre}</b> (ID: {v.vendedorId})
            </span>
            <button
              style={{
                marginLeft: 12,
                padding: "4px 12px",
                cursor: "pointer",
                background: "#0070f3",
                color: "#fff",
                border: "none",
                borderRadius: 4,
              }}
              onClick={() => handleVerMenu(v)}
            >
              Ver menú
            </button>
          </li>
        ))}
      </ul>
      {selectedVendedor && (
        <div style={{ marginTop: 32 }}>
          <h2>Menú de {selectedVendedor.nombre}</h2>
          {loadingMenu ? (
            <p>Cargando menú...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : itemMenus.length === 0 ? (
            <p>No hay ítems en el menú.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {itemMenus.map((item) => (
                <li
                  key={item.id}
                  style={{
                    marginBottom: 10,
                    border: "1px solid #ccc",
                    padding: 8,
                    borderRadius: 4,
                  }}
                >
                  <b>{item.nombre}</b> - ${item.precio}
                  <div>Descripción: {item.descripcion}</div>
                  <div>Stock: {item.stock}</div>
                  <div>Tipo: {item.tipo}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
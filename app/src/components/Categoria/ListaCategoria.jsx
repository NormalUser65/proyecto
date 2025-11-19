import React, { useEffect, useState } from "react";
import CategoriaService from "../../Servicios/CategoriaService";
import { ListaCartCategoria } from "./ListaCartCategoria";
import { LoadingGrid } from "../ui/custom/CargandoGrid";
import { EmptyState } from "../ui/custom/estadoVacio";
import { ErrorAlert } from "../ui/custom/AlertaError";

export function ListaCategoria() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await CategoriaService.getAll();
        console.log(JSON.stringify(response.data, null, 2));
        setData(response.data);
        if (!response.data.success) {
          setError(response.data.message);
        }
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingGrid type="grid" />;
  if (error) return <ErrorAlert title="Error al cargar categorías" message={error} />;
  if (!data?.data || data.data.length === 0)
    return <EmptyState message="No se encontraron categorías." />;

  return (
    <div className="mx-auto max-w-7xl p-6">
      <ListaCartCategoria data={data.data} />
    </div>
  );
}
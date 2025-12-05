import React, { useEffect, useState } from "react";
import AsignacionService from "../../Servicios/AsignacionService";
import { ListaCartAsignacion } from "./ListaCartAsignacion";
import { LoadingGrid } from "../ui/custom/CargandoGrid";
import { EmptyState } from "../ui/custom/estadoVacio";
import { ErrorAlert } from "../ui/custom/AlertaError";
import { useTranslation } from "react-i18next";

export function ListaAsignacion() {
  const { t } = useTranslation("listaAsignacion");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AsignacionService.getAll();
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
  if (error) return <ErrorAlert title={t("listaAsignacion.errorTitulo")} message={error} />;
  if (!data?.data || data.data.length === 0)
    return <EmptyState  message={t("listaAsignacion.emptyMessage")} />;

  return (
    <div className="mx-auto max-w-7xl p-6">
      <ListaCartAsignacion data={data.data} />
    </div>
  );
}
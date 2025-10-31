import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoriaService from "../../Servicios/CategoriaService";
import { ErrorAlert } from "../ui/custom/AlertaError";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Tag, User, Clock } from "lucide-react";
import { LoadingGrid } from "../ui/custom/CargandoGrid";
import { EmptyState } from "../ui/custom/estadoVacio";

export function DetalleCategoria() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categoria, setCategoria] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setCarga] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await CategoriaService.getDetalle(id);
        console.log(response.data);
        setCategoria(response.data);
        if (!response.data.success) {
          setError(response.data.message);
        }
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setCarga(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <LoadingGrid count={1} type="grid" />;
  if (error) return <ErrorAlert title="Error al cargar la categoría" message={error} />;
  if (!categoria || categoria.data.length === 0)
    return <EmptyState message="No se encontraron datos de esta categoría." />;

  const data = categoria.data;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold mb-6">{data.id} | {data.Categoria}</h1>
      <Card className={" rounded-2xl !shadow-[var(--box-shadow)]"} >
        <CardContent className="p-6 space-y-4">
          <div>
            <span className="font-semibold">Descripción:</span>
            <p className="text-muted-foreground">{data.Descripcion}</p>
          </div>
          <div className="flex items-center gap-4">
            <Clock className="h-5 w-5 text-secondary" />
            <span className="font-semibold">SLA:</span>
            <p className="text-muted-foreground">
              {data.SLA} ({data.Tiempo_Max_Respuesta} min resp., {data.Tiempo_Max_Resolucion} min resolución)
            </p>
          </div>
          {data.Etiquetas && (
            <div>
              <span className="font-semibold flex items-center gap-2">
                <Tag className="h-5 w-5 text-secondary" /> Etiquetas:
              </span>
              <p className="text-muted-foreground">{data.Etiquetas}</p>
            </div>
          )}
          {data.Especialidades && (
            <div>
              <span className="font-semibold flex items-center gap-2">
                <User className="h-5 w-5 text-secondary" /> Especialidades:
              </span>
              <p className="text-muted-foreground">{data.Especialidades}</p>
            </div>
          )}
        </CardContent>
      </Card>
      <Button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 bg-accent text-white hover:bg-accent/90 mt-6 !rounded-2xl"
      >
        <ArrowLeft className="w-4 h-4" />
        Regresar
      </Button>
    </div>
  );
}
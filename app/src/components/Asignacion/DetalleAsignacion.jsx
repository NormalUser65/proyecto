import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AsignacionService from "../../services/AsignacionService";
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Ticket } from "lucide-react";
import { LoadingGrid } from "../ui/custom/CargandoGrid";
import { EmptyState } from "../ui/custom/estadoVacio";

export function DetalleAsignacion() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [asignacion, setAsignacion] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setCarga] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AsignacionService.getById(id);
        console.log(response.data);
        setAsignacion(response.data);
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
  if (error) return <ErrorAlert title="Error al cargar la asignación" message={error} />;
  if (!asignacion || !asignacion.data)
    return <EmptyState message="No se encontraron datos de esta asignación." />;

  const data = asignacion.data;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold mb-6">Asignación #{data.id}</h1>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <User className="h-5 w-5 text-primary" />
            <span className="font-semibold">ID Técnico:</span>
            <p className="text-muted-foreground">{data.tecnico_id}</p>
          </div>
          <div className="flex items-center gap-4">
            <Ticket className="h-5 w-5 text-primary" />
            <span className="font-semibold">ID Ticket:</span>
            <p className="text-muted-foreground">{data.ticket_id}</p>
          </div>
        </CardContent>
      </Card>
      <Button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 bg-accent text-white hover:bg-accent/90 mt-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Regresar
      </Button>
    </div>
  );
}
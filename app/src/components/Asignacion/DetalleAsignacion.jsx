import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AsignacionService from "../../Servicios/AsignacionService";
import { ErrorAlert } from "../ui/custom/AlertaError";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Tag, User, Clock, Info } from "lucide-react";
import { LoadingGrid } from "../ui/custom/CargandoGrid";
import { EmptyState } from "../ui/custom/estadoVacio";

export function DetalleAsignacion() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [detalle, setDetalle] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setCarga] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AsignacionService.getDetalle(id);
        console.log("Respuesta backend DetalleAsignacion:", response.data);
        console.log("Objeto detalle:", response.data.data.data);

        if (!response.data.success) {
          setError(response.data.message || "Error en la respuesta");
        } else {
          setDetalle(response.data.data.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setCarga(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <LoadingGrid count={1} type="grid" />;
  if (error)
    return <ErrorAlert title="Error al cargar la asignación" message={error} />;
  if (!detalle) return <EmptyState message="No se encontró la asignación." />;

  const fechaAsignacion = detalle.hora_Asig
    ? new Date(detalle.hora_Asig).toLocaleString()
    : "No definida";

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold mb-6">
        Asignación #{detalle.asignacionId} | Ticket #{detalle.IDTicket}
      </h1>

      <Card className="rounded-2xl !shadow-[var(--box-shadow)]">
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="font-semibold flex items-center gap-2">
              <Info className="h-5 w-5 text-secondary" /> Título:
            </span>
            <p className="text-muted-foreground">{detalle.Titulo}</p>
          </div>

          <div>
            <span className="font-semibold">Descripción:</span>
            <p className="text-muted-foreground">{detalle.ticketDescripcion}</p>
          </div>

          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-secondary" />
            <span className="font-semibold">Técnico:</span>
            <p className="text-muted-foreground">
              {detalle.tecnicoNombre} ({detalle.tecnicoEmail})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-secondary" />
            <span className="font-semibold">Categoría:</span>
            <p className="text-muted-foreground">{detalle.categoriaNombre}</p>
          </div>

          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-secondary" />
            <span className="font-semibold">Prioridad:</span>
            <p className="text-muted-foreground">{detalle.prioridadNombre}</p>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-secondary" />
            <span className="font-semibold">Estado:</span>
            <p className="text-muted-foreground">{detalle.estado}</p>
          </div>

          <div>
            <span className="font-semibold">Método de asignación:</span>
            <p className="text-muted-foreground">{detalle.method}</p>
          </div>

          <div>
            <span className="font-semibold">Justificación de asignación:</span>
            <p className="text-muted-foreground">{detalle.descripcion}</p>
          </div>

          <div className="flex items-center gap-2 col-span-2">
            <Clock className="h-5 w-5 text-secondary" />
            <span className="font-semibold">Fecha asignación:</span>
            <p className="text-muted-foreground">{fechaAsignacion}</p>
          </div>
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

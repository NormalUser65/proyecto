import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TicketService from "../../services/TicketService";
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, Tag, User, AlertCircle, Timer } from "lucide-react";
import { LoadingGrid } from "../ui/custom/CargandoGrid";
import { EmptyState } from "../ui/custom/estadoVacio";

export function DetalleTicket() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setCarga] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await TicketService.getTicketById(id);
        console.log(response.data);
        setTicket(response.data);
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
  if (error) return <ErrorAlert title="Error al cargar el ticket" message={error} />;
  if (!ticket || !ticket.data)
    return <EmptyState message="No se encontraron datos de este ticket." />;

  const data = ticket.data;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold mb-6">{data.Titulo}</h1>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <span className="font-semibold">Descripción:</span>
            <p className="text-muted-foreground">{data.descripcion}</p>
          </div>
          <div className="flex items-center gap-4">
            <CalendarDays className="h-5 w-5 text-primary" />
            <span className="font-semibold">Fecha de creación:</span>
            <p className="text-muted-foreground">{new Date(data.creado_en).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-4">
            <AlertCircle className="h-5 w-5 text-primary" />
            <span className="font-semibold">Estado:</span>
            <Badge variant="outline">{data.estado}</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Tag className="h-5 w-5 text-primary" />
            <span className="font-semibold">Categoría:</span>
            <p className="text-muted-foreground">{data.IDCategoria ?? "Sin categoría"}</p>
          </div>
          <div className="flex items-center gap-4">
            <User className="h-5 w-5 text-primary" />
            <span className="font-semibold">Solicitante:</span>
            <p className="text-muted-foreground">{data.IDUsuario}</p>
          </div>
          <div className="flex items-center gap-4">
            <Timer className="h-5 w-5 text-primary" />
            <span className="font-semibold">Prioridad:</span>
            <Badge variant="secondary">Nivel {data.prioridad}</Badge>
          </div>
          <div>
            <span className="font-semibold">SLA de Respuesta:</span>
            <p className="text-muted-foreground">{data.sla_resp_deadline ?? "No definido"}</p>
            <p className="text-muted-foreground">
              Cumplimiento: {data.sla_resp_met === 1 ? "✅ Cumplido" : "❌ No cumplido"}
            </p>
          </div>
          <div>
            <span className="font-semibold">SLA de Resolución:</span>
            <p className="text-muted-foreground">{data.sla_resol_deadline ?? "No definido"}</p>
            <p className="text-muted-foreground">
              Cumplimiento: {data.sla_resol_met === 1 ? "✅ Cumplido" : "❌ No cumplido"}
            </p>
          </div>
          {data.resumen_res && (
            <div>
              <span className="font-semibold">Resumen de resolución:</span>
              <p className="text-muted-foreground">{data.resumen_res}</p>
            </div>
          )}
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

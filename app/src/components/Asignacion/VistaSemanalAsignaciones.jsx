import React, { useEffect, useState } from "react";
import AsignacionService from "../../Servicios/AsignacionService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CalendarDays, Tag, AlertCircle, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { LoadingGrid } from "../ui/custom/CargandoGrid";
import { ErrorAlert } from "../ui/custom/AlertaError";
import { EmptyState } from "../ui/custom/estadoVacio";

function obtenerDiaSemana(fecha) {
  const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  return dias[new Date(fecha).getDay()];
}

function calcularSLA(ticket) {
  if (!ticket.sla_resol_deadline) return "No definido";
  const deadline = new Date(ticket.sla_resol_deadline);
  const ahora = new Date();
  const diffMs = deadline - ahora;
  const diffHrs = Math.max(Math.floor(diffMs / (1000 * 60 * 60)), 0);
  return `${diffHrs}h`;
}

function calcularPorcentajeSLA(ticket) {
  if (!ticket.sla_resol_deadline || !ticket.creado_en) return 0;
  const inicio = new Date(ticket.creado_en);
  const fin = new Date(ticket.sla_resol_deadline);
  const ahora = new Date();
  const totalMs = fin - inicio;
  const restanteMs = fin - ahora;
  if (totalMs <= 0) return 100;
  const porcentaje = ((totalMs - restanteMs) / totalMs) * 100;
  return Math.min(Math.max(Math.floor(porcentaje), 0), 100);
}

const estadoColor = {
  pendiente: "bg-red-100 text-red-800",
  asignado: "bg-yellow-100 text-yellow-800",
  "en progreso": "bg-blue-100 text-blue-800",
  resuelto: "bg-green-100 text-green-800",
  cerrado: "bg-gray-200 text-gray-800",
};

export function VistaSemanalAsignaciones() {
  const [asignaciones, setAsignaciones] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setCarga] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AsignacionService.getAll();
        if (!response.data.success) {
          setError(response.data.message);
        } else {
          setAsignaciones(response.data.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setCarga(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingGrid type="grid" />;
  if (error) return <ErrorAlert title="Error al cargar asignaciones" message={error} />;
  if (!asignaciones || asignaciones.length === 0)
    return <EmptyState message="No hay asignaciones esta semana." />;

  const agrupadasPorDia = {};
  asignaciones.forEach((objeto) => {
    const dia = obtenerDiaSemana(objeto.creado_en);
    if (!agrupadasPorDia[dia]) agrupadasPorDia[dia] = [];
    agrupadasPorDia[dia].push(objeto);
  });

  const ordenDias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  return (
  <div className="max-w-7xl mx-auto p-6">
    <h1 className="text-3xl font-bold mb-6">Asignaciones Semanales</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {ordenDias.map((dia) => {
        const lista = agrupadasPorDia[dia];
        if (!lista) return null;

        return (
          <div key={dia}>
            <h2 className="text-xl font-semibold mb-4">{dia}</h2>
            {lista.map((objeto) => (
              <Card key={objeto.id} className="mb-4 border-l-4 border-primary shadow-sm !rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    Ticket #{objeto.IDTicket}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm text-muted-foreground">{objeto.descripcion}</div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-secondary" />
                    <Badge className={estadoColor[objeto.estado?.toLowerCase()] ?? "bg-muted"}>
                      <p className="!rounded-2xl">{objeto.estado ?? "Sin estado"}</p>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="h-4 w-4 text-secondary" />
                    <span>Categoría: {objeto.IDCategoria ?? "No definida"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4 text-secondary" />
                    <span>SLA restante: {calcularSLA(objeto)}</span>
                  </div>
                  <Progress value={calcularPorcentajeSLA(objeto)} />
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="ghost" disabled>
                      Cambiar estado
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      })}
    </div>
  </div>
);}
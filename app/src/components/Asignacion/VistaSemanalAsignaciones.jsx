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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";

function obtenerDiaSemana(fecha) {
  const dias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
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
  const { t } = useTranslation("VistaSemanalAsignaciones");
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
  if (error)
    return <ErrorAlert title="Error al cargar asignaciones" message={error} />;
  if (!asignaciones || asignaciones.length === 0)
    return <EmptyState message="No hay asignaciones esta semana." />;

  const agrupadasPorDia = {};
  asignaciones.forEach((objeto) => {
    const dia = obtenerDiaSemana(objeto.creado_en);
    if (!agrupadasPorDia[dia]) agrupadasPorDia[dia] = [];
    agrupadasPorDia[dia].push(objeto);
  });

  const ordenDias = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{t("VistaSemanalAsignaciones.titulo")}</h1>
      <p className="text-muted-foreground mb-6">
        {t("VistaSemanalAsignaciones.subtitulo")}
      </p>

      <div className="flex justify-end mb-6">
        <Button
          asChild
          className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium text-sm px-6"
        >
          <Link to="/asignaciones/gestion">{t("VistaSemanalAsignaciones.gestionar")}</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ordenDias.map((dia) => {
          const lista = agrupadasPorDia[dia];
          if (!lista) return null;

          return (
            <div key={dia} className="bg-muted/30 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                {dia}
                <Badge variant="outline">{lista.length}</Badge>
              </h2>

              {lista.map((objeto) => (
                <Card
                  key={objeto.id}
                  className="mb-4 border border-border shadow-sm rounded-2xl transition-all hover:shadow-md hover:-translate-y-1"
                >
                  <CardHeader className="flex justify-between items-center">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary-foreground" />
                      Ticket #{objeto.IDTicket}
                    </CardTitle>
                    <Badge
                      className={
                        estadoColor[objeto.estado?.toLowerCase()] ??
                        "bg-gray-500 text-white"
                      }
                    >
                      {objeto.estado ?? "Sin estado"}
                    </Badge>
                  </CardHeader>

                  <CardContent className="space-y-3 p-5">
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {objeto.descripcion}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Tag className="h-4 w-4 text-secondary" />
                      <span>
                        {t("VistaSemanalAsignaciones.categoria")} {objeto.nombreCategoria ?? "No definida"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4 text-secondary" />
                      <span>{t("VistaSemanalAsignaciones.slaRestante")} {calcularSLA(objeto)}</span>
                    </div>

                    <div className="pt-2 border-t">
                      <Progress value={calcularPorcentajeSLA(objeto)} />
                      <p className="text-xs text-muted-foreground mt-1">
                        {calcularPorcentajeSLA(objeto)}{t("VistaSemanalAsignaciones.porcentajeCompletado")}
                      </p>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                disabled={
                                  objeto.estado?.toLowerCase() === "cerrado"
                                }
                                className="rounded-full bg-primary text-white hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {objeto.estado?.toLowerCase() === "cerrado" ? (
                                  <span>{t("VistaSemanalAsignaciones.cambiarEstado")}</span>
                                ) : (
                                  <Link
                                    to={`/tickets/cambiarEstado/${objeto.IDTicket}`}>
                                    {t("VistaSemanalAsignaciones.cambiarEstado")}
                                  </Link>
                                )}
                              </Button>
                            </span>
                          </TooltipTrigger>
                          {objeto.estado?.toLowerCase() === "cerrado" && (
                            <TooltipContent>
                              {t("VistaSemanalAsignaciones.cambiarEstadoTooltip")}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>

                      <Button
                        size="sm"
                        className="rounded-full bg-primary text-white hover:bg-primary/90 font-medium text-sm px-4"
                      >
                        <Link to={`/asignaciones/detalle/${objeto.id}`}>
                          {t("VistaSemanalAsignaciones.verDetalle")}
                        </Link>
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
  );
}

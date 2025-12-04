import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TicketService from "../../Servicios/TicketService";
import { ErrorAlert } from "../ui/custom/AlertaError";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CalendarDays,
  Tag,
  User,
  AlertCircle,
  Timer,
} from "lucide-react";
import { LoadingGrid } from "../ui/custom/CargandoGrid";
import { EmptyState } from "../ui/custom/estadoVacio";
import { useTranslation } from "react-i18next";

export function DetalleTicket() {
  const { t } = useTranslation("detalleTicket");

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
  if (error)
    return (<ErrorAlert title={t("detalleTicket.errorCargar")} message={error}/>);
  if (!ticket || !ticket.data)
    return ( <EmptyState message={t("detalleTicket.noDatos")} />);

  const data = ticket.data;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold mb-6">{data.Titulo}</h1>
      <Card className="!rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <div>
            <span className="font-semibold">{t("detalleTicket.descripcion")}</span>
            <p className="text-muted-foreground">{data.descripcion}</p>
          </div>
          <div className="flex items-center gap-4">
            <CalendarDays className="h-5 w-5 text-secondary" />
            <span className="font-semibold">{t("detalleTicket.fechaCreacion")}</span>
            <p className="text-muted-foreground">
              {data.creado_en
                ? new Intl.DateTimeFormat("es-CR", {
                    dateStyle: "long",
                    timeStyle: "short",
                  }).format(new Date(data.creado_en))
                : t("detalleTicket.noDefinido")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <AlertCircle className="h-5 w-5 text-secondary" />
            <span className="font-semibold">{t("detalleTicket.estado")}</span>
            <Badge variant="outline">{data.estado}</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Tag className="h-5 w-5 text-secondary" />
            <span className="font-semibold">{t("detalleTicket.categoria")}</span>
            <p className="text-muted-foreground">
              {data.IDCategoria ?? t("detalleTicket.sinCategoria")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <User className="h-5 w-5 text-secondary" />
            <span className="font-semibold">{t("detalleTicket.solicitante")}</span>
            <p className="text-muted-foreground">{data.IDUsuario}</p>
          </div>
          <div className="flex items-center gap-4">
            <Timer className="h-5 w-5 text-secondary" />
            <span className="font-semibold">{t("detalleTicket.prioridad")}</span>
            <Badge variant="secondary">{data.prioridad_nombre}</Badge>
          </div>
          <div>
            <span className="font-semibold">{t("detalleTicket.slaRespuesta")}</span>
            <p className="text-muted-foreground">
              {data.sla_resp_deadline
                ? new Intl.DateTimeFormat("es-CR", {
                    dateStyle: "long",
                    timeStyle: "short",
                  }).format(new Date(data.sla_resp_deadline))
                : t("detalleTicket.noDefinido")}
            </p>
            <p className="text-muted-foreground">
              {t("detalleTicket.cumplimiento")}{" "}
              {data.sla_resp_met === 1 ? t("detalleTicket.cumplido") : t("detalleTicket.noCumplido")}
            </p>
          </div>
          <div>
            <span className="font-semibold">{t("detalleTicket.slaResolucion")}</span>
            <p className="text-muted-foreground">
              {data.sla_resol_deadline
                ? new Intl.DateTimeFormat("es-CR", {
                    dateStyle: "long",
                    timeStyle: "short",
                  }).format(new Date(data.sla_resol_deadline))
                : t("detalleTicket.noDefinido")}
            </p>
            <p className="text-muted-foreground">
              {t("detalleTicket.cumplimiento")}{" "}
              {data.sla_resol_met === 1
                ? t("detalleTicket.cumplido")
                : t("detalleTicket.noCumplido")}
            </p>
          </div>

          {data.resumen_res && (
            <div>
              <span className="font-semibold">
                {t("detalleTicket.resumenResolucion")}
              </span>
              <p className="text-muted-foreground">{data.resumen_res}</p>
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
        {t("detalleTicket.botonRegresar")}
      </Button>
    </div>
  );
}
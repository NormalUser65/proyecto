import { useEffect, useState } from "react";
import AsignacionService from "../../Servicios/AsignacionService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, ChartBar, Wrench, ScrollText, Clock, Inbox } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export function AsignacionAutomatica() {
  const [resultados, setResultados] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation("asignacionAutomatica");

  useEffect(() => {
    AsignacionService.asignarAutomatico()
      .then((res) => {
        const data = res.data?.data?.data || [];
        // Solo actualizamos si hay resultados
        if (data.length > 0) {
          setResultados(data);
        }
        // Guardamos mensaje si viene del backend
        if (res.data?.message) {
          setMensaje(res.data.message);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{t("titulo")}</h1>
      <p className="text-muted-foreground mb-8">
        {t("subtitulo")}
      </p>

      {resultados.length === 0 ? (
        <Card className="border border-border shadow-sm rounded-xl text-center p-10">
          <Inbox className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <CardTitle className="text-xl font-semibold text-card-foreground">
            {t("sinTicketsTitulo")}
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            {mensaje || t("sinTicketsDescripcion")}
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {resultados.map((r) => (
            <Card
              key={r.ticketId}
              className="border border-border shadow-md rounded-xl hover:shadow-lg transition-shadow"
            >
              <CardHeader className="bg-blue-900 rounded-t-xl">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                  <ScrollText className="h-5 w-5 text-muted-foreground" />
                  Ticket #{r.ticketId}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 pt-4">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-muted-foreground font-semibold">
                    <User className="h-4 w-4" /> {t("tecnico")}
                  </span>
                  <span>{r.tecnicoNombre}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-muted-foreground font-semibold">
                    <ChartBar className="h-4 w-4" /> {t("puntaje")}
                  </span>
                  <span>{r.puntaje}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-muted-foreground font-semibold">
                    <Wrench className="h-4 w-4" /> {t("especialidad")}
                  </span>
                  <Badge variant="outline">{r.especialidad}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-muted-foreground font-semibold">
                    <ScrollText className="h-4 w-4" /> {t("regla")}
                  </span>
                  <Badge variant="secondary">{r.regla}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-muted-foreground font-semibold">
                    <Clock className="h-4 w-4" /> {t("sla")}
                  </span>
                  <span
                    className={
                      r.tiempoRestante < 0
                        ? "text-red-600 font-semibold"
                        : "text-green-600 font-semibold"
                    }
                  >
                    {r.tiempoRestante < 0
                      ? `${Math.abs(r.tiempoRestante)} ${t("slaVencido")}`
                      : `${r.tiempoRestante} ${t("slaQuedan")}`}

                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{r.mensaje}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 bg-accent text-white hover:bg-accent/90 mt-8 !rounded-2xl px-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("botonRegresar")}
      </Button>
    </div>
  );
}

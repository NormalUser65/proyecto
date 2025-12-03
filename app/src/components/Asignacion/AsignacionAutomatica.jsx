import { useEffect, useState } from "react";
import AsignacionService from "../../Servicios/AsignacionService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, ChartBar, Wrench, ScrollText, Clock, Inbox } from "lucide-react";

export function AsignacionAutomatica() {
  const [resultados, setResultados] = useState([]);
  const [mensaje, setMensaje] = useState("");

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
      <h1 className="text-3xl font-bold mb-4">Asignación Automática</h1>
      <p className="text-muted-foreground mb-8">
        El sistema ha analizado los tickets pendientes y asignado técnicos
        automáticamente según SLA, prioridad, carga, especialidad y reglas de
        autotriage.
      </p>

      {resultados.length === 0 ? (
        <Card className="border border-border shadow-sm rounded-xl text-center p-10">
          <Inbox className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <CardTitle className="text-xl font-semibold text-card-foreground">
            No hay tickets pendientes para asignar
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            {mensaje || "Todos los tickets han sido procesados o asignados."}
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
                    <User className="h-4 w-4" /> Técnico:
                  </span>
                  <span>{r.tecnicoNombre}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-muted-foreground font-semibold">
                    <ChartBar className="h-4 w-4" /> Puntaje:
                  </span>
                  <span>{r.puntaje}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-muted-foreground font-semibold">
                    <Wrench className="h-4 w-4" /> Especialidad:
                  </span>
                  <Badge variant="outline">{r.especialidad}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-muted-foreground font-semibold">
                    <ScrollText className="h-4 w-4" /> Regla:
                  </span>
                  <Badge variant="secondary">{r.regla}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-muted-foreground font-semibold">
                    <Clock className="h-4 w-4" /> SLA:
                  </span>
                  <span
                    className={
                      r.tiempoRestante < 0
                        ? "text-red-600 font-semibold"
                        : "text-green-600 font-semibold"
                    }
                  >
                    {r.tiempoRestante < 0
                      ? `Vencido hace ${Math.abs(r.tiempoRestante)} min`
                      : `Quedan ${r.tiempoRestante} min`}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{r.mensaje}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

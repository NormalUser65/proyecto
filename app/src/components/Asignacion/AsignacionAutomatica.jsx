import { useEffect, useState } from "react";
import AsignacionService from "../../Servicios/AsignacionService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function AsignacionAutomatica() {
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    AsignacionService.asignarAutomatico()
      .then((res) => {
        // Aseguramos que sea un array
        const data = res.data?.data?.data || [];
        setResultados(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Asignación Automática</h1>
      <p className="text-muted-foreground mb-8">
        El sistema ha analizado los tickets pendientes y asignado técnicos
        automáticamente según SLA, prioridad, carga, especialidad y reglas de autotriage.
      </p>

      <div className="space-y-4">
        {resultados.map((r) => (
          <Card
            key={r.ticketId}
            className="border border-border shadow-sm rounded-xl"
          >
            <CardHeader>
              <CardTitle>Ticket #{r.ticketId}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Técnico asignado:</strong> {r.tecnicoId}</p>
              <p><strong>Puntaje:</strong> {r.puntaje}</p>
              <p><strong>Especialidad:</strong> {r.especialidad}</p>
              <p><strong>Regla aplicada:</strong> {r.regla}</p>
              <p><strong>Mensaje:</strong> {r.mensaje}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HistorialTicketService from "../../Servicios/HistorialTicketService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function HistorialTicket() {
  const { id } = useParams();
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await HistorialTicketService.obtenerHistorial(id);
        if (response.data.success) {
          // 🔹 acceder al array dentro de data.data
          const registros = response.data.data?.data ?? [];
          setHistorial(Array.isArray(registros) ? registros : []);
        } else {
          setHistorial([]);
        }
      } catch (err) {
        console.error("Error al cargar historial:", err);
        setHistorial([]);
      }
    };
    fetchHistorial();
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Registro Histórico del Ticket #{id}
      </h1>

      {Array.isArray(historial) && historial.length > 0 ? (
        historial.map((h, index) => (
          <Card key={`${h.id}-${index}`} className="rounded-xl shadow-md">
            <CardHeader>
              <CardTitle>
                {h.estado_anterior} → {h.estado_nuevo}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {h.Creado_el
                  ? new Date(h.Creado_el).toLocaleString()
                  : "Fecha no disponible"}{" "}
                — {h.usuario ?? "Usuario desconocido"}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {h.comentario && (
                <p className="text-sm">
                  <strong>Observación:</strong> {h.comentario}
                </p>
              )}
              {Array.isArray(h.imagenes) && h.imagenes.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {h.imagenes.map((img, i) => {
                    const url = typeof img === "string" ? img : img.url;
                    return (
                      <img
                        key={i}
                        src={url}
                        alt="Evidencia"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-muted-foreground">No hay historial disponible.</p>
      )}
    </div>
  );
}

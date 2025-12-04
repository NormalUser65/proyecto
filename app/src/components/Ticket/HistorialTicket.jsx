import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HistorialTicketService from "../../Servicios/HistorialTicketService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";


export function HistorialTicket() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await HistorialTicketService.obtenerHistorial(id);
        if (response.data.success) {
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
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-6">
      <h1 className="text-3xl font-extrabold mb-6 text-center">
        📜 Historial del Ticket #{id}
      </h1>

      {Array.isArray(historial) && historial.length > 0 ? (
        historial.map((h, index) => (
          <Card
            key={`${h.id}-${index}`}
            className="rounded-2xl shadow-lg border border-border transition-all hover:shadow-xl"
          >
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline" className="bg-muted/40">
                  {h.estado_anterior}
                </Badge>
                <span className="text-lg font-semibold">→</span>
                <Badge variant="secondary">{h.estado_nuevo}</Badge>
              </CardTitle>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-secondary" />
                  <span className="font-semibold">Fecha de modificación:</span>
                  <span>
                    {h.Creado_el
                      ? new Date(h.Creado_el).toLocaleString()
                      : "No disponible"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-secondary" />
                  <span className="font-semibold">Usuario solicitante:</span>
                  <span>{h.usuario ?? "Usuario desconocido"}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {h.comentario && (
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 text-secondary mt-1" />
                  <p className="text-sm">
                    <span className="font-semibold">Observación:</span>{" "}
                    {h.comentario}
                  </p>
                </div>
              )}

              {Array.isArray(h.imagenes) && h.imagenes.length > 0 && (
                <div>
                  <span className="font-semibold text-sm block mb-2">
                    Evidencias:
                  </span>
                  <div className="flex gap-3 flex-wrap">
                    {h.imagenes.map((img, i) => {
                      const url = typeof img === "string" ? img : img.url;
                      return (
                        <img
                          key={i}
                          src={url}
                          alt="Evidencia"
                          className="w-32 h-32 object-cover rounded-lg border hover:scale-105 transition-transform"
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-muted-foreground text-center">
          No hay historial disponible.
        </p>
      )}

      {/* Botón volver */}
      <div className="flex justify-center mt-8">
        <Button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-accent text-white hover:bg-accent/90 !rounded-2xl px-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
      </div>
    </div>
  );
}
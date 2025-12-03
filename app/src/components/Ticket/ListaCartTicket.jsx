import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Info, CalendarDays, Tag, User, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

ListaCartTicket.propTypes = {
  data: PropTypes.array,
};

export function ListaCartTicket({ data }) {
  return (
    <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((item) => (
        <Card
          key={item.id}
          className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
        >
          {/* Gradiente superior */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-primary to-secondary" />

          <CardContent className="relative flex-1 space-y-3 p-4 pt-28">
            {/* Header con título */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary-foreground shadow-inner">
                  <AlertCircle className="w-5 h-5 text-primary-foreground/90" />
                </div>
                <CardTitle className="text-lg font-semibold text-card-foreground">
                  Ticket #{item.id}
                </CardTitle>
              </div>

              {/* Botón detalle */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-primary/60 bg-primary/15 text-primary hover:bg-primary/30 transition-all"
                    >
                      <Link to={`detalleTicket/${item.id}`}>
                        <Info className="w-4 h-4 text-foreground" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Ver detalle</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        asChild
                        variant="secondary"
                        disabled={item.estado_nombre === "Pendiente"}
                        className="rounded-full bg-secondary/20 hover:bg-secondary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {item.estado_nombre === "Pendiente" ? (
                          <span>Cambiar Estado</span>
                        ) : (
                          <Link to={`cambiarEstado/${item.id}`}>
                            Cambiar Estado
                          </Link>
                        )}
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {item.estado_nombre === "Pendiente" && (
                    <TooltipContent>
                      El estado inicial "Pendiente" no puede ser modificado
                      desde aquí.
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Contenido */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">"{item.Titulo}"</p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-secondary" />
                Estado:{" "}
                <span className="text-foreground ml-1">
                  {item.estado_nombre}
                </span>
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-secondary" />
                Creado:{" "}
                <span className="text-foreground ml-1">
                  {new Date(item.creado_en).toLocaleDateString()}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

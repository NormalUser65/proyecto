import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Info, Pencil, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { AlertCircleIcon, BadgeCheckIcon, CheckIcon } from "lucide-react";

ListaCartTecnico.propTypes = {
  data: PropTypes.array,
};


export function ListaCartTecnico({ data }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL + "uploads";
  const navigate = useNavigate();

  return (
    <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {data &&
        data.map((item) => {
          const miBadge =
            item.disponibilidad === "disponible" ? (
              <Badge
                variant="secondary"
                className="bg-blue-500 text-white dark:bg-blue-600 flex items-center gap-1"
              >
                <BadgeCheckIcon className="w-4 h-4" />
                <span>{item.disponibilidad}</span>
              </Badge>
            ) : (
              <Badge variant="destructive" className="flex items-center gap-1">
                <span>{item.disponibilidad}</span>
              </Badge>
            );
              const handleUpdate = (id) => {
        navigate(`editar/${id}`);};

        
          return (
            <Card
              key={item.IDTecnico}
              className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
            >
              <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-br from-primary to-secondary" />

              <CardContent className="relative flex-1 space-y-3 p-4 pt-32">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary-foreground shadow-inner">
                      <User className="w-5 h-5 text-primary-foreground/90" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-card-foreground">
                      {item.NombreTecnico}
                    </CardTitle>
                  </div>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon"
                          className="rounded-full border-primary/60 bg-primary/15 text-primary hover:bg-primary/30 transition-all"
                          onClick={() => handleUpdate(item.IDTecnico)}
                        >
                          <Pencil className="w-4 h-4 text-foreground" />
                        </Button>
                        
                      </TooltipTrigger>
                      <TooltipContent>Editar</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Correo asociado:
                    <span className="text-foreground ml-1">{item.email}</span>
                  </p>

                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      Disponibilidad:
                    </p>
                    {miBadge}
                  </div>
                </div>

                <div className="pt-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm px-4"
                        >
                          <Link to={`detalle/${item.IDTecnico}`}>
                            Ver detalle
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Ver detalles</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}
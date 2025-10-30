import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Info, CalendarDays, Tag, User, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

ListaCartTicket.propTypes = {
  data: PropTypes.array,
};

export function ListaCartTicket({ data }) {
  return (
    <div className="grid gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((item) => (
        <Card key={item.id} className="flex flex-col overflow-hidden">
          <CardHeader className="text-secondary !rounded-2xl shadow-md">
            <CardTitle className="text-lg font-semibold">Ticket #{item.id}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-2 pt-4">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Tag className="h-4 w-4 text-secondary" />
              <span>Categoría: {item.IDCategoria ?? "Sin categoría"}</span>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-secondary" />
              <span>Estado: {item.estado}</span>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-secondary" />
              <span>Creado: {new Date(item.creado_en).toLocaleDateString()}</span>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-secondary" />
              <span>Solicitante: {item.IDUsuario}</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" className="size-8">
                    <Link to={`/tickets/detalle/${item.id}`}>
                      <Info />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Ver detalle</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

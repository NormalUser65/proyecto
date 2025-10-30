import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Clock, Globe, ShoppingCart, Info } from "lucide-react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

ListaCartTecnico.propTypes = {
  data: PropTypes.array,
};

export function ListaCartTecnico({ data }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL + "uploads";

  return (
    <div className="grid gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {data && data.map((item) => (

        //Aquí comienza a crear la Card
        <Card key={item.id} className="flex flex-col overflow-hidden">

          {/* Header */}
          <CardHeader className="text-secondary !rounded-2xl shadow-md"> {/*Quitarle el centrado*/}
            <CardTitle className="text-lg font-semibold">{item.nombre}</CardTitle>
          </CardHeader>

          {/* Contenido */}
          <CardContent className="flex-1 space-y-2 pt-4">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <p>Correo asociado: {item.email}</p>
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="h-4 w-4 text-secondary" />
              {item.lang}
            </p>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon" className="size-8"
                  >
                    <Link to={`/movie/detail/${item.id}`}>
                      <Info />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Ver detalle</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardContent>

        </Card>
        //Acá la termina de hacer
      ))}
    </div>
  );
}



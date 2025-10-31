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
        <Card key={item.IDTecnico} className="flex flex-col overflow-hidden !rounded-2xl shadow-md">

          <CardHeader className="text-secondary !rounded-2xl shadow-md">
            <CardTitle className="text-lg font-semibold">{item.NombreTecnico}</CardTitle>
          </CardHeader>

          <CardContent className="flex-1 space-y-2 pt-4">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              Correo asociado: {item.email}
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              Disponibilidad: ({item.disponibilidad})
            </p>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild className="!rounded-2xl">
                  <Button
                    size="icon" className="size-8"
                  >
                    <Link to={`detalle/${item.IDTecnico}`}>
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



import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Info, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

ListaCartCategoria.propTypes = {
  data: PropTypes.array,
};

export function ListaCartCategoria({ data }) {
  return (
    <div className="grid gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3 ">
      {data.map((item) => (
        <Card key={item.id} className="flex flex-col overflow-hidden !rounded-2xl">
          <CardHeader className="text-secondary !rounded-2xl shadow-md">
            <CardTitle className="text-lg font-semibold">{item.id} | {item.nombre}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-2 pt-4">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-secondary" />
              SLA: {item.SLA}
            </p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" className="size-8 !rounded-2xl">
                    <Link to={`/categorias/detalle/${item.id}`}>
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
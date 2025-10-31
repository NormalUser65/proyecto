import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Info, User, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

ListaCartAsignacion.propTypes = {
  data: PropTypes.array,
};

export function ListaCartAsignacion({ data }) {
  return (
    <div className="grid gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3 !rounded-2xl">
      {data.map((item) => (
        <Card key={item.id} className="flex flex-col overflow-hidden !rounded-2xl">
          <CardHeader className="text-secondary !rounded-2xl shadow-md">
            <CardTitle className="text-lg font-semibold">Asignación #{item.id}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-2 pt-4 !rounded-2xl">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-secondary" />
              <span>Técnico ID: {item.tecnico_id}</span>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Ticket className="h-4 w-4 text-secondary" />
              <span>Ticket ID: {item.ticket_id}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layers, UserCog } from "lucide-react";
import { Link } from "react-router-dom";

export function GestionAsignacion() {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Gestión de Asignaciones</h1>
      <p className="text-muted-foreground mb-8">
        Selecciona el método de asignación de tickets en estado{" "}
        <strong>Pendiente</strong>.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Opción Automática */}
        <Card className="border border-border shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" /> Asignación Automática
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              El sistema detecta automáticamente los tickets pendientes y asigna
              el técnico más adecuado según SLA, prioridad, carga de trabajo y
              especialidad.
            </p>
            <Button
              asChild
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link to="/asignaciones/auto">Ir a Asignación Automática</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Opción Manual */}
        <Card className="border border-border shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-secondary" /> Asignación Manual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              El administrador selecciona manualmente el técnico adecuado para
              cada ticket pendiente, validando especialidad y carga de trabajo.
            </p>
            <Button
              asChild
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              <Link to="/asignaciones/manual">Ir a Asignación Manual</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

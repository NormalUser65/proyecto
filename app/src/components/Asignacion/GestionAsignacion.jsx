import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layers, UserCog } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function GestionAsignacion() {
  const { t } = useTranslation("gestionAsignaciones");
  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{t("gestionAsignaciones.titulo")}</h1>
      <p className="text-muted-foreground mb-8">
        {t("gestionAsignaciones.subtitulo")}
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Opción Automática */}
        <Card className="border border-border shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" /> {t("gestionAsignaciones.auto.titulo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t("gestionAsignaciones.auto.descripcion")}
            </p>
            <Button
              asChild
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link to="/asignaciones/auto">{t("gestionAsignaciones.auto.boton")}</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Opción Manual */}
        <Card className="border border-border shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-secondary" /> {t("gestionAsignaciones.manual.titulo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t("gestionAsignaciones.auto.descripcion")}
            </p>
            <Button
              asChild
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              <Link to="/asignaciones/manual">{t("gestionAsignaciones.manual.boton")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

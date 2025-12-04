import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Layers, Clock, Info } from "lucide-react";
import AsignacionService from "../../Servicios/AsignacionService";
import UsuarioService from "../../Servicios/UsuarioService";
import { ErrorAlert } from "../ui/custom/AlertaError";
import { LoadingGrid } from "../ui/custom/CargandoGrid";
import { EmptyState } from "../ui/custom/estadoVacio";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function AsignacionManual() {
  const navigate = useNavigate();
  const [openSuccess, setOpenSuccess] = useState(false);
  const [ticketsPendientes, setTicketsPendientes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*** Validación Yup ***/
  const asignacionSchema = yup.object({
    ticketId: yup
    .number()
    .required("Debe seleccionar un ticket"),
    tecnicoId: yup
    .number()
    .required("Debe seleccionar un técnico"),
    justificacion: yup
    .string()
    .required("Debe escribir una justificación"),
    imagenes: yup
    .array()
    .of(yup.mixed())
    .optional(),
  });

  /*** React Hook Form ***/
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ticketId: "",
      tecnicoId: "",
      justificacion: "",
      imagenes: [],
    },
    resolver: yupResolver(asignacionSchema),
  });

  /*** Cargar tickets pendientes ***/
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ticketsResponse = await AsignacionService.getTicketsPendientes();
        setTicketsPendientes(ticketsResponse.data?.data?.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /*** Calcular SLA ***/
  const calcularSLA = (deadline) => {
    if (!deadline) return "No definido";
    const fin = new Date(deadline);
    const ahora = new Date();
    const diffMs = fin - ahora;
    const diffHrs = Math.max(Math.floor(diffMs / (1000 * 60 * 60)), 0);
    return `${diffHrs}h restantes`;
  };

  /*** Selección de ticket: cargar técnicos ***/
  const handleSelectTicket = async (ticketId) => {
    setValue("ticketId", ticketId);
    setValue("tecnicoId", ""); // reset técnico

    const ticket = ticketsPendientes.find((t) => t.id === ticketId);
    if (ticket && ticket.IDCategoria) {
      try {
        const response = await UsuarioService.getTecnicosPorCategoria(
          ticket.IDCategoria
        );
        const lista = response.data?.data?.data || response.data?.data || [];
        setTecnicos(Array.isArray(lista) ? lista : []);
      } catch (err) {
        setError("Error al cargar técnicos: " + err.message);
        setTecnicos([]);
      }
    } else {
      setTecnicos([]);
    }
  };

  /*** Submit ***/
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (dataForm) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("ticketId", dataForm.ticketId);
      formData.append("tecnicoId", dataForm.tecnicoId);
      formData.append("justificacion", dataForm.justificacion);

      if (dataForm.imagen) {
        formData.append("imagen", dataForm.imagen);
      }

      const response = await AsignacionService.asignarManual(formData);

      if (response.data.success) {
        setOpenSuccess(true);
        setTimeout(() => {
          setOpenSuccess(false);
          navigate("/asignaciones");
          setIsSubmitting(false);
        }, 2000);
      } else {
        setError(response.data.message || "Error en la asignación");
        setIsSubmitting(false);
      }
    } catch (err) {
      setError("Error al asignar: " + err.message);
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingGrid type="grid" />;
  if (error) return <ErrorAlert title="Error" message={error} />;
  if (!ticketsPendientes.length)
    return <EmptyState message="No hay tickets pendientes." />;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="rounded-2xl shadow-md overflow-hidden">
        <CardHeader>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" /> Asignación Manual
            de Tickets
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            Seleccione un ticket pendiente, el técnico adecuado y complete la
            justificación.
          </p>
        </CardHeader>

        <CardContent className="space-y-10">
          {/* Tickets con cards seleccionables */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Tickets Pendientes</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ticketsPendientes.map((t) => (
                <Card
                  key={t.id}
                  onClick={() => handleSelectTicket(t.id)}
                  className={`relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer ${
                    watch("ticketId") === t.id ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-primary to-secondary" />

                  {/* Check de selección */}
                  {watch("ticketId") === t.id && (
                    <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1 shadow-md">
                      ✓
                    </div>
                  )}

                  <CardContent className="relative flex-1 space-y-3 p-4 pt-28">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center shadow-inner">
                        <ClipboardList className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg font-semibold">
                        Ticket #{t.id} - {t.Titulo}
                      </CardTitle>
                    </div>

                    <div className="flex gap-2">
                      <Badge variant="outline">
                        {t.nombreCategoria ?? "No definida"}
                      </Badge>
                      <Badge
                        className={
                          t.prioridad_nombre === "Alta"
                            ? "bg-red-500 text-white"
                            : t.prioridad_nombre === "Media"
                            ? "bg-yellow-500 text-black"
                            : "bg-green-500 text-white"
                        }
                      >
                        {t.prioridad_nombre ?? "No definida"}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4 text-secondary" />
                      SLA:{" "}
                      <span className="text-foreground ml-1">
                        {calcularSLA(t.sla_resol_deadline)}
                      </span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Técnicos con cards seleccionables*/}
          {watch("ticketId") && (
            <section>
              <h2 className="text-xl font-semibold mb-4">
                Técnicos Disponibles
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tecnicos.map((tec) => (
                  <Card
                    key={tec.id}
                    onClick={() => setValue("tecnicoId", tec.id)}
                    className={`relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer ${
                      watch("tecnicoId") === tec.id
                        ? "ring-2 ring-green-500"
                        : ""
                    }`}
                  >
                    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-green-500 to-emerald-600" />

                    {watch("tecnicoId") === tec.id && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 shadow-md">
                        ✓
                      </div>
                    )}

                    <CardContent className="relative flex-1 space-y-3 p-4 pt-28">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center shadow-inner">
                          <Layers className="w-5 h-5 text-white" />
                        </div>
                        <CardTitle className="text-lg font-semibold">
                          {tec.nombre}
                        </CardTitle>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {tec.especialidades?.split(",").map((esp, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="rounded-full"
                          >
                            {esp.trim()}
                          </Badge>
                        ))}
                      </div>

                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Info className="h-4 w-4 text-secondary" />
                        Carga actual:{" "}
                        <span className="text-foreground ml-1">
                          {tec.carga}
                        </span>
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Comentario */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Justificación</h2>
            <Controller
              name="justificacion"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  placeholder="Escriba la justificación..."
                  className="rounded-lg"
                />
              )}
            />
            {errors.justificacion && (
              <p className="text-sm text-red-600 mt-1">
                {errors.justificacion.message}
              </p>
            )}
          </section>

          {/* Imagen (opcional) */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Imagen</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                name="imagenes"
                control={control}
                render={({ field }) => (
                  <Input
                    id="imagenes"
                    type="file"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      field.onChange(files);
                    }}
                    className="rounded-lg"
                  />
                )}
              />
              {watch("imagenes")?.length > 0 && (
                <ul className="mt-2 text-sm text-muted-foreground">
                  {watch("imagenes").map((file, i) => (
                    <li key={i}>{file.name}</li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Botón */}
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
          >
            {isSubmitting ? "Asignando..." : "Asignar Ticket"}
          </Button>
        </CardContent>
      </Card>

      {/* Modal de éxito */}
      <Dialog open={openSuccess} onOpenChange={setOpenSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¡Ticket asignado con éxito!</DialogTitle>
            <DialogDescription>
              El ticket fue asignado correctamente. <br />
              Serás redirigido a las asignaciones en unos segundos.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

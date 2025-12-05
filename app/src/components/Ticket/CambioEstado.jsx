import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useTranslation } from "react-i18next";

import NotificacionService from "@/Servicios/NotificacionService";


// UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

// Servicios
import HistorialTicketService from "../../Servicios/HistorialTicketService";
import UsuarioService from "../../Servicios/UsuarioService";
import TicketService from "../../Servicios/TicketService";

// Componentes reutilizables
import { CustomSelect } from "../ui/custom/custom-select";

export function CambioEstado() {
  const { t } = useTranslation("cambioEstado");
  const navigate = useNavigate();
  const { id } = useParams(); // id del ticket

  // Estados
  const [error, setError] = useState("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [usuarioResponsable, setUsuarioResponsable] = useState(null);
  const [estadoActual, setEstadoActual] = useState(null);

  // Simulación de usuario responsable
  const usuarioResponsableId = 5; // variable fija en la lógica

  /*** Validación Yup ***/
  const cambioSchema = yup.object({
    nuevoEstadoId: yup
      .number()
      .typeError("Seleccione un estado válido")
      .required("El estado es requerido"),
    comentario: yup
      .string()
      .nullable()
      .notRequired()
      .test(
        "comentario-length",
        "Debe tener al menos 5 caracteres",
        (value) => !value || value.length >= 5
      ),
    imagenes: yup.array().of(yup.mixed()).optional(),
  });

  /*** React Hook Form ***/
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nuevoEstadoId: "",
      comentario: "",
      imagenes: [],
    },
    resolver: yupResolver(cambioSchema),
  });

  /*** Flujo permitido ***/
  const flujo = {
    1: { id: 2, nombre: "Asignado" },
    2: { id: 3, nombre: "En Proceso" },
    3: { id: 4, nombre: "Resuelto" },
    4: { id: 5, nombre: "Cerrado" },
  };

  const siguienteEstado = estadoActual ? flujo[estadoActual] : null;
  const [ticketData, setTicketData] = useState(null);


  /*** Cargar datos iniciales ***/
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usuarioRes = await UsuarioService.obtenerUsuarioPorIdGeneral(
          usuarioResponsableId
        );
        if (usuarioRes.data.success) {
          setUsuarioResponsable(usuarioRes.data.data);
        }

        const ticketRes = await TicketService.getTicketById(id);
        if (ticketRes.data.success) {
          setEstadoActual(ticketRes.data.data.IDEstado);
        }
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      }
    };
    fetchData();
  }, [id]);

  /*** Submit ***/
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const onSubmit = async (dataForm) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const payload = {
        ticketId: parseInt(id),
        nuevoEstadoId: parseInt(dataForm.nuevoEstadoId),
        usuarioId: usuarioResponsableId,
        comentario: dataForm.comentario,
        imagenes: dataForm.imagenes || [],
      };

      console.log("PAYLOAD ENVIADO AL BACKEND:", payload);

      HistorialTicketService.actualizarEstado(payload);
      const response = await HistorialTicketService.actualizarEstado(payload);

      if (response.data.success) {
        //Se arma toda la notificaci]on
        await NotificacionService.crearNotificacion({
          usuarioId: usuarioResponsableId,
          ticketId: id,
          mensaje: `Un encargado cambió el estado de su ticket #${id} a ${siguienteEstado.nombre}`,
        });

        setOpenSuccess(true);

        setTimeout(() => {
          setOpenSuccess(false);
          navigate(`/tickets/historial/${id}`);
          setIsSubmitting(false);
        }, 2000);
      } else {
        setError(response.data.message);
        setIsSubmitting(false);
      }
    } catch {
      setError("Error al actualizar estado");
      setIsSubmitting(false);
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="py-12 px-4">
      <Card className="p-8 max-w-3xl mx-auto shadow-lg">
        <h2 className="text-2xl font-bold mb-8 text-center">
          {t("cambioEstado.titulo")}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Nuevo Estado */}
          <div>
            <Label className="block mb-2 font-semibold">Nuevo Estado</Label>
            <Controller
              name="nuevoEstadoId"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  field={field}
                  data={siguienteEstado ? [siguienteEstado] : []}
                  label="Estado"
                  getOptionLabel={(item) => item.nombre}
                  getOptionValue={(item) => item.id}
                />
              )}
            />
            {errors.nuevoEstadoId && (
              <p className="text-sm bg-red-100 border border-red-400 text-red-600 rounded px-2 py-1">
                {errors.nuevoEstadoId.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="comentario" className="block mb-2 font-semibold">
              {t("cambioEstado.comentarioLabel")}
            </Label>
            <Controller
              name="comentario"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="comentario"
                  placeholder="Ingrese un comentario sobre el cambio de estado (opcional)"
                />
              )}
            />
            {errors.comentario && (
              <p className="text-sm bg-red-100 border border-red-400 text-red-600 rounded px-2 py-1">
                {errors.comentario.message}
              </p>
            )}
          </div>

          {/* Imágenes */}
          <div>
            <Label htmlFor="imagenes" className="block mb-2 font-semibold">
              {t("cambioEstado.imagenLabel")}
            </Label>
            <Controller
              name="imagenes"
              control={control}
              render={({ field }) => (
                <Input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    const urls = files.map((file) => file.name); // o subir primero y usar la URL
                    field.onChange(urls);
                  }}
                />
              )}
            />
          </div>

          {/* Usuario responsable (No editable) */}
          {usuarioResponsable && (
            <div>
              <Label className="block mb-2 font-semibold">
                {t("cambioEstado.usuarioResponsableLabel")}
              </Label>
              <Input value={usuarioResponsable.nombre} disabled />
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-between gap-4 mt-8">
            <Button
              type="button"
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> {t("cambioEstado.botonRegresar")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />{" "}
              {isSubmitting ? t("cambioEstado.botonGuardando") : t("cambioEstado.botonGuardar")}
            </Button>
          </div>
        </form>
      </Card>

      {/* Modal de éxito */}
      <Dialog open={openSuccess} onOpenChange={setOpenSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("cambioEstado.modalTitulo")}</DialogTitle>
            <DialogDescription>
              {t("cambioEstado.modalDescripcion")}
              <br />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

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

// UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

// Servicios
import CategoriaService from "../../Servicios/CategoriaService";
import SLAService from "../../Servicios/SlaService";
import EtiquetaService from "../../Servicios/EtiquetaService";
import EspecialidadService from "../../Servicios/EspecialidadService";

// Componentes reutilizables
import { CustomMultiSelect } from "../ui/custom/custom-multiple-select";
import { CustomSelect } from "../ui/custom/custom-select";

export function ActualizarCategoria() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dataSLA, setDataSLA] = useState([]);
  const [dataEtiquetas, setDataEtiquetas] = useState([]);
  const [dataEspecialidades, setDataEspecialidades] = useState([]);
  const [error, setError] = useState("");

  const [openSuccess, setOpenSuccess] = useState(false);
  const [createdName, setCreatedName] = useState("");

  /*** Validación Yup ***/
  const categoriaSchema = yup.object({
    nombre: yup
      .string()
      .required("El nombre es requerido")
      .min(10, "Debe tener al menos 10 caracteres")
      .max(50, "No puede superar los 50 caracteres")
      .matches(
        /^[a-zA-ZÀ-ÿ0-9\s\-()]+$/,
        "No se permiten caracteres especiales"
      ),
    description: yup
      .string()
      .required("La descripción es requerida")
      .min(20, "Debe tener al menos 20 caracteres")
      .max(250, "No puede superar los 250 caracteres"),
    sla_id: yup
      .number()
      .typeError("Seleccione un SLA válido")
      .positive("El SLA debe ser un número positivo")
      .required("El SLA es requerido"),

    etiquetas: yup.array().min(1, "Debe seleccionar al menos una etiqueta"),
    especialidades: yup
      .array()
      .min(1, "Debe seleccionar al menos una especialidad"),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: "",
      description: "",
      sla_id: "",
      etiquetas: [],
      especialidades: [],
    },
    resolver: yupResolver(categoriaSchema),
  });

  /*** Precargar datos de la categoría y opciones ***/
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Obtener detalle de la categoría
        const response = await CategoriaService.getDetalle(id);
        if (response.data.success) {
          const cat = response.data.data;

          // 2. Cargar opciones para selects
          const slaRes = await SLAService.getAll();
          const etiquetasRes = await EtiquetaService.getAll();
          const especialidadesRes = await EspecialidadService.getAll();

          setDataSLA(slaRes.data.data || []);
          setDataEtiquetas(etiquetasRes.data.data || []);
          setDataEspecialidades(especialidadesRes.data.data || []);

          // 3. Transformar strings en arrays de IDs
          const etiquetasSeleccionadas = cat.Etiquetas
            ? cat.Etiquetas.split(",").map((e) => e.trim())
            : [];
          const especialidadesSeleccionadas = cat.Especialidades
            ? cat.Especialidades.split(",").map((e) => e.trim())
            : [];

          const etiquetasIds = (etiquetasRes.data.data || [])
            .filter((e) => etiquetasSeleccionadas.includes(e.nombre))
            .map((e) => e.id);

          const especialidadesIds = (especialidadesRes.data.data || [])
            .filter((esp) => especialidadesSeleccionadas.includes(esp.nombre))
            .map((esp) => esp.id);

          // 4. Precargar valores en el formulario
          const slaEncontrado = (slaRes.data.data || []).find(
            (sla) => sla.nombre === cat.SLA
          );
          reset({
            nombre: cat.Categoria || "",
            description: cat.Descripcion || "",
            sla_id: slaEncontrado ? slaEncontrado.id : "",
            etiquetas: etiquetasIds,
            especialidades: especialidadesIds,
          });
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      }
    };
    fetchData();
  }, [id, reset]);

  /*** Submit actualización ***/

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (dataForm) => {
    if (isSubmitting) return; // evita doble clic
    setIsSubmitting(true);

    try {
      const response = await CategoriaService.actualizarCategoria({
        id,
        ...dataForm,
      });
      if (response.data.success) {
        setCreatedName(dataForm.nombre);
        setOpenSuccess(true);

        // Mantener bloqueado hasta que termine la redirección
        setTimeout(() => {
          setOpenSuccess(false);
          navigate("/categorias");
          setIsSubmitting(false); // recién aquí se habilita
        }, 2000);
      } else {
        setError(response.data.message);
        setIsSubmitting(false); // habilitar si hubo error
      }
    } catch {
      setError("Error al actualizar categoría");
      setIsSubmitting(false); // habilitar si hubo error
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="py-12 px-4">
      <Card className="p-8 max-w-3xl mx-auto shadow-lg">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Actualizar Categoría
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Nombre */}
          <div>
            <Label htmlFor="nombre" className="block mb-2 font-semibold">
              Nombre
            </Label>
            <Controller
              name="nombre"
              control={control}
              render={({ field }) => <Input {...field} id="nombre" />}
            />
            {errors.nombre && (
              <p className="text-sm bg-red-100 border border-red-400 text-red-600 rounded px-2 py-1">
                {errors.nombre.message}
                </p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="description" className="block mb-2 font-semibold">
              Descripción
            </Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => <Input {...field} id="description" />}
            />
            {errors.description && (
              <p className="text-sm bg-red-100 border border-red-400 text-red-600 rounded px-2 py-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* SLA */}
          <div>
            <Controller
              name="sla_id"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  field={field}
                  data={dataSLA}
                  label="SLA"
                  getOptionLabel={(sla) =>
                    `${sla.nombre} (${sla.max_resp_minutos} min resp., ${sla.max_resol_minutos} min resolución)`
                  }
                  getOptionValue={(sla) => sla.id}
                />
              )}
            />
            {errors.sla_id && (
              <p className="text-sm bg-red-100 border border-red-400 text-red-600 rounded px-2 py-1">
                {errors.sla_id.message}
                </p>
            )}
          </div>

          {/* Etiquetas */}
          <div>
            <Controller
              name="etiquetas"
              control={control}
              render={({ field }) => (
                <CustomMultiSelect
                  field={field}
                  data={dataEtiquetas}
                  label="Etiquetas"
                  getOptionLabel={(item) => item.nombre}
                  getOptionValue={(item) => item.id}
                />
              )}
            />
            {errors.etiquetas && (
              <p className="text-sm bg-red-100 border border-red-400 text-red-600 rounded px-2 py-1">
                {errors.etiquetas.message}
                </p>
            )}
          </div>

          {/* Especialidades */}
          <div>
            <Controller
              name="especialidades"
              control={control}
              render={({ field }) => (
                <CustomMultiSelect
                  field={field}
                  data={dataEspecialidades}
                  label="Especialidades"
                  getOptionLabel={(item) => item.nombre}
                  getOptionValue={(item) => item.id}
                />
              )}
            />
            {errors.especialidades && (
              <p className="text-sm bg-red-100 border border-red-400 text-red-600 rounded px-2 py-1">
                {errors.especialidades.message}
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-between gap-4 mt-8">
            <Button
              type="button"
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Regresar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2">
              <Save className="w-4 h-4" />{" "}
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Modal de éxito */}
      <Dialog open={openSuccess} onOpenChange={setOpenSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¡Categoría actualizada con éxito!</DialogTitle>
            <DialogDescription>
              Se actualizó la categoría <strong>{createdName}</strong>. Serás
              redirigido al listado en unos segundos.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

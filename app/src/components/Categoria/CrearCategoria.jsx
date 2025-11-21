import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

//Encargado/a de realizar esta parte: Fabricio Arias Zamora

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

import CategoriaService from "../../Servicios/CategoriaService";
import SLAService from "../../Servicios/SlaService";
import EtiquetaService from "../../Servicios/EtiquetaService";
import EspecialidadService from "../../Servicios/EspecialidadService";

import { CustomMultiSelect } from "../ui/custom/custom-multiple-select";
import { CustomSelect } from "../ui/custom/custom-select";

export function CrearCategoria() {
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

  /*** React Hook Form ***/
  const {
    control,
    handleSubmit,
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

  /*** Cargar datos iniciales ***/
  useEffect(() => {
    const fetchData = async () => {
      try {
        const slaRes = await SLAService.getAll();
        const etiquetasRes = await EtiquetaService.getAll();
        const especialidadesRes = await EspecialidadService.getAll();

        setDataSLA(slaRes.data.data || []);
        setDataEtiquetas(etiquetasRes.data.data || []);
        setDataEspecialidades(especialidadesRes.data.data || []);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      }
    };
    fetchData();
  }, []);

  // Submit
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (dataForm) => {
    if (isSubmitting) return; // protección extra
    setIsSubmitting(true);

    try {
      const response = await CategoriaService.crearCategoria(dataForm);
      if (response.data.success) {
        setCreatedName(response.data.data.nombre);
        setOpenSuccess(true);

        setTimeout(() => {
          setOpenSuccess(false);
          navigate("/categorias");
          setIsSubmitting(false); 
        }, 2000);
      } else {
        setError(response.data.message);
        setIsSubmitting(false); 
      }
    } catch {
      setError("Error al crear categoría");
      setIsSubmitting(false); 
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="py-12 px-4">
      <Card className="p-8 max-w-3xl mx-auto shadow-lg">
        <h2 className="text-2xl font-bold mb-8 text-center">Crear Categoría</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Nombre */}
          <div>
            <Label htmlFor="nombre" className="block mb-2 font-semibold">
              Nombre
            </Label>
            <Controller
              name="nombre"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="nombre"
                  placeholder="Ingrese el nombre de la categoría"
                />
              )}
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
              render={({ field }) => (
                <Input
                  {...field}
                  id="description"
                  placeholder="Descripción de la categoría"
                />
              )}
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

          <div>
            {/* Etiquetas */}
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
                  placeholder="Seleccione etiquetas"
                />
              )}
            />
            {errors.etiquetas && (
              <p className="text-sm bg-red-100 border border-red-400 text-red-600 rounded px-2 py-1">
                {errors.etiquetas.message}
              </p>
            )}
          </div>

          <div>
            {/* Especialidades */}
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
                  placeholder="Seleccione especialidades"
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
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </Card>

      <Dialog open={openSuccess} onOpenChange={setOpenSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¡Categoría creada con éxito!</DialogTitle>
            <DialogDescription>
              Se creó la categoría <strong>{createdName}</strong>. Serás
              redirigido al listado en unos segundos.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";

// UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

// Servicios
import TicketService from "../../Servicios/TicketService";
import CategoriaService from "../../Servicios/CategoriaService";
import EtiquetaService from "../../Servicios/EtiquetaService";
import PrioridadService from "../../Servicios/PrioridadService"; // listado predefinido

// Componentes reutilizables
import { CustomSelect } from "../ui/custom/custom-select";

export function CrearTicket() {
  const navigate = useNavigate();

  // Estados para selects
  const [dataPrioridades, setDataPrioridades] = useState([]);
  const [dataEtiquetas, setDataEtiquetas] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [error, setError] = useState("");

  // Simulación de usuario solicitante (hasta que exista autenticación)
  const usuarioSolicitanteId = 5; // variable fija en la lógica

  /*** Validación Yup ***/
  const ticketSchema = yup.object({
    Titulo: yup
      .string()
      .required("El título es requerido")
      .min(10, "Debe tener al menos 10 caracteres")
      .max(255, "No puede superar los 255 caracteres"),
    descripcion: yup
      .string()
      .required("La descripción es requerida")
      .min(20, "Debe tener al menos 20 caracteres"),
    prioridad: yup
      .number()
      .typeError("Seleccione una prioridad válida")
      .required("La prioridad es requerida"),
    IDCategoria: yup
      .number()
      .typeError("Seleccione una categoría válida")
      .required("La categoría es requerida"),
    IDEtiqueta: yup
      .number()
      .typeError("Seleccione una etiqueta válida")
      .required("La etiqueta es requerida"),
  });

  /*** React Hook Form ***/
  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      Titulo: "",
      descripcion: "",
      prioridad: "",
      IDCategoria: "",
      IDEtiqueta: ""
    },
    resolver: yupResolver(ticketSchema)
  });

  /*** Cargar datos iniciales ***/
  useEffect(() => {
  const fetchData = async () => {
    try {
      const prioridadesRes = await PrioridadService.getAll();
      const prioridadesData = prioridadesRes?.data?.data?.data ?? [];
      setDataPrioridades(Array.isArray(prioridadesData) ? prioridadesData : []);

      const etiquetasRes = await EtiquetaService.getAll();
      const etiquetasData = etiquetasRes?.data?.data ?? [];
      setDataEtiquetas(Array.isArray(etiquetasData) ? etiquetasData : []);
    } catch (err) {
      if (err.name !== "AbortError") setError(err.message);
    }
  };
  fetchData();
}, []);



  /*** Manejo de selección de etiqueta → categoría asociada ***/
  const handleEtiquetaChange = async (etiquetaId) => {
    setValue("IDEtiqueta", etiquetaId);
      const categoriaRes = await CategoriaService.getByEtiqueta(etiquetaId);
if (categoriaRes.data.success) {
  const categorias = categoriaRes.data.data?.data ?? [];
  if (Array.isArray(categorias) && categorias.length > 0) {
    const categoria = categorias[0]; // por ahora tomamos la primera
    setCategoriaSeleccionada(categoria);
    setValue("IDCategoria", categoria.id);
  } else {
    setError("No se encontraron categorías asociadas");
  }
}

  };

  /*** Submit ***/
  const onSubmit = async (dataForm) => {
    try {
      const payload = {
        ...dataForm,
        IDUsuario: usuarioSolicitanteId,
        IDPrioridad: dataForm.prioridad // aseguramos que se envíe como IDPrioridad
      };
      const response = await TicketService.createTicket(payload);
      if (response.data.success) {
        toast.success(`Ticket creado: ${response.data.data.Titulo}`, {
          duration: 4000,
          position: "top-center",
        });
        setTimeout(() => {
          navigate("/tickets");
        }, 2000);
      } else {
        setError(response.data.message);
      }
    } catch {
      setError("Error al crear ticket");
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="py-12 px-4">
      <Card className="p-8 max-w-3xl mx-auto shadow-lg">
        <h2 className="text-2xl font-bold mb-8 text-center">Crear Ticket</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Título */}
          <div>
            <Label htmlFor="Titulo" className="block mb-2 font-semibold">Título</Label>
            <Controller name="Titulo" control={control} render={({ field }) =>
              <Input {...field} id="Titulo" placeholder="Ingrese el título del ticket" />
            } />
            {errors.Titulo && <p className="text-sm text-red-500">{errors.Titulo.message}</p>}
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="descripcion" className="block mb-2 font-semibold">Descripción</Label>
            <Controller name="descripcion" control={control} render={({ field }) =>
              <Input {...field} id="descripcion" placeholder="Descripción del ticket" />
            } />
            {errors.descripcion && <p className="text-sm text-red-500">{errors.descripcion.message}</p>}
          </div>

          {/* Prioridad */}
          <div>
            <Controller name="prioridad" control={control} render={({ field }) =>
              <CustomSelect
                field={field}
                data={dataPrioridades || []}
                label="Prioridad"
                getOptionLabel={(item) => item.nombre}
                getOptionValue={(item) => item.id}
              />
            } />
            {errors.prioridad && <p className="text-sm text-red-500">{errors.prioridad.message}</p>}
          </div>

          {/* Etiqueta → Categoría asociada */}
          <div>
            <Label className="block mb-2 font-semibold">Etiqueta</Label>
            <CustomSelect
              field={{ value: "", onChange: handleEtiquetaChange }}
              data={dataEtiquetas || []}
              label="Etiqueta"
              getOptionLabel={(item) => item.nombre}
              getOptionValue={(item) => item.id}
            />
            {errors.IDEtiqueta && <p className="text-sm text-red-500">{errors.IDEtiqueta.message}</p>}
          </div>

          {/* Categoría asociada (informativa, no editable) */}
          {categoriaSeleccionada && (
            <div>
              <Label className="block mb-2 font-semibold">Categoría asociada</Label>
              <Input value={categoriaSeleccionada.nombre} disabled />
            </div>
          )}

          {/* Usuario solicitante (informativo, no editable) */}
          <div>
            <Label className="block mb-2 font-semibold">Usuario solicitante</Label>
            <Input value={usuarioSolicitanteId} disabled />
          </div>

          {/* Estado inicial (informativo, no editable) */}
          <div>
            <Label className="block mb-2 font-semibold">Estado inicial</Label>
            <Input value="pendiente" disabled />
          </div>

          {/* Botones */}
          <div className="flex justify-between gap-4 mt-8">
            <Button type="button" onClick={() => navigate(-1)} variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Regresar
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Save className="w-4 h-4" /> Guardar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
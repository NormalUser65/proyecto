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

// UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

// Servicios
import TicketService from "../../Servicios/TicketService";
import CategoriaService from "../../Servicios/CategoriaService";
import EtiquetaService from "../../Servicios/EtiquetaService";
import PrioridadService from "../../Servicios/PrioridadService";
import UsuarioService from "../../Servicios/UsuarioService";

// Componentes reutilizables
import { CustomSelect } from "../ui/custom/custom-select";

export function CrearTicket() {
  const navigate = useNavigate();

  // Estados para selects
  const [dataPrioridades, setDataPrioridades] = useState([]);
  const [dataEtiquetas, setDataEtiquetas] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [error, setError] = useState("");

  const [openSuccess, setOpenSuccess] = useState(false);
  const [createdName, setCreatedName] = useState("");

  const [, setSlaRespDeadline] = useState("");
  const [, setSlaResolDeadline] = useState("");

  // Simulación de usuario solicitante.
  const usuarioSolicitanteId = 5; // variable fija en la lógica
  const [usuarioSolicitante, setUsuarioSolicitante] = useState(null);

  /*** Validación Yup ***/
  const ticketSchema = yup.object({
    Titulo: yup
      .string()
      .required("El título es requerido")
      .min(10, "Debe tener al menos 10 caracteres")
      .max(250, "No puede superar los 250 caracteres"),
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
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      Titulo: "",
      descripcion: "",
      prioridad: "",
      IDCategoria: "",
      IDEtiqueta: "",
    },
    resolver: yupResolver(ticketSchema),
  });

  /*** Cargar datos iniciales ***/
  useEffect(() => {
    const fetchData = async () => {
      try {
        const prioridadesRes = await PrioridadService.getAll();
        const prioridadesData = prioridadesRes?.data?.data?.data ?? [];
        setDataPrioridades(
          Array.isArray(prioridadesData) ? prioridadesData : []
        );

        const etiquetasRes = await EtiquetaService.getAll();
        const etiquetasData = etiquetasRes?.data?.data ?? [];
        setDataEtiquetas(Array.isArray(etiquetasData) ? etiquetasData : []);
        const usuarioRes = await UsuarioService.obtenerUsuarioPorIdGeneral(
          usuarioSolicitanteId
        );
        if (usuarioRes.data.success) {
          setUsuarioSolicitante(usuarioRes.data.data);
        }
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (dataForm) => {
    if (isSubmitting) return; // evita doble clic
    setIsSubmitting(true);

    try {
      const payload = {
        ...dataForm,
        IDUsuario: usuarioSolicitanteId,
        IDPrioridad: dataForm.prioridad,
      };
      const response = await TicketService.createTicket(payload);

      if (response.data.success) {
        const ticket = response.data.data;
        setCreatedName(ticket.Titulo);
        setSlaRespDeadline(ticket.sla_resp_deadline);
        setSlaResolDeadline(ticket.sla_resol_deadline);
        setOpenSuccess(true);

        // Mantener bloqueado hasta que termine la redirección
        setTimeout(() => {
          setOpenSuccess(false);
          navigate("/tickets");
          setIsSubmitting(false); // recién aquí se habilita
        }, 2000);
      } else {
        setError(response.data.message);
        setIsSubmitting(false); // habilitar si hubo error
      }
    } catch {
      setError("Error al crear ticket");
      setIsSubmitting(false); // habilitar si hubo error
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
            <Label htmlFor="Titulo" className="block mb-2 font-semibold">
              Título
            </Label>
            <Controller
              name="Titulo"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="Titulo"
                  placeholder="Ingrese el título del ticket"
                />
              )}
            />
            {errors.Titulo && (
              <p className="text-sm bg-red-100 border border-red-400 text-red-600 rounded px-2 py-1">
                {errors.Titulo.message}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="descripcion" className="block mb-2 font-semibold">
              Descripción
            </Label>
            <Controller
              name="descripcion"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="descripcion"
                  placeholder="Descripción del ticket"
                />
              )}
            />
            {errors.descripcion && (
              <p className="text-sm bg-red-100 border border-red-400 text-red-600 rounded px-2 py-1">
                {errors.descripcion.message}
              </p>
            )}
          </div>

          {/* Prioridad */}
          <div>
            <Label className="block mb-2 font-semibold">Prioridad</Label>
            <Controller
              name="prioridad"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  field={field}
                  data={dataPrioridades || []}
                  label="Prioridad"
                  getOptionLabel={(item) => item.nombre}
                  getOptionValue={(item) => item.id}
                />
              )}
            />
            {errors.prioridad && (
              <p className="text-sm bg-red-100 border border-red-400 text-red-600 rounded px-2 py-1">
                {errors.prioridad.message}
              </p>
            )}
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
            {errors.IDEtiqueta && (
              <p className="text-sm bg-red-100 border border-red-400 text-red-600 rounded px-2 py-1">
                {errors.IDEtiqueta.message}
              </p>
            )}
          </div>

          {/* Categoría asociada (No editable) */}
          {categoriaSeleccionada && (
            <div>
              <Label className="block mb-2 font-semibold">
                Categoría asociada
              </Label>
              <Input value={categoriaSeleccionada.nombre} disabled />
            </div>
          )}

          {/* Usuario solicitante (No editable) */}
          <div>
            <Label className="block mb-2 font-semibold">Id usuario</Label>
            <Input value={usuarioSolicitanteId} disabled />
          </div>

          {/* Nombre del solicitante (No editable) */}
          {usuarioSolicitante && (
            <div>
              <Label className="block mb-2 font-semibold">
                Nombre del usuario
              </Label>
              <Input value={usuarioSolicitante.nombre} disabled />
            </div>
          )}

          {/* Correo del solicitante (No editable) */}
          {usuarioSolicitante && (
            <div>
              <Label className="block mb-2 font-semibold">
                Correo electrónico
              </Label>
              <Input value={usuarioSolicitante.email} disabled />
            </div>
          )}

          {/* Estado inicial (No ditable) */}
          <div>
            <Label className="block mb-2 font-semibold">Estado inicial</Label>
            <Input value="pendiente" disabled />
          </div>

          {/* Botones */}
          <div className="flex justify-between gap-4 mt-8">
            <Button
              type="button"
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Regresar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />{" "}
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Modal de éxito */}
      <Dialog open={openSuccess} onOpenChange={setOpenSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¡Ticket creado con éxito!</DialogTitle>
            <DialogDescription>
              Se creó el ticket <strong>{createdName}</strong>. <br />
              Serás redirigido al listado en unos segundos.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

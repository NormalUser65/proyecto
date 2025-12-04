import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

//Encargado/a de realizar esta parte: Ana Paula Fernández Alfaro

//Validator
import validator from "validator";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// icons
import { Save, ArrowLeft } from "lucide-react";

// servicios
import EspecialidadService from "@/Servicios/EspecialidadService";
import UsuarioService from "@/Servicios/UsuarioService";

// componentes reutilizables
import { CustomMultiSelect } from "../ui/custom/custom-multiple-select"; // select multi con chips
import { CustomSelect } from "../ui/custom/custom-select";
import { CustomInputField } from "../ui/custom/custom-input-field";

export function ActualizarTecnico() {
  const navigate = useNavigate();
  const { t } = useTranslation("actualizarTecnico");
  //Obtener parámetro del id de la película
  const { id } = useParams();
  const BASE_URL_image = import.meta.env.VITE_BASE_URL + "uploads";

  /*** Estados para selects y preview de imagen ***/
  const [datosTecnico, SetearDataTecnico] = useState([]);
  const [datosEspecialidades, SetearEspecialidades] = useState([]);

  const [openSuccess, setOpenSuccess] = useState(false);
  const [createdName, setCreatedName] = useState("");

  const [error, setError] = useState("");

  /*** Esquema de validación Yup ***/
  const TecnicoEsquema = yup.object({
    NombreTecnico: yup
      .string()
      .required(t("actualizarTecnico.errores.nombre_requerido"))
      .min(2, "El nombre debe tener al menos 2 caracteres"),

    email: yup
      .string()
      .required("El correo es requerido")
      .test(
        "email-validator",
        "Por favor, introduce un correo electrónico válido",
        (dato) => {
          //validator
          if (!dato) return true;
          return validator.isEmail(dato);
        }
      )
      .test("validar-email", "Este email ya fue registrado", async (dato) => {
        if (!dato) return true;
        try {
          const correo = await UsuarioService.ValEmail(dato);
          const exists = correo.data?.data?.exists;
          return !exists;
        } catch (error) {
          console.log(error);
          return true;
        }
      }),
    Contrasenna: yup
      .string()
      .required(t("actualizarTecnico.errores.contrasenna_requerida"))
      .min(8, t("actualizarTecnico.errores.contrasenna_min"))
      .matches(/[a-z]/, t("actualizarTecnico.errores.contrasenna_minuscula"))
      .matches(/[A-Z]/, t("actualizarTecnico.errores.contrasenna_mayuscula"))
      .matches(/[0-9]/, t("actualizarTecnico.errores.contrasenna_numero"))
      .matches(
        /[!@#$%&*()?":{}|<>]/,
        t("actualizarTecnico.errores.contrasenna_especial")
      ),

    Especialidades: yup
      .array()
      .min(1, t("actualizarTecnico.errores.especialidad_min")),
    Estado: yup
      .string()
      .oneOf(
        ["disponible", "No disponible"],
        t("actualizarTecnico.errores.estado_invalido")
      )
      .required(t("actualizarTecnico.errores.estado_requerido")),
  });

  /*** React Hook Form ***/
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      IDTecnico: "",
      NombreTecnico: "",
      email: "",
      Contrasenna: "",
      Especialidades: [],
      Estado: "disponible",
    },
    values: datosTecnico,
    resolver: yupResolver(TecnicoEsquema),
  });

  /***Listados de carga en el formulario ***/
  useEffect(() => {
    const fechData = async () => {
      try {
        //Obtener
        const tecnicoRes = await UsuarioService.obtenerUsuarioPorId(id);
        const especialidadesRes = await EspecialidadService.getAll();
        //se guardan los datos
        SetearEspecialidades(especialidadesRes.data.data || []);
        //Obtener pelicula y asignarla formulario

        if (tecnicoRes.data) {
          const tecnico = tecnicoRes.data.data;
          console.log(tecnico);

          //Carga de las especialidades
          let especialidadesArray = [];
          if (Array.isArray(tecnico.ListaEsp)) {
            especialidadesArray = tecnico.ListaEsp.map((e) =>
              String(e.id_especialidad)
            );
          }
          reset({
            IDTecnico: tecnico.IDTecnico,
            NombreTecnico: tecnico.NombreTecnico,
            email: tecnico.email,
            Contrasenna: tecnico.contrasenna,
            Especialidades: especialidadesArray,
          });
        }
      } catch (error) {
        console.log(error);
        if (error.name != "AbortError") setError(error.message);
      }
    };
    fechData();
  }, [id]);

  /*** Submit ***/
  const onSubmit = async (datos) => {
    try {
      console.log(datos);
      if (await TecnicoEsquema.isValid(datos)) {
        console.log(datos);

        const response = await UsuarioService.ActualizarTecnico(datos);
        console.log(response.data);

        if (response.data?.success) {
          setCreatedName(
            `${response.data.data.IDTecnico} - ${response.data.data.NombreTecnico}`
          );
          setOpenSuccess(true);

          // Mostrar modal y redirigir después de 2 segundos
          setTimeout(() => {
            setOpenSuccess(false);
            navigate("/tecnicos");
          }, 2000);
        } else {
          setError(
            response.data?.message || "No se pudo actualizar el técnico"
          );
        }
      }
    } catch (err) {
      console.error(err);
      setError("Error al editar el usuario");
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="py-12 px-4">
      <Card className="rounded-2xl border-primary/60 p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">{t("actualizarTecnico.titulo")}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/*Nombre Completo*/}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ">
            <div>
              {/* Controller entrada year */}
              <Controller
                name="NombreTecnico"
                control={control}
                render={({ field }) => (
                  <CustomInputField
                    {...field}
                    label={t("actualizarTecnico.nombreCompleto")}
                    placeholder={t("actualizarTecnico.placeholderNombre")}
                    error={errors.NombreTecnico?.message}
                  />
                )}
              />
            </div>

            {/*Email*/}
            <div>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <CustomInputField
                    {...field}
                    label={t("actualizarTecnico.correo")}
                    placeholder={t("actualizarTecnico.placeholderCorreo")}
                    error={errors.email?.message}
                  />
                )}
              />
            </div>

            {/*contraseña*/}
            <div>
              <Controller
                name="Contrasenna"
                control={control}
                render={({ field }) => (
                  <CustomInputField
                    {...field}
                    label={t("actualizarTecnico.contrasenna")}
                    error={errors.Contrasenna?.message}
                  />
                )}
              />
            </div>
            {/*Estado*/}
            <div>
              <Controller
                name="Estado"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="block font-medium mb-1">{t("actualizarTecnico.estado")}</label>
                    <select
                      {...field}
                      className="border rounded p-2 w-full text-black"
                    >
                      <option value="disponible">{t("actualizarTecnico.estado_disponible")}</option>
                      <option value="No disponible">{t("actualizarTecnico.estado_noDisponible")}</option>
                    </select>
                    {errors.Estado && (
                      <p className="text-red-600 text-sm">
                        {errors.Estado.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div>
              <Label htmlFor="cargaTrabajo">{t("actualizarTecnico.cargaTrabajo")}</Label>
              <Input
                id="cargaTrabajo"
                value={0}
                disabled
                className="text-black"
              />
            </div>
          </div>

          {/* Especialidades */}
          <div>
            {/* Controller entrada Especialidades */}
            <Controller
              name="Especialidades"
              control={control}
              render={({ field }) => (
                <CustomMultiSelect
                  field={field}
                  data={datosEspecialidades}
                  label={t("actualizarTecnico.especialidades")}
                  getOptionLabel={(item) => item.nombre}
                  getOptionValue={(item) => item.id_especialidad ?? item.id}
                  error={errors.Especialidades?.message}
                  placeholder={t("actualizarTecnico.placeholderEspecialidades")}
                />
              )}
            />
          </div>

          <div className="flex justify-between gap-4 mt-6">
            <Button
              type="button"
              variant="default"
              className="flex items-center gap-2 bg-accent text-white"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
              {t("actualizarTecnico.boton_regresar")}
            </Button>
            {/* Botón Guardar */}
            <Button type="submit" className="flex-1">
              <Save className="w-4 h-4" />
              {t("actualizarTecnico.boton_guardar")}
            </Button>
          </div>
        </form>
      </Card>
      <Dialog open={openSuccess} onOpenChange={setOpenSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("actualizarTecnico.modalTitulo")}</DialogTitle>
            <DialogDescription>
              {t("actualizarTecnico.modalDescripcion")}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

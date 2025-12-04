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

export function CrearTecnico() {
  const navigate = useNavigate();
  const { t } = useTranslation("crearTecnico");

  /*** Estados para selects y preview de imagen ***/
  const [, SetearDataTecnico] = useState([]);
  const [datosEspecialidades, SetearEspecialidades] = useState([]);

  const [openSuccess, setOpenSuccess] = useState(false);
  const [createdName, setCreatedName] = useState("");

  const [error, setError] = useState("");

  /*** Esquema de validación Yup ***/
  const TecnicoEsquema = yup.object({
    NombreTecnico: yup
      .string()
      .required("nombre_requerido")
      .min(2, "nombre_min"),

    email: yup
      .string()
      .required("correo_requerido")
      .test(
        "email-validator",
        "correo_invalido", 
        (dato) => {
        if (!dato) return true;
        return validator.isEmail(dato);
      }
    )
      .test("validar-email", "correo_existe", async (dato) => {
        if (!dato) return true;
        try {
          const correo = await UsuarioService.ValEmail(dato);
          return !correo.data?.data?.exists;
        } catch (error) {
          console.log(error);
          return true;
        }
      }),

    Contrasenna: yup
      .string()
      .required("contrasenna_requerida")
      .min(8, "contrasenna_min")
      .matches(/[a-z]/, "contrasenna_minuscula")
      .matches(/[A-Z]/, "contrasenna_mayuscula")
      .matches(/[0-9]/, "contrasenna_numero")
      .matches(/[!@#$%&*()?\":{}|<>]/, "contrasenna_especial"),

    Especialidades: yup
      .array()
      .min(1, "especialidad_min"),

    Estado: yup
      .string()
      .required("estado_requerido")
      .oneOf(
        ["disponible", "No disponible"], 
        "estado_invalido"),
  });

    /*** React Hook Form ***/
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      NombreTecnico: "",
      email: "",
      Contrasenna: "",
      Especialidades: [],
      Estado: "disponible",
    },
    resolver: yupResolver(TecnicoEsquema),
  });

    /***Listados de carga en el formulario ***/
  useEffect(() => {
    const fechData = async () => {
      try {
        const especialidadesRes = await EspecialidadService.getAll();

        SetearEspecialidades(especialidadesRes.data.data || []);
      } catch (error) {
        console.log(error);
        if (error.name != "AbortError") setError(error.message);
      }
    };
    fechData();
  }, []);

    /*** Submit ***/
  const onSubmit = async (datos) => {
    try {
      if (await TecnicoEsquema.isValid(datos)) {
        const response = await UsuarioService.CrearTecnico(datos);

        if (response.data?.success) {
          setCreatedName(response.data.data.NombreTecnico);
          setOpenSuccess(true);

          setTimeout(() => {
            setOpenSuccess(false);
            navigate("/tecnicos");
          }, 2000);
        } else {
          setError(response.data?.message || t("crearTecnico.errores.error_crear"));
        }
      }
    } catch (err) {
      console.error(err);
      setError(t("crearTecnico.errores.error_crear"));
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="py-12 px-4">
      <Card className="rounded-2xl border-primary/60 p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">{t("crearTecnico.titulo")}</h2>

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
                  label={t("crearTecnico.nombreCompleto")}
                  placeholder={t("crearTecnico.placeholderNombre")}
                  error={errors.NombreTecnico && t(`crearTecnico.errores.${errors.NombreTecnico.message}`)}
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
                  label={t("crearTecnico.correo")}
                  placeholder={t("crearTecnico.placeholderCorreo")}
                  error={ errors.email && t(`crearTecnico.errores.${errors.email.message}`)
                  }
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
                  label={t("crearTecnico.contrasenna")}
                  error={errors.Contrasenna && t(`crearTecnico.errores.${errors.Contrasenna.message}`)}
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
                  <label className="block font-medium mb-1">{t("crearTecnico.estado")}</label>
                  <select
                    {...field}
                    className="border rounded p-2 w-full text-black"
                  >
                    <option value="disponible">{t("crearTecnico.estado_disponible")}</option>
                    <option value="No disponible">{t("crearTecnico.estado_noDisponible")}</option>
                  </select>
                  {errors.Estado && (
                    <p className="text-red-600 text-sm">
                      {t(`crearTecnico.errores.${errors.Estado.message}`)}
                    </p>
                  )}
                </div>
              )}
            />
            </div>

            <div>
              <Label>{t("crearTecnico.cargaTrabajo")}</Label>
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
                label={t("crearTecnico.especialidades")}
                placeholder={t("crearTecnico.placeholderEspecialidades")}
                getOptionLabel={(item) => item.nombre}
                getOptionValue={(item) => item.id_especialidad ?? item.id}
                error={errors.Especialidades && t(`crearTecnico.errores.${errors.Especialidades.message}`)}
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
              {t("crearTecnico.boton_regresar")}
            </Button>
            {/* Botón Guardar */}
            <Button type="submit" className="flex-1">
              <Save className="w-4 h-4" />
              {t("crearTecnico.boton_guardar")}
            </Button>
          </div>
        </form>
      </Card>
      {/* Modal de éxito */}
      <Dialog open={openSuccess} onOpenChange={setOpenSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("crearTecnico.modalTitulo")}</DialogTitle>
            <DialogDescription>
              {t("crearTecnico.modalDescripcion", { nombre: createdName })}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
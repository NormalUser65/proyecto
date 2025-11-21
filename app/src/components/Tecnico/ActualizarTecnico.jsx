import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

//Validator
import validator from 'validator';

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// icons
import {Save, ArrowLeft } from "lucide-react";

// servicios
import EspecialidadService from "@/Servicios/EspecialidadService";
import UsuarioService from "@/Servicios/UsuarioService";

// componentes reutilizables
import { CustomMultiSelect } from "../ui/custom/custom-multiple-select"; // select multi con chips
import { CustomSelect } from "../ui/custom/custom-select";
import { CustomInputField } from "../ui/custom/custom-input-field";

export function ActualizarTecnico() {


  const navigate = useNavigate();
  //Obtener parámetro del id de la película
  const { id }=useParams();
  const BASE_URL_image= import.meta.env.VITE_BASE_URL+"uploads"

  /*** Estados para selects y preview de imagen ***/
  const [datosTecnico, SetearDataTecnico] = useState([]);
  const [datosEspecialidades, SetearEspecialidades] = useState([]);

  const [error, setError] = useState("");

  /*** Esquema de validación Yup ***/
  const TecnicoEsquema= yup.object({
    NombreTecnico: yup.string()
            .required('El nombre es requerido')
            .min(2, "El nombre debe tener al menos 2 caracteres"),

    email: yup.string()
          .required('El correo es requerido')
          .test('email-validator', 'Por favor, introduce un correo electrónico válido',
              dato => {
              //validator
              if (!dato) return true; 
                return validator.isEmail(dato);
              })
          .test('validar-email', 'Este email ya fue registrado',
            async (dato) => {
              if (!dato) return true;
              try {
                const correo = await UsuarioService.ValEmail(dato);
                const exists = correo.data?.data?.exists;
                return !exists;
              } catch (error) {
                console.log(error);
                return true;
              }
            }
          )
              ,

    Contrasenna: yup.string()
          .required("La contraseña es requerida")
          .min(8, 'Deber contar con al menos 8 dígitos')
          .matches(/[a-z]/, 'La contraseña debe tener al menos una minúscula')
          .matches(/[A-Z]/, 'La contraseña debe tener al menos una mayúscula')
          .matches(/[0-9]/, 'La contraseña debe tener al menos un número')
          .matches(/[!@#$%&*()?":{}|<>]/, 'La contraseña debe tener al menos un carácter especial'),

    Especialidades: yup.array().min(1, 'El Técnico debe tener mínimo una especialidad'), 
        Estado: yup.string()
        .oneOf(['disponible', 'No disponible'], 'debe seleccionar si está disponible o No disponible')
        .required('El estado es requerido')
  })

  /*** React Hook Form ***/
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      IDTecnico:"",
      NombreTecnico:"",
      email: "",
      Contrasenna: "",
      Especialidades: [],
      Estado: "disponible"
    },
    values: datosTecnico,
    resolver:yupResolver(TecnicoEsquema)
  });
  
  /***Listados de carga en el formulario ***/
  useEffect(()=>{
    const fechData=async()=>{
      try {
        //Obtener
        const tecnicoRes=await UsuarioService.obtenerUsuarioPorId(id);
        const especialidadesRes=await EspecialidadService.getAll();
        //se guardan los datos 
        SetearEspecialidades(especialidadesRes.data.data || []);
        //Obtener pelicula y asignarla formulario


        if(tecnicoRes.data){
          const tecnico=tecnicoRes.data.data;
          console.log(tecnico)
          
          //Carga de las especialidades
        let especialidadesArray = [];
        if (Array.isArray(tecnico.ListaEsp)) {
          especialidadesArray = tecnico.ListaEsp.map(e => String(e.id_especialidad));
        }
          reset({
            IDTecnico: tecnico.IDTecnico,
            NombreTecnico: tecnico.NombreTecnico,
            email: tecnico.email,
            Contrasenna: tecnico.contrasenna,
            Especialidades: especialidadesArray,
          }) 
        }
      } catch (error) {
        console.log(error)
        if(error.name != "AbortError") setError(error.message)
      }
    }
    fechData()
  },[id])

  /*** Submit ***/
  const onSubmit = async (datos) => {

    try {
      console.log(datos)
      if (await TecnicoEsquema.isValid(datos)) {
        console.log(datos)

      const response = await UsuarioService.ActualizarTecnico(datos);
      console.log(response.data) 
    if (response.data) {
          toast.success(`El tecnico actualizado #${response.data.data.IDTecnico} - ${response.data.data.NombreTecnico}`, { 
            duration: 3000, 
            position: "top-center", 
          }); 
    } else {
      setError(response.data?.message || "No se pudo actualizar el técnico");
    }
    navigate("/tecnicos");
  }
    } catch (err) {
      console.error(err);
      setError("Error al editar el usuario");
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <Card className="rounded-2xl border-primary/60 p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Actualizar Técnico</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/*Nombre Completo*/}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ">
          <div>
            {/* Controller entrada year */}
            <Controller name="NombreTecnico" control={control} render={({field})=>
              <CustomInputField 
                {...field} 
                label="Nombre Completo" 
                placeholder="Ingrese el nombre completo"
                error={errors.NombreTecnico?.message}
              />
            } />
          </div>


          {/*Email*/}
          <div>
            <Controller
              name="email"
              control={control}
              render={({ field }) =>
                <CustomInputField
                  {...field}
                  label="Correo Electrónico"
                  placeholder="correo_de_ejemplo@correo.com"
                  error={errors.email?.message} />
              }
            />
          </div>

          {/*contraseña*/}
          <div>
            <Controller
              name="Contrasenna"
              control={control}
              render={({ field }) =>
                <CustomInputField
                  {...field}
                  label="Contraseña"
                  error={errors.Contrasenna?.message} />}
            />
          </div>
          {/*Estado*/}
        <div>
          <Controller
            name="Estado"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block font-medium mb-1">Estado</label>
                <select {...field} className="border rounded p-2 w-full text-black">
                  <option value="disponible">disponible</option>
                  <option value="No disponible">No disponible</option>
                </select>
                {errors.Estado && (
                  <p className="text-red-600 text-sm">{errors.Estado.message}</p>
                )}
          </div>
            )}
        />
        </div>

        <div>
            <Label htmlFor="cargaTrabajo">Carga de trabajo</Label>
            <Input id="cargaTrabajo" value={0} disabled className="text-black"/>
          </div>
        </div>

        

        {/* Especialidades */}
        <div>
          {/* Controller entrada Especialidades */}
          <Controller name="Especialidades" control={control} render={({field})=> 
            <CustomMultiSelect
              field={field}
              data={datosEspecialidades}
              label="Especialidades"
              getOptionLabel={(item)=>item.nombre}
              getOptionValue={(item)=> item.id_especialidad ?? item.id}
              error={errors.Especialidades?.message}
              placeholder="Seleccione la(s) especialidad(es)"
            />
          } />
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <Button
            type="button"
            variant="default"
            className="flex items-center gap-2 bg-accent text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            Regresar
          </Button>
          {/* Botón Guardar */}
          <Button type="submit" className="flex-1">
            <Save className="w-4 h-4" />
            Guardar
          </Button>
        </div>
      </form>
    </Card>
  );
}

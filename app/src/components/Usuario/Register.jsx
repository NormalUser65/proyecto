import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import GestionUsuarioService from "../../Servicios/GestionUsuarioService";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = yup.object({
  nombre: yup.string().required("El nombre es obligatorio"),
  email: yup
    .string()
    .email("Correo inválido")
    .required("El correo es obligatorio"),
  contrasenna: yup
    .string()
    .required("La contraseña es obligatoria")
    .min(8, "Debe tener al menos 8 caracteres")
    .matches(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .matches(/[a-z]/, "Debe contener al menos una letra minúscula")
    .matches(/[0-9]/, "Debe contener al menos un número")
    .matches(/[@$!%*?&#^()_\-+=]/, "Debe contener al menos un carácter especial"),
});


export function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      nombre: "",
      email: "",
      contrasenna: "",
      IDRol: 3,
      language: "es",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await GestionUsuarioService.create(data);
      if (response.data?.success) {
        toast.success("Usuario creado correctamente");
        navigate("/user/login");
      } else {
        toast.error("No se pudo crear el usuario");
      }
    } catch (error) {
      toast.error("Error al crear usuario");
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg border border-white/10 bg-white/10 backdrop-blur-lg text-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Crear Cuenta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                type="text"
                placeholder="Tu nombre"
                {...register("nombre")}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
              {errors.nombre && (
                <p className="text-red-300 text-sm mt-1">
                  {errors.nombre.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                {...register("email")}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
              {errors.email && (
                <p className="text-red-300 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="contrasenna">Contraseña</Label>
              <Input
                id="contrasenna"
                type="password"
                placeholder="********"
                {...register("contrasenna")}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
              {errors.contrasenna && (
                <p className="text-red-300 text-sm mt-1">
                  {errors.contrasenna.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold mt-2"
            >
              {isSubmitting ? "Creando..." : "Crear cuenta"}
            </Button>

            <p className="text-sm text-center mt-4">
              ¿Ya tienes cuenta?{" "}
              <a
                href="/user/login"
                className="text-accent underline hover:text-accent/80"
              >
                Inicia sesión
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

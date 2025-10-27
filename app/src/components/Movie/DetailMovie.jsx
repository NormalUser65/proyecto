import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TechnicianService from "../../Servicios/ServicioUsuario"; // servicio que debe llamar a tu endpoint de técnicos
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Briefcase, CheckCircle, ArrowLeft } from "lucide-react";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { EmptyState } from "../ui/custom/EmptyState";

export function DetailTechnician() {
    const navigate = useNavigate();
    const { id } = useParams(); // id del usuario/técnico
    const [tech, setTech] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetch = async () => {
        try {
        setLoading(true);
        const response = await TechnicianService.getById(id); // debe llamar al endpoint que ejecuta tu SELECT
        // Normaliza la respuesta: soporta { data: {...} } o directamente {...}
        const payload = response?.data ?? response;
        // Si tu API envuelve en payload.data, cámbialo por payload.data
        const entity = payload.data ?? payload;
        if (!entity) {
            setError("No se encontró el técnico.");
            setTech(null);
        } else {
            setTech(entity);
        }
        } catch (err) {
        setError(err?.message ?? "Error al cargar el técnico.");
        setTech(null);
        } finally {
        setLoading(false);
        }
    };
    if (id) fetch();
    }, [id]);

    if (loading) return <LoadingGrid count={1} type="grid" />;
    if (error) return <ErrorAlert title="Error al cargar técnico" message={error} />;
    if (!tech) return <EmptyState message="Técnico no encontrado." />;

  // Campos esperados del SELECT:
  // tech.id, tech.nombre, tech.email, tech.nombreRol (si tu backend aliasó) o tech.role_name, tech.rol (disponibilidad)
  // Ajusta los nombres si tu API los devuelve distintos
    const idField = tech.id ?? tech.ID ?? tech.user_id;
    const nombre = tech.nombre ?? tech.name ?? tech.display_name ?? "—";
    const email = tech.email ?? tech.mail ?? "—";
  // role puede venir duplicado como r.nombre; si tu backend devuelve dos 'nombre' usa alguna clave distinta. Acá intento varias opciones:
    const roleName = tech.role_name ?? tech.rol_nombre ?? tech.role ?? tech.nombre_rol ?? tech["r.nombre"] ?? "Técnico";
    const disponibilidad = tech.rol ?? tech.disponibilidad ?? tech.availability ?? "desconocida";

    return (
    <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Avatar / imagen placeholder */}
        <div className="flex-shrink-0 w-full md:w-1/4 lg:w-1/5 rounded-lg overflow-hidden shadow-xl">
            <div className="aspect-square w-full bg-muted flex items-center justify-center">
            <User className="h-20 w-20 text-muted-foreground" />
            </div>
            <Badge variant="secondary" className="absolute bottom-4 right-4 text-sm m-4">
            ID {idField}
            </Badge>
        </div>

        {/* Detalles */}
        <div className="flex-1 space-y-6">
            <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {nombre}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Perfil: <strong>{roleName}</strong></p>
            </div>

            <Card>
            <CardContent className="p-6 space-y-6">
                <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                    <div className="font-semibold">Correo electrónico</div>
                    <div className="text-muted-foreground">{email}</div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <div>
                    <div className="font-semibold">Rol registrado</div>
                    <div className="text-muted-foreground">{roleName}</div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <div>
                    <div className="font-semibold">Disponibilidad</div>
                    <div className="text-muted-foreground">{disponibilidad}</div>
                    </div>
                </div>
                </div>

              {/* Si querés agregar más secciones (especialidades, tickets asignados, carga) las podés insertar aquí */}
            </CardContent>
            </Card>
        </div>
        </div>

        <Button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 bg-accent text-white hover:bg-accent/90 mt-6"
        >
        <ArrowLeft className="w-4 h-4" />
        Regresar
        </Button>
    </div>
    );
}

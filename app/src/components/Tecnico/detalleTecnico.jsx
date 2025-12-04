import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UsuariosService from '../../Servicios/UsuarioService';
import { ErrorAlert } from "../ui/custom/AlertaError";
// Shadcn UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { ArrowLeft, Tag, User, Clock } from "lucide-react";
import { LoadingGrid } from '../ui/custom/CargandoGrid';
import { EmptyState } from '../ui/custom/estadoVacio';
import { useTranslation } from "react-i18next";

export function DetalleTecnico() {
    const navigate = useNavigate();
    const { id } = useParams(); 
    const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';
    const [category, setCategory] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setCarga] = useState(true);

    const { t } = useTranslation("detalleTecnico");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await UsuariosService.obtenerUsuarioPorId(id)
                // Si la petición es exitosa, se guardan los datos 
                console.log(response.data.data);
                setCategory(response.data.data);
                if(!response.data.success){ 
                            setError(response.data.message) 
                } 

            } catch (err) { 
                // Si el error no es por cancelación, se registra 
                if (err.name !== "AbortError") setError(err.message); 

            } finally { 
                // Independientemente del resultado, se actualiza el loading 
                setCarga(false); 
            } 
        }; 
        fetchData()
    }, [id]);

    if (loading) return <LoadingGrid count={1} type="grid" />;
    if (error) return (<ErrorAlert title={t("detalleTecnico.errorTitulo")} message={error} />);
    if (!category)
        return ( <EmptyState message={t("detalleTecnico.emptyMessage")} />);

    const data = category;

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-4xl font-extrabold mb-6 text-primary">
                {data.NombreTecnico || t("detalleTecnico.tituloFallback")}
            </h1>

            <Card className="!rounded-2xl shadow-lg border-border/50">
                <CardContent className="p-6 space-y-5">
                    <div className="flex flex-col gap-1">
                        <span className="font-semibold text-gray-800">
                            {t("detalleTecnico.identificador")}
                            <span className="font-normal text-muted-foreground ml-2">
                                {data.IDTecnico}
                            </span>
                        </span>
                        <span className="font-semibold text-gray-800">
                            {t("detalleTecnico.nombreRegistrado")}
                            <span className="font-normal text-muted-foreground ml-2">
                                {data.NombreTecnico}
                            </span>
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">{t("detalleTecnico.correoContacto")}</span>
                        <p className="text-muted-foreground">{data.email}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">{t("detalleTecnico.cargaTrabajoActual")}</span>
                        <p className="text-muted-foreground">{data.TicketsActivos} {t("detalleTecnico.ticketsActivos")}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">
                            {t("detalleTecnico.disponibilidad")}
                        </span>
                        <p className="text-muted-foreground">{data.disponibilidad}</p>
                    </div>

                    {data.Especialidades && (
                        <div>
                            <span className="font-semibold text-gray-800">
                                {t("detalleTecnico.especialidadesTitulo")}
                            </span>
                            <div className="flex flex-wrap gap-2 mt-2 ">
                                {data.Especialidades.split(",").map((esp, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-accent/35 text-accent px-3 py-1 rounded-full text-sm font-medium"
                                    >
                                        <p className="text-muted-foreground">{esp.trim()}</p>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 bg-accent text-white hover:bg-accent/90 mt-6 !rounded-2xl px-5 py-2 shadow-sm"
            >
                <ArrowLeft className="w-4 h-4" />
                {t("detalleTecnico.botonRegresar")}
            </Button>
        </div>
    );
}

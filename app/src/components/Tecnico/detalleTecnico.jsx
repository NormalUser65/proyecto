import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UsuariosService from '../../Servicios/UsuarioService';
import { ErrorAlert } from "../ui/custom/ErrorAlert";
// Shadcn UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { ArrowLeft, Tag, User, Clock } from "lucide-react";
import { LoadingGrid } from '../ui/custom/CargandoGrid';
import { EmptyState } from '../ui/custom/estadoVacio';

export function DetailCategory() {
    const navigate = useNavigate();
    const { id } = useParams(); 
    const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';
    const [category, setCategory] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setCarga] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await UsuariosService.obtenerUsuarioPorId(id)
                // Si la petición es exitosa, se guardan los datos 
                console.log(response.data);
                setCategory(response.data);
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
    if (error) return <ErrorAlert title="Error al cargar la categoría" message={error} />;
    if (!category || category.data.length === 0)
        return <EmptyState message="No se encontraron datos de esta categoría." />;

    const data = category.data[0]; // <-- CAMBIAR: según la estructura que devuelve tu API

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-4xl font-extrabold mb-6">{data.Categoria}</h1> {/* <-- CAMBIAR: nombre de columna */}
            <Card>
                <CardContent className="p-6 space-y-4">
                    {/* Descripción */}
                    <div>
                        <span className="font-semibold">Descripción:</span>
                        <p className="text-muted-foreground">{data.Descripcion}</p> {/* <-- CAMBIAR */}
                    </div>

                    {/* SLA */}
                    <div className="flex items-center gap-4">
                        <Clock className="h-5 w-5 text-primary" />
                        <span className="font-semibold">SLA:</span>
                        <p className="text-muted-foreground">
                            {data.SLA} ({data.Tiempo_Max_Respuesta} min resp., {data.Tiempo_Max_Resolucion} min resolución) {/* <-- CAMBIAR */}
                        </p>
                    </div>

                    {/* Etiquetas */}
                    {data.Etiquetas && (
                        <div>
                            <span className="font-semibold flex items-center gap-2">
                                <Tag className="h-5 w-5 text-primary" /> Etiquetas:
                            </span>
                            <p className="text-muted-foreground">{data.Etiquetas}</p> {/* <-- CAMBIAR */}
                        </div>
                    )}

                    {/* Especialidades */}
                    {data.Especialidades && (
                        <div>
                            <span className="font-semibold flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" /> Especialidades del Tecnico:
                            </span>
                            <p className="text-muted-foreground">{data.Especialidades}</p> {/* <-- CAMBIAR */}
                        </div>
                    )}
                </CardContent>
            </Card>

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
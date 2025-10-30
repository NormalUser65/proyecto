import React, { useEffect, useState } from "react";
import UsuarioService from "../../Servicios/UsuarioService";
import { ListaCartTecnico } from './ListaCartTecnico';
import { LoadingGrid } from "../ui/custom/CargandoGrid";
import { EmptyState } from "../ui/custom/estadoVacio";
import { ErrorAlert } from "../ui/custom/AlertaError";

export function ListaTecnico() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { 
        const fetchData = async () => { 
            try { 
                const response = await UsuarioService.ObtenerTecnicos(); 
                //console.log(response.data);
                console.log(JSON.stringify(response.data, null, 2));
                setData(response.data);
                if(!response.data.success){ 
                    setError(response.data.message);
                } 
            } catch (err) { 
                if (err.name !== "AbortError") setError(err.message); 
            } finally { 
                setLoading(false); 
            } 
        }; 
        fetchData();
    }, []); // <- importante

    if (loading) return <LoadingGrid type="grid" />;
    if (error) return <ErrorAlert title="Error al cargar técnicos" message={error} />;
    if (!data?.data || data.data.length === 0)
        return <EmptyState message="No se encontraron técnicos." />;

    return (
        <div className="mx-auto max-w-7xl p-6">
            <ListaCartTecnico data={data.data}/>
        </div>
    );
}

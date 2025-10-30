<?php
class CategoriaModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    /*Listar */
    public function listadoCategoria()
    {
        try {
            //Consulta sql
            $vSql = "SELECT cat.id,cat.nombre, s.nombre AS SLA FROM categoria cat LEFT JOIN sla s ON cat.sla_id = s.id;";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    /*Obtener por id*/
    public function get($id)
    {
        try {
            //Consulta sql
            $vSql = "SELECT * FROM categoria where id=$id";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /*Detalle categoria*/
    public function DetalleCategoria($id)
{
    try {
        $vSql = "SELECT c.id, c.nombre AS Categoria, c.description AS Descripcion, s.nombre AS SLA,
            s.max_resp_minutos AS Tiempo_Max_Respuesta, s.max_resol_minutos AS Tiempo_Max_Resolucion,
            GROUP_CONCAT(DISTINCT e.nombre SEPARATOR ', ') AS Etiquetas,
            GROUP_CONCAT(DISTINCT esp.nombre SEPARATOR ', ') AS Especialidades
            FROM categoria c
            LEFT JOIN sla s ON c.sla_id = s.id
            LEFT JOIN Categoria_Etiqueta ce ON c.id = ce.IDCategoria
            LEFT JOIN etiqueta e ON ce.IDEtiqueta = e.id
            LEFT JOIN especialidad_categoria ec ON c.id = ec.IDCategoria
            LEFT JOIN especialidad esp ON ec.IDEspecialidad = esp.id
            WHERE c.id = $id
            GROUP BY c.id, c.nombre, c.description, s.nombre, s.max_resp_minutos, s.max_resol_minutos;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado[0];
    } catch (Exception $e) {
        handleException($e);
    }
}

    /*Obtener por el nombre de la categoria*/
    public function getNombre($nombre)
    {
        try {
            //Consulta sql
            $vSql = "SELECT * FROM categoria where nombre=$nombre";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

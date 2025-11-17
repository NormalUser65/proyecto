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

    /**
     * Crear categoría
     * @param $objeto categoría a insertar
     * @return $this->get($idCategoria) - Objeto categoría
     */
    public function crearCategoria($objeto)
    {
        // Insertar categoría
        $sql = "INSERT INTO categoria (nombre, description, sla_id) 
                VALUES ('$objeto->nombre', '$objeto->description', $objeto->sla_id)";
        $idCategoria = $this->enlace->executeSQL_DML_last($sql);

        // --- Etiquetas ---
if (!empty($objeto->etiquetas)) {
    foreach ($objeto->etiquetas as $idEtiqueta) {
        $sql = "INSERT INTO Categoria_Etiqueta (IDCategoria, IDEtiqueta) 
                VALUES ($idCategoria, $idEtiqueta)";
        $this->enlace->executeSQL_DML($sql);
    }
}

// --- Especialidades ---
if (!empty($objeto->especialidades)) {
    foreach ($objeto->especialidades as $idEspecialidad) {
        $sql = "INSERT INTO especialidad_categoria (IDCategoria, IDEspecialidad) 
                VALUES ($idCategoria, $idEspecialidad)";
        $this->enlace->executeSQL_DML($sql);
    }
}

        // Retornar categoría creada
        return $this->get($idCategoria);
    }

    /**
     * Actualizar categoría
     * @param $objeto categoría a actualizar
     * @return $this->get($idCategoria) - Objeto categoría
     */
    public function actualizarCategoria($objeto)
    {
        // Actualizar categoría
        $sql = "UPDATE categoria 
                SET nombre = '$objeto->nombre',
                    description = '$objeto->description',
                    sla_id = $objeto->sla_id
                WHERE id = $objeto->id";
        $this->enlace->executeSQL_DML($sql);

        // --- Etiquetas ---
        $sql = "DELETE FROM Categoria_Etiqueta WHERE IDCategoria = $objeto->id";
        $this->enlace->executeSQL_DML($sql);
        foreach ($objeto->etiquetas as $idEtiqueta) {
            $sql = "INSERT INTO Categoria_Etiqueta (IDCategoria, IDEtiqueta) 
                    VALUES ($objeto->id, $idEtiqueta)";
            $this->enlace->executeSQL_DML($sql);
        }

        // --- Especialidades ---
        $sql = "DELETE FROM especialidad_categoria WHERE IDCategoria = $objeto->id";
        $this->enlace->executeSQL_DML($sql);
        foreach ($objeto->especialidades as $idEspecialidad) {
            $sql = "INSERT INTO especialidad_categoria (IDCategoria, IDEspecialidad) 
                    VALUES ($objeto->id, $idEspecialidad)";
            $this->enlace->executeSQL_DML($sql);
        }

        // Retornar categoría actualizada
        return $this->get($objeto->id);
    }
}

<?php
class EspecialidadModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    /*Listar */
    public function all()
    {
        try {
            //Consulta sql
            $vSql = "SELECT * FROM especialidad;";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    /*Obtiene la lista de especialidades de un tecnico*/
    public function listaEspecialidadTecnico($id)
{
    try {
        // Consulta SQL usando el ID real
        $vSql = "SELECT 
                    e.id AS id_especialidad, 
                    e.nombre
                FROM Tecnico_especialidad te 
                INNER JOIN especialidad e 
                ON te.IDEspecialidad = e.id 
                WHERE te.IDTecnico = $id;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado;

    } catch (Exception $e) {
        handleException($e);
    }
}


    /*Obtener por el nombre*/
    public function getNombre($nombre)
    {
        try {
            //Consulta sql
            $vSql = "SELECT * FROM especialidad where IdRol=$nombre";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
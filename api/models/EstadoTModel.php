<?php
class EstadoModel
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
            $vSql = "SELECT * FROM estado_ticket;";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    /*Obtener por email*/
    public function get($id)
    {
        try {
            //Consulta sql
            $vSql = "SELECT * FROM estado_ticket where id=$id";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /*Obtener por el nombre*/
    public function getNombre($nombre)
    {
        try {
            //Consulta sql
            $vSql = "SELECT * FROM estado_ticket where nombre=$nombre";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
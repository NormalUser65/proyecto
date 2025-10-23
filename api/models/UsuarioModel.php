<?php
class UsuarioModel
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
            $vSql = "SELECT * FROM usuario;";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    /*Obtener por email*/
    public function get($email)
    {
        try {
            //Consulta sql
            $vSql = "SELECT * FROM usuario where email=$email";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /*Obtener por el tipo de rol*/
    public function getRol($IdRol)
    {
        try {
            //Consulta sql
            $vSql = "SELECT * FROM usuario where IdRol=$IdRol";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
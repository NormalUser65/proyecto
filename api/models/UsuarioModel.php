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

    public function AllTec()
    {
        try {
            //Consulta sql
            $vSql = "SELECT u.id AS user_id,u.display_name,u.email,r.name 
            AS role_name,t.id AS technician_id,t.employee_code,t.availability,t.current_load 
            FROM users u JOIN technicians t ON u.id = t.user_id JOIN roles r ON u.role_id = r.id;";
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
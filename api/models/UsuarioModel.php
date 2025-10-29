<?php
class UsuarioModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /* Listar todos los usuarios */
    public function ListaUsuarios()
    {
        try {
            // Consulta SQL
            $vSql = "SELECT u.id,u.nombre,u.email, r.nombre AS rol FROM usuario u INNER JOIN rol r ON u.IDRol = r.id;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /* Listar únicamente los técnicos */
    public function ListaTecnicos()
    {
        try {
<<<<<<< HEAD
            $vSql = "SELECT u.nombre,u.email, r.nombre, AS rol FROM usuario u INNER JOIN rol r ON u.IDRol = r.id where u.IDRol = 2;";
=======
            // Consulta SQL: usuarios cuyo rol sea Técnico (IDRol = 2)
            $vSql = "SELECT u.nombre,u.email, r.nombre AS rol FROM usuario u INNER JOIN rol r ON u.IDRol = r.id where u.IDRol = 2;";
>>>>>>> ef3a9ab56ab4f626f061802468ce5465c0423b69
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function ListaDetalleTecnicos($id)
    {
        try {
            $vSql = "SELECT u.id,u.nombre,u.email, r.nombre, r.disponibilidad AS rol 
            FROM usuario u INNER JOIN rol r ON u.IDRol = r.id where u.IDRol = 2 AND u.id=$id ;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    

    /* Obtener por email */
    public function get($email)
    {
        try {
            // Evitar inyección SQL — se usa comillas
            $vSql = "SELECT * FROM usuario WHERE email = '$email'";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado[0];

        } catch (Exception $e) {
            handleException($e);
        }
    }

    /* Obtener por tipo de rol */
    public function getRol($IdRol)
    {
        try {
            $vSql = "SELECT * FROM usuario WHERE IDRol = $IdRol";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;

        } catch (Exception $e) {
            handleException($e);
        }
    }
}
?>

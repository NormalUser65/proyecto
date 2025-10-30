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

    /*Lista con los datos de los t[ecnicos] esto es lo que se va a usar para generar las cartas*/
    public function ListaTecnicos(){
    try {
        $vSql = $vSql = 'SELECT u.id AS IDTecnico, u.nombre AS NombreTecnico, u.email, u.disponibilidad,
        GROUP_CONCAT(DISTINCT e.nombre SEPARATOR ", ") AS Especialidades,
        COUNT(DISTINCT t.id) AS TicketsActivos
        FROM usuario u
        LEFT JOIN Tecnico_especialidad te ON te.IDTecnico = u.id
        LEFT JOIN especialidad e ON e.id = te.IDEspecialidad
        LEFT JOIN ticket t ON t.IDTecnico = u.id AND t.activo = 1
        WHERE u.IDRol = 2
        GROUP BY u.id, u.nombre, u.email, u.disponibilidad;';

        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado;
    } catch (Exception $e) {
        handleException($e);
    }
}

    //Esta funcion es la que se va a usar para generar el detalle de los tecnicos
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


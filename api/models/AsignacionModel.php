<?php
class asignacionModel
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
            $vSql = "SELECT 
            a.id,
            a.IDTicket,
            a.IDTecnico,
            a.asignado_por,
            a.hora_Asig,
            a.method,
            a.descripcion,
            a.activo,
            t.estado,
            t.IDCategoria,
            t.creado_en,
            t.sla_resol_deadline
            FROM asignacion a
            INNER JOIN ticket t ON a.IDTicket = t.id
            WHERE a.activo = 1;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
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
            $vSql = "SELECT * FROM asignacion where id=$id";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /*Obtener por id del tecnico*/
    public function getTicketTecnico($id)
    {
        try {
            //Consulta sql
            $vSql = "SELECT * FROM asignacion where tecnico_id=$id";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /*Obtener por Ticket*/
    public function getTicket($id)
    {
        try {
            //Consulta sql
            $vSql = "SELECT * FROM asignacion where ticket_id=$id";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /*Obtiene el ticket de la asignación por medio su ID*/
    public function ObtenerTicket($id)
    {
        try {
            //Consulta sql
            $vSql = "SELECT ticket_id  FROM asignacion where id=$id";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /*Obtener el tecnico por medio del id de la asignación*/
    public function ObtenerTecnico($id)
    {
        try {
            //Consulta sql
            $vSql = "SELECT tecnico_id FROM asignacion where id=$id";
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
            $vSql = "SELECT * FROM asignacion where IdRol=$nombre";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
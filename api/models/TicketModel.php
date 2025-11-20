<?php
class TicketModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    // Lista
    public function all()
    {
        try {
            $vSql = "SELECT t.*, p.nombre AS prioridad_nombre
                 FROM ticket t
                 INNER JOIN prioridad p ON t.IDPrioridad = p.id;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function ObtenerPorID($ID)
    {
        try {
            $vSql = "SELECT t.*, p.nombre AS prioridad_nombre
                 FROM ticket t
                 INNER JOIN prioridad p ON t.IDPrioridad = p.id
                 WHERE t.id = $ID;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }


    public function CantTrabajoTecnico($id)
    {
        try {
            //Consulta sql
            $vSql = "SELECT COUNT(t.id) AS Total_Tickets from ticket t INNER JOIN usuario u 
            ON t.IDTecnico = u.id WHERE u.id = $id;";
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
            $vSql = "SELECT * FROM ticket where IdRol=$nombre";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function crearTicket($objeto)
    {
        try {
            // Zona horaria
            date_default_timezone_set('America/Costa_Rica');

            // Tiempos por categoría
            $sqlSla = "SELECT s.max_resp_minutos, s.max_resol_minutos
            FROM categoria c
            INNER JOIN sla s ON c.sla_id = s.id
            WHERE c.id = " . intval($objeto->IDCategoria);

            $slaData = $this->enlace->executeSQL($sqlSla, "obj");

            if (empty($slaData)) {
                throw new Exception("No se encontró SLA para la categoría {$objeto->IDCategoria}");
            }

            $respMin = intval($slaData[0]->max_resp_minutos);
            $resolMin = intval($slaData[0]->max_resol_minutos);

            // Cálculo de slas
            $fechaCreacion = date("Y-m-d H:i:s");
            $timestamp = strtotime($fechaCreacion);

            $slaRespDeadline  = date("Y-m-d H:i:s", $timestamp + ($respMin * 60));
            $slaResolDeadline = date("Y-m-d H:i:s", $timestamp + ($resolMin * 60));

            // Insert
            $sql = "INSERT INTO ticket 
            (Titulo, descripcion, IDUsuario, IDCategoria, IDPrioridad, estado, 
            sla_resp_deadline, sla_resol_deadline, activo) 
            VALUES (
                '" . $objeto->Titulo . "',
                '" . $objeto->descripcion . "',
                " . intval($objeto->IDUsuario) . ",
                " . intval($objeto->IDCategoria) . ",
                " . intval($objeto->IDPrioridad ?? 3) . ",
                'pendiente',
                '$slaRespDeadline',
                '$slaResolDeadline',
                1
            )";

            return $this->enlace->executeSQL_DML_last($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

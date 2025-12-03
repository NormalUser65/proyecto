<?php
class TicketModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    // Lista de tickets con estado y prioridad
    public function all()
    {
        try {
            $vSql = "SELECT t.*, p.nombre AS prioridad_nombre, e.nombre AS estado_nombre
            FROM ticket t
            INNER JOIN prioridad p ON t.IDPrioridad = p.id
            INNER JOIN estado e ON t.IDEstado = e.id;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Obtener ticket por ID
    public function ObtenerPorID($ID)
    {
        try {
            $vSql = "SELECT t.*, p.nombre AS prioridad_nombre, e.nombre AS estado_nombre
            FROM ticket t
            INNER JOIN prioridad p ON t.IDPrioridad = p.id
            INNER JOIN estado e ON t.IDEstado = e.id
            WHERE t.id = " . intval($ID);
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function CantTrabajoTecnico($id)
    {
        try {
            $vSql = "SELECT COUNT(t.id) AS Total_Tickets
            FROM ticket t
            INNER JOIN usuario u ON t.IDTecnico = u.id
            WHERE u.id = " . intval($id);
            $vResultado = $this->enlace->ExecuteSQL($vSql);
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


    // Crear ticket (estado inicial = Pendiente)
    public function crearTicket($objeto)
    {
        try {
            date_default_timezone_set('America/Costa_Rica');

            // Obtener SLA por categoría
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

            $fechaCreacion = date("Y-m-d H:i:s");
            $timestamp = strtotime($fechaCreacion);

            $slaRespDeadline  = date("Y-m-d H:i:s", $timestamp + ($respMin * 60));
            $slaResolDeadline = date("Y-m-d H:i:s", $timestamp + ($resolMin * 60));

            // Insertar ticket
            $sqlTicket = "INSERT INTO ticket 
            (Titulo, descripcion, IDUsuario, IDCategoria, IDPrioridad, IDEstado, sla_resp_deadline, sla_resol_deadline, activo) 
            VALUES (
            '" . addslashes($objeto->Titulo) . "',
            '" . addslashes($objeto->descripcion) . "',
            " . intval($objeto->IDUsuario) . ",
            " . intval($objeto->IDCategoria) . ",
            " . intval($objeto->IDPrioridad ?? 3) . ",
            1,
            '$slaRespDeadline',
            '$slaResolDeadline',
            1)";

            $ticketId = $this->enlace->executeSQL_DML_last($sqlTicket);

            // Insertar historial inicial
            $comentarioSQL = !empty($objeto->comentario) ? "'" . addslashes($objeto->comentario) . "'" : "NULL";
            $sqlHistorial = "INSERT INTO Historial_ticket 
            (IDticket, from_state, to_state, cambiado_por, comentario, Creado_el) 
            VALUES (
            $ticketId,
            NULL,
            1,
            " . intval($objeto->IDUsuario) . ",
            $comentarioSQL,
            NOW())";

            $historialId = $this->enlace->executeSQL_DML_last($sqlHistorial);

            // Insertar imágenes opcionales
            if (!empty($objeto->imagenes) && is_array($objeto->imagenes)) {
                foreach ($objeto->imagenes as $imgUrl) {
                    $sqlImg = "INSERT INTO Imagen (IDHistorial, url) 
                    VALUES ($historialId, '" . addslashes($imgUrl) . "')";
                    $this->enlace->executeSQL_DML($sqlImg);
                }
            }

            return $ticketId;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

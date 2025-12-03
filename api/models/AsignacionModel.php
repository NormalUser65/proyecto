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
                    t.IDEstado, 
                    e.nombre AS estado,   -- 🔹 nombre del estado
                    t.IDCategoria, 
                    c.nombre AS nombreCategoria, 
                    t.creado_en, 
                    t.sla_resol_deadline
                FROM asignacion a
                INNER JOIN ticket t ON a.IDTicket = t.id
                LEFT JOIN categoria c ON t.IDCategoria = c.id
                LEFT JOIN estado e ON t.IDEstado = e.id   -- 🔹 join con tabla estado
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

    public function asignarManual()
    {
        try {
            $ticketId      = intval($_POST['ticketId'] ?? 0);
            $tecnicoId     = intval($_POST['tecnicoId'] ?? 0);
            $justificacion = $_POST['justificacion'] ?? '';
            $imagenUrl     = $_FILES['imagen']['name'] ?? null;

            if (!$ticketId || !$tecnicoId || !$justificacion) {
                throw new Exception("Faltan parámetros obligatorios.");
            }

            // Validar ticket en estado Pendiente
            $sqlTicket = "SELECT IDEstado, IDCategoria, IDUsuario FROM ticket WHERE id = $ticketId";
            $ticket = $this->enlace->executeSQL($sqlTicket, "obj");
            if (empty($ticket) || intval($ticket[0]->IDEstado) !== 1) {
                throw new Exception("Solo se pueden asignar tickets en estado Pendiente.");
            }
            $categoriaId = intval($ticket[0]->IDCategoria);
            $usuarioId   = intval($ticket[0]->IDUsuario);

            // Actualizar estado de ticket y validación de técnico asignado
            $sqlUpdate = "UPDATE ticket SET IDEstado = 2, IDTecnico = $tecnicoId WHERE id = $ticketId";
            $this->enlace->executeSQL_DML($sqlUpdate);

            // Insertar historial
            $sqlHistorial = "INSERT INTO Historial_ticket 
            (IDticket, from_state, to_state, cambiado_por, comentario, Creado_el)
            VALUES ($ticketId, 1, 2, $usuarioId, '" . addslashes($justificacion) . "', NOW())";
            $historialId = $this->enlace->executeSQL_DML_last($sqlHistorial);

            // Insertar imagen si es que hay una
            if (!empty($_FILES['imagen']['tmp_name'])) {
                $fileName = basename($_FILES['imagen']['name']);
                $destPath = __DIR__ . "/uploads/" . $fileName;

                if (move_uploaded_file($_FILES['imagen']['tmp_name'], $destPath)) {
                    $sqlImagen = "INSERT INTO Imagen (IDHistorial, url) 
                              VALUES ($historialId, '" . addslashes($fileName) . "')";
                    $this->enlace->executeSQL_DML($sqlImagen);
                }
            }

            // Insertar asignación
            $sqlAsignacion = "INSERT INTO asignacion 
            (IDTicket, IDTecnico, asignado_por, method, descripcion)
            VALUES ($ticketId, $tecnicoId, $usuarioId, 'manual', '" . addslashes($justificacion) . "')";
            $this->enlace->executeSQL_DML($sqlAsignacion);

            return ["success" => true, "message" => "Ticket asignado manualmente."];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getTicketsPendientes()
    {
        try {
            $vSql = "SELECT t.id, t.Titulo, t.descripcion, t.IDCategoria, 
                    c.nombre AS nombreCategoria,
                    t.IDPrioridad, 
                    p.nombre AS prioridad_nombre,
                    t.sla_resol_deadline, 
                    t.creado_en
                 FROM ticket t
                 LEFT JOIN categoria c ON t.IDCategoria = c.id
                 LEFT JOIN prioridad p ON t.IDPrioridad = p.id
                 WHERE t.IDEstado = 1 AND t.activo = 1";

            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return ["success" => true, "data" => $vResultado];
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

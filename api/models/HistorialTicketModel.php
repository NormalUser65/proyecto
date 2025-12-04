
<?php
class HistorialTicketModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /* Registrar cambio de estado en ticket y guardar historial */
    public function registrarCambioEstado($ticketId, $nuevoEstadoId, $usuarioId, $comentario = null, $imagenes = [])
    {
        try {
            // Obtener estado actual del ticket y técnico asignado
            $sqlTicket = "SELECT IDEstado, IDTecnico FROM ticket WHERE id = " . intval($ticketId);
            $ticketData = $this->enlace->executeSQL($sqlTicket, "obj");
            if (empty($ticketData)) {
                throw new Exception("Ticket no encontrado.");
            }

            $estadoActual = intval($ticketData[0]->IDEstado);
            $tecnicoAsignado = $ticketData[0]->IDTecnico;

            // Flujo permitido
            $flujo = [
                1 => 2, // Pendiente -> Asignado
                2 => 3, // Asignado -> En Proceso
                3 => 4, // En Proceso -> Resuelto
                4 => 5  // Resuelto -> Cerrado
            ];

            if (!isset($flujo[$estadoActual]) || $flujo[$estadoActual] !== $nuevoEstadoId) {
                throw new Exception("Transición no permitida. Flujo: $estadoActual → $nuevoEstadoId no es válido.");
            }

            // Actualizar estado del ticket
            $sqlUpdate = "UPDATE ticket SET IDEstado = $nuevoEstadoId WHERE id = " . intval($ticketId);
            $this->enlace->executeSQL_DML($sqlUpdate);

            // Insertar historial
            $sqlHistorial = "INSERT INTO Historial_ticket 
            (IDticket, from_state, to_state, cambiado_por, comentario, Creado_el) 
            VALUES (
            $ticketId,
            $estadoActual,
            $nuevoEstadoId,
            $usuarioId,
            " . ($comentario ? "'" . addslashes($comentario) . "'" : "NULL") . ", NOW())";
            $historialId = $this->enlace->executeSQL_DML_last($sqlHistorial);

            // Insertar imágenes si existen
            if (!empty($imagenes) && is_array($imagenes)) {
                foreach ($imagenes as $imgUrl) {
                    $sqlImg = "INSERT INTO Imagen (IDHistorial, url) VALUES ($historialId, '" . addslashes($imgUrl) . "')";
                    $this->enlace->executeSQL_DML($sqlImg);
                }
            }

            return ["success" => true, "message" => "Estado actualizado y historial registrado."];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function obtenerHistorialPorTicket($ticketId)
    {
        try {
            $sql = "SELECT h.id, h.IDticket, h.from_state, e1.nombre AS estado_anterior,
            h.to_state, e2.nombre AS estado_nuevo,
            h.cambiado_por, u.nombre AS usuario,
            h.comentario, h.Creado_el
            FROM Historial_ticket h
            LEFT JOIN estado e1 ON h.from_state = e1.id
            LEFT JOIN estado e2 ON h.to_state = e2.id
            LEFT JOIN usuario u ON h.cambiado_por = u.id
            WHERE h.IDticket = " . intval($ticketId) . "
            ORDER BY h.Creado_el ASC";

            $historial = $this->enlace->executeSQL($sql, "obj");

            if (!$historial) return [];

            foreach ($historial as &$item) {
                $sqlImg = "SELECT url FROM Imagen WHERE IDHistorial = " . intval($item->id);
                $imagenes = $this->enlace->executeSQL($sqlImg, "obj");

                $item->imagenes = is_array($imagenes)
                    ? array_map(fn($img) => "http://localhost:81/proyecto/api/uploads/" . $img->url, $imagenes)
                    : [];
            }



            return $historial;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

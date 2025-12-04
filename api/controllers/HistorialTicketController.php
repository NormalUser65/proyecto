<?php
class historiales
{
    /* Actualizar estado del ticket y registrar historial*/
    public function actualizarEstado()
    {
        $response = new Response();
        try {
            $request = new Request();
            $inputJSON = $request->getJSON();

            // Datos recibidos
            $ticketId = intval($inputJSON->ticketId ?? 0);
            $nuevoEstadoId = intval($inputJSON->nuevoEstadoId ?? 0);
            $usuarioId = intval($inputJSON->usuarioId ?? 0);
            $comentario = $inputJSON->comentario ?? null;
            $imagenes = $inputJSON->imagenes ?? [];

            // Validación de estado
            if ($ticketId <= 0 || $nuevoEstadoId <= 0 || $usuarioId <= 0) {
                throw new Exception("Datos incompletos para actualizar estado.");
            }

            $model = new HistorialTicketModel();
            $result = $model->registrarCambioEstado($ticketId, $nuevoEstadoId, $usuarioId, $comentario, $imagenes);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /*Obtener historial cronológico del ticket*/
    public function obtenerHistorial($ticketId)
    {
        $response = new Response();
        try {
            $model = new HistorialTicketModel();
            $result = $model->obtenerHistorialPorTicket(intval($ticketId));

            $response->toJSON([
                "success" => true,
                "status" => 200,
                "data" => $result
            ]);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function get($ticketId)
    {
        return $this->obtenerHistorial($ticketId);
    }
}
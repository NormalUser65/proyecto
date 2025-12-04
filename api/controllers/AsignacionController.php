<?php
class asignaciones
{
    public function index()
    {
        $response = new Response();
        try {
            $model = new asignacionModel();
            $result = $model->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        $response = new Response();
        try {
            $model = new asignacionModel();
            $result = $model->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getTicketTecnico($id)
    {
        $response = new Response();
        try {
            $model = new asignacionModel();
            $result = $model->getTicketTecnico($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getTicket($id)
    {
        $response = new Response();
        try {
            $model = new asignacionModel();
            $result = $model->getTicket($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function obtenerTicket($id)
    {
        $response = new Response();
        try {
            $model = new asignacionModel();
            $result = $model->ObtenerTicket($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function obtenerTecnico($id)
    {
        $response = new Response();
        try {
            $model = new asignacionModel();
            $result = $model->ObtenerTecnico($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getNombre($nombre)
    {
        $response = new Response();
        try {
            $model = new asignacionModel();
            $result = $model->getNombre($nombre);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function asignarManual()
    {
        $response = new Response();
        try {
            $ticketId      = intval($_POST['ticketId'] ?? 0);
            $tecnicoId     = intval($_POST['tecnicoId'] ?? 0);
            $justificacion = $_POST['justificacion'] ?? '';
            $imagenUrl     = $_FILES['imagen']['name'] ?? null; 

            if (!$ticketId || !$tecnicoId || !$justificacion) {
                throw new Exception("Faltan parámetros obligatorios.");
            }

            $model = new asignacionModel();
            $result = $model->asignarManual($ticketId, $tecnicoId, $justificacion, $imagenUrl);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

     public function asignarAutomatico()
    {
        $response = new Response();
        try {
            $model = new asignacionModel();
            $result = $model->asignarAutomatico();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function pendientes()
    {
        $response = new Response();
        try {
            $model = new asignacionModel();
            $result = $model->getTicketsPendientes();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

<?php
class AsignacionController
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
}

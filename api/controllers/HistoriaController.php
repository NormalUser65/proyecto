<?php
class HistorialController
{
    public function index()
    {
        $response = new Response();
        try {
            $model = new Historial();
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
            $model = new Historial();
            $result = $model->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getNombre($nombre)
    {
        $response = new Response();
        try {
            $model = new Historial();
            $result = $model->getNombre($nombre);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
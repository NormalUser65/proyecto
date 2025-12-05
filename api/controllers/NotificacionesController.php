<?php
class notificacion
{
    public function index($id)
    {
        $response = new Response();
        try {
            $model = new NotificacionModel();
            $result = $model->all($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function crearNotificacion($objeto)
    {
        $response = new Response();
        try {
            $model = new NotificacionModel();
            $result = $model->crearNotificacion($objeto);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

<?php
class EspecialidadesController
{
    public function index()
    {
        $response = new Response();
        try {
            $model = new EspecialidadModel();
            $result = $model->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function listaEspecialidadTecnico($id)
    {
        $response = new Response();
        try {
            $model = new EspecialidadModel();
            $result = $model->listaEspecialidadTecnico($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getNombre($nombre)
    {
        $response = new Response();
        try {
            $model = new EspecialidadModel();
            $result = $model->getNombre($nombre);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

<?php
class categorias
{
    public function index()
    {
        $response = new Response();
        try {
            $model = new CategoriaModel();
            $result = $model->listadoCategoria();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        $response = new Response();
        try {
            if (!is_numeric($id)) {
                throw new Exception("ID inválido");
            }
            $model = new CategoriaModel();
            $result = $model->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function detalle($id)
    {
        $response = new Response();
        try {
            if (!is_numeric($id)) {
                throw new Exception("ID inválido");
            }
            $model = new CategoriaModel();
            $result = $model->DetalleCategoria($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getPorNombre($nombre)
    {
        $response = new Response();
        try {
            $model = new CategoriaModel();
            $result = $model->getNombre($nombre);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}


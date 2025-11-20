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

    public function getPorEtiqueta($idEtiqueta)
{
    $response = new Response();
    try {
        if (!is_numeric($idEtiqueta)) {
            throw new Exception("ID de etiqueta inválido");
        }
        $model = new CategoriaModel();
        $result = $model->getByEtiqueta($idEtiqueta);

        if (!empty($result)) {
            $response->toJSON([
                "success" => true,
                "status" => 200,
                "data" => $result
            ]);
        } else {
            $response->toJSON([
                "success" => false,
                "status" => 404,
                "message" => "No se encontraron categorías asociadas a la etiqueta"
            ]);
        }
    } catch (Exception $e) {
        handleException($e);
    }
}

    // POST Crear
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();

            $model = new CategoriaModel();
            $result = $model->crearCategoria($inputJSON);

            $response->toJSON([
                "success" => true,
                "message" => "Categoría creada exitosamente",
                "data" => $result
            ]);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // PUT Actualizar
    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();

            $model = new CategoriaModel();
            $result = $model->actualizarCategoria($inputJSON);

            $response->toJSON([
                "success" => true,
                "message" => "Categoría actualizada exitosamente",
                "data" => $result
            ]);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
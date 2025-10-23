<?php
class Categorias
{
    // GET listar
    // localhost:81/appejemplo/api/movie
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $movieM = new CategoriasModel;
            //Método del modelo
            $result = $movieM->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    //GET Obtener 
    // localhost:81/appejemplo/api/movie/1
    public function get($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $movie = new MovieModel();
            //Acción del modelo a ejecutar
            $result = $movie->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }

    public function create()
    {
        try {
            $response = new Response();
            $request = new Request();
            //Obtener JSON de la solicitud
            $inputJSON = $request->getJSON();
            //Instancia de modelo
            $movie = new MovieModel();
            //Método instancia del modelo
            $result = $movie->create($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
}

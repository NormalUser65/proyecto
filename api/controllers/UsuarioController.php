<?php
class Usuario
{
    // GET listar
    // localhost:81/proyecto/api/Usuario
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $UsuarioM = new UsuarioModel;
            //Método del modelo
            $result = $UsuarioM->ListaUsuarios();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    //GET Obtener 
    // localhost:81/appejemplo/api/Usuario/1
    public function ListaTecnicos()
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $Usuario = new UsuarioModel();
            //Acción del modelo a ejecutar
            $result = $Usuario->ListaTecnicos();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }

    public function ListaDetalleTecnicos($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $Usuario = new UsuarioModel();
            //Acción del modelo a ejecutar
            $result = $Usuario->ListaDetalleTecnicos($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $Usuario = new UsuarioModel();
            //Acción del modelo a ejecutar
            $result = $Usuario->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }

    public function obtenerusuarioPorId($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $Usuario = new UsuarioModel();
            //Acción del modelo a ejecutar
            $result = $Usuario->obtenerusuarioPorId($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }

    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            error_log("DEBUG: " . print_r($inputJSON, true));
            //Instancia del modelo
            $Usuario = new UsuarioModel();
            //Acción del modelo a ejecutar
            $result = $Usuario->ActualizarTecnico($inputJSON);
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
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $Usuario = new UsuarioModel();
            //Acción del modelo a ejecutar
            $result = $Usuario->CrearTecnico($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }

}
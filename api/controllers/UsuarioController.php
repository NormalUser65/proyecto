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

            // Obtener json enviado
            $inputJSON = $request->getJSON();

            // Instancia del modelo
            $Usuario = new UsuarioModel();

            // Acción del modelo a ejecutar
            $result = $Usuario->CrearTecnico($inputJSON);

            error_log("DEBUG UsuarioController create ejecutado");
            error_log("DEBUG inputJSON: " . print_r($inputJSON, true));

            // Dar respuesta uniforme
            return $response->toJSON($result);
        } catch (Exception $e) {
            $response = new Response();
            return $response->toJSON([
                "success" => false,
                "status" => 500,
                "message" => $e->getMessage(),
                "data" => null
            ]);
        }
    }


    public function verificarEmail($email)
    {
        try {
            $response = new Response();
            $UsuarioM = new UsuarioModel();
            $existe = $UsuarioM->verificarEmail($email);

            return $response->toJSON([
                "success" => true,
                "status" => 200,
                "email" => $email,
                "existe" => $existe
            ]);
        } catch (Exception $e) {
            $response = new Response();
            return $response->toJSON([
                "success" => false,
                "status" => 500,
                "message" => $e->getMessage()
            ]);
        }
    }

    public function getTecnicosPorCategoria()
    {
        $response = new Response();
        try {
            // Obtener el parámetro desde la request (ej. GET ?categoriaId=3)
            $categoriaId = intval($_GET['categoriaId'] ?? 0);

            if (!$categoriaId) {
                throw new Exception("Debe indicar una categoría válida.");
            }

            // Instanciar el modelo
            $model = new UsuarioModel();
            $result = $model->getTecnicosPorCategoria($categoriaId);

            // Devolver en formato JSON
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

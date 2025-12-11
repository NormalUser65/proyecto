<?php
class gestion
{
    // GET: lista todos los usuarios
    public function index()
    {
        $response = new Response();
        try {
            $model = new GestionUsuarioModel();
            $result = $model->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // GET: obtiene un usuario por ID
    public function get($id)
    {
        $response = new Response();
        try {
            if (!is_numeric($id)) {
                throw new Exception("ID inválido");
            }
            $model = new GestionUsuarioModel();
            $result = $model->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // GET: lista solo clientes
    public function customers()
    {
        $response = new Response();
        try {
            $model = new GestionUsuarioModel();
            $result = $model->allCustomer();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // GET: clientes por tienda
    public function customersByShop($idShop)
    {
        $response = new Response();
        try {
            if (!is_numeric($idShop)) {
                throw new Exception("ID de tienda inválido");
            }
            $model = new GestionUsuarioModel();
            $result = $model->customerByShopRental($idShop);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // POST: login de usuario
    public function login()
    {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();

            $model = new GestionUsuarioModel();
            $result = $model->login($inputJSON);

            if ($result) {
                $response->toJSON([
                    "success" => true,
                    "token" => $result['token'],
                    "usuario" => $result['usuario']
                ]);
            } else {
                $response->toJSON([
                    "success" => false,
                    "status" => 401,
                    "message" => "Credenciales inválidas"
                ]);
            }
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // POST: crear usuario
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();

            $model = new GestionUsuarioModel();
            $result = $model->create($inputJSON);

            $response->toJSON([
                "success" => true,
                "message" => "Usuario creado exitosamente",
                "data" => $result
            ]);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

<?php
class tickets
{
    public function index()
    {
        $response = new Response();
        try {
            $model = new TicketModel();
            $result = $model->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
    public function ObtenerPorID($id)
    {
        $response = new Response();
        try {
            $model = new TicketModel();
            $result = $model->ObtenerPorID($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function cantTrabajoTecnico($id)
    {
        $response = new Response();
        try {
            $model = new TicketModel();
            $result = $model->CantTrabajoTecnico($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getNombre($nombre)
    {
        $response = new Response();
        try {
            $model = new TicketModel();
            $result = $model->getNombre($nombre);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
    public function create() {
    $response = new Response();
    try {
        $data = json_decode(file_get_contents("php://input"));
        if (!$data) {
            throw new Exception("No se recibió JSON válido");
        }

        $model = new TicketModel();
        $result = $model->crearTicket($data);

        $response->toJSON([
            "success" => true,
            "status" => 201,
            "data" => $result
        ]);
    } catch (Exception $e) {
        handleException($e);
    }
}

}
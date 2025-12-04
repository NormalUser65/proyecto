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
    
    public function create()
{
    try {
        $request = new Request();
        $inputJSON = $request->getJSON();

        $model = new TicketModel();
        $result = $model->crearTicket($inputJSON);

        $response = new Response();
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
<?php
class prioridades {
    public function index() {
        $response = new Response();
        try {
            $model = new PrioridadModel();
            $result = $model->all();
            $response->toJSON([
                "success" => true,
                "status" => 200,
                "data" => $result
            ]);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id) {
        $response = new Response();
        try {
            $model = new PrioridadModel();
            $result = $model->getById($id);
            $response->toJSON([
                "success" => true,
                "status" => 200,
                "data" => $result
            ]);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
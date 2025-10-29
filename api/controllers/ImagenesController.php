<?php
class ImagenController
{
    public function getImageMovie($id)
    {
        $response = new Response();
        try {
            $model = new ImagenModel();
            $result = $model->getImageMovie($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

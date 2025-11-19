<?php
class PrioridadModel {
    public $enlace;
    public function __construct() {
        $this->enlace = new MySqlConnect();
    }

    public function all() {
        try {
            $sql = "SELECT * FROM prioridad;";
            return $this->enlace->ExecuteSQL($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getById($id) {
        try {
            $sql = "SELECT * FROM prioridad WHERE id = $id;";
            $result = $this->enlace->ExecuteSQL($sql);
            return $result[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
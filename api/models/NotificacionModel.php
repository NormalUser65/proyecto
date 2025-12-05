<?php
class NotificacionModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    /*Obtiene todas las notificaciones por medio del ID del usuario que está logeado */
    public function all($id)
    {
        try {
            //Consulta sql
            $vSql = "SELECT * FROM notificacion WHERE IDCliente = $id ORDER BY Fecha_creacion DESC;";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    /*Obtener por email*/
    public function crearNotificacion($objeto)
{
    try {
        $sql = "INSERT INTO notificacion (IDCliente, IDAdmin, IDTicket, tipo, mensaje, Estado)
        VALUES ($objeto->IDCliente, $objeto->IDAdmin, $objeto->IDTicket, '$objeto->tipo', '$objeto->mensaje', '$objeto->Estado');";

        $lastId = $this->enlace->executeSQL_DML_last($sql);
        return $this->enlace->ExecuteSQL("SELECT * FROM notificacion WHERE id = $lastId");

    } catch (Exception $e) {
        handleException($e);
    }
}


}
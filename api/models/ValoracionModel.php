<?php
class ValoracionModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    /*Listar */
    public function all()
    {
        try {
            //Consulta sql
            $vSql = "SELECT * FROM especialidad;";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }


    /*Listar los puntajes de mayor a menor*/
    public function allDESC()
    {
        try {
            //Consulta sql
            $vSql = "SELECT * FROM especialidad ORDER BY score DESC";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /*Listar los puntajes  de menor a mayor*/
    public function allASC()
    {
        try {
            //Consulta sql
            $vSql = "SELECT * FROM especialidad ORDER BY score ASC";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /*Listar los puntajes de un ID especifico de mayor a menor*/
    public function getDESC($id)
    {
        try {
            //Consulta sql
            $vSql = "SELECT * FROM especialidad WHERE ticket_id=$id ORDER BY score DESC";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /*Listar los puntajes de un ID especifico de menor a mayor*/
    public function getASC($id)
    {
        try {
            //Consulta sql
            $vSql = "SELECT * FROM especialidad WHERE ticket_id=$id ORDER BY score ASC";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /*Obtener por email*/
    public function get($id)
    {
        try {
            //Consulta sql
            $vSql = "SELECT * FROM especialidad where id=$id";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /*Obtener por el nombre*/
    public function getCliente($id)
    {
        try {
            //Consulta sql
            $vSql = "SELECT * FROM valoracion where cliente_id=$id";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /*Listar de más reciente a más viejos*/
    public function ListaRecientes()
    {
        try {
            //Consulta sql
            $vSql = "SELECT * FROM valoracion ORDER BY creado_en DESC;";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /*Listar de los más viejos a los más recientes */
    public function ListaViejos()
    {
        try {
            //Consulta sql
            $vSql = "SELECT * FROM valoracion ORDER BY creado_en ASC;";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
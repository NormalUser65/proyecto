<?php
class UsuarioModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /* Listar todos los usuarios */
    public function ListaUsuarios()
    {
        try {
            // Consulta SQL
            $vSql = "SELECT u.id,u.nombre,u.email, r.nombre AS rol FROM usuario u INNER JOIN rol r ON u.IDRol = r.id;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /*Lista con los datos de los t[ecnicos] esto es lo que se va a usar para generar las cartas*/
    public function ListaTecnicos()
    {
        try {
            $vSql = 'SELECT u.id AS IDTecnico, u.nombre AS NombreTecnico, u.email, u.disponibilidad,
        GROUP_CONCAT(DISTINCT e.nombre SEPARATOR ", ") AS Especialidades,
        COUNT(DISTINCT t.id) AS TicketsActivos
        FROM usuario u
        LEFT JOIN Tecnico_especialidad te ON te.IDTecnico = u.id
        LEFT JOIN especialidad e ON e.id = te.IDEspecialidad
        LEFT JOIN ticket t ON t.IDTecnico = u.id AND t.activo = 1
        WHERE u.IDRol = 2
        GROUP BY u.id, u.nombre, u.email, u.disponibilidad;';

            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //Esta funcion es la que se va a usar para generar el detalle de los tecnicos
    public function ListaDetalleTecnicos($id)
    {
        try {
            $EspecialidadM = new EspecialidadModel();

            $vSql = "SELECT u.contrasenna, u.id AS IDTecnico, u.nombre AS NombreTecnico, u.email, u.disponibilidad,
        GROUP_CONCAT(DISTINCT e.nombre SEPARATOR ', ') AS Especialidades,
        COUNT(DISTINCT t.id) AS TicketsActivos
        FROM usuario u
        LEFT JOIN Tecnico_especialidad te ON te.IDTecnico = u.id
        LEFT JOIN especialidad e ON e.id = te.IDEspecialidad
        LEFT JOIN ticket t ON t.IDTecnico = u.id AND t.activo = 1
        WHERE u.IDRol = 2 AND u.id = $id
        GROUP BY u.id, u.nombre, u.email, u.disponibilidad;";

            $vResultado = $this->enlace->ExecuteSQL($vSql);

            if (!empty($vResultado)) {
                $tecnico = $vResultado[0];
                $listaEspecialidades = $EspecialidadM->listaEspecialidadTecnico($tecnico->IDTecnico);
                $tecnico->ListaEsp = $listaEspecialidades;
            }
            return $tecnico;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function ActualizarTecnico($objeto)
    {
        try {
            $Sql = "Update usuario SET 
            nombre = '$objeto->NombreTecnico',
            email = '$objeto->email',
            contrasenna = '$objeto->Contrasenna',
            disponibilidad = '$objeto->Estado'
            Where id=$objeto->IDTecnico";
            $vResultado = $this->enlace->ExecuteSQL_DML($Sql);

            $Sql = "Delete from Tecnico_especialidad where IDTecnico=$objeto->IDTecnico";
            $vResultadoD = $this->enlace->executeSQL_DML($Sql);

            if (!empty($objeto->Especialidades)) {
                foreach ($objeto->Especialidades as $item) {
                    $item = intval($item);
                    $Sql = "INSERT INTO Tecnico_especialidad (IDTecnico, IDEspecialidad)
                        VALUES ($objeto->IDTecnico, $item)";
                    $vResultadoG = $this->enlace->executeSQL_DML($Sql);
                }
            }
            return $this->ListaDetalleTecnicos($objeto->IDTecnico);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function CrearTecnico($objeto)
    {
        try {
            // Normalizar correo
            $emailNorm = strtolower(trim($objeto->email));

            // Validar si el correo ya existe directamente aquí
            $SqlCheck = "SELECT COUNT(*) as total FROM usuario WHERE email = '$emailNorm'";
            $resultadoCheck = $this->enlace->ExecuteSQL($SqlCheck);

            if (!empty($resultadoCheck)) {
                $first = $resultadoCheck[0];
                $total = is_array($first) ? intval($first['total'] ?? 0) : intval($first->total ?? 0);

                if ($total > 0) {
                    // Correo ya existe → devolver error claro
                    return [
                        "success" => false,
                        "message" => "El correo ya está registrado",
                        "data" => null
                    ];
                }
            }

            // Encriptar contraseña
            $hashedPassword = password_hash($objeto->Contrasenna, PASSWORD_BCRYPT);

            // Insertar técnico
            $Sql = "INSERT INTO usuario (email, contrasenna, nombre, IDRol, language, activo, disponibilidad)
                VALUES ('$emailNorm', '$hashedPassword', '$objeto->NombreTecnico', 2, 'es', 1, 'disponible')";
            $idTecnico = $this->enlace->executeSQL_DML_last($Sql);

            // Insertar especialidades
            if (!empty($objeto->Especialidades)) {
                foreach ($objeto->Especialidades as $item) {
                    $item = intval($item);
                    $Sql = "INSERT INTO Tecnico_especialidad (IDTecnico, IDEspecialidad)
                        VALUES ($idTecnico, $item)";
                    $this->enlace->executeSQL_DML($Sql);
                }
            }

            return [
                "success" => true,
                "message" => "Técnico creado correctamente",
                "data" => $this->ListaDetalleTecnicos($idTecnico)
            ];
        } catch (Exception $e) {
            handleException($e);
            return [
                "success" => false,
                "message" => "Error al crear técnico",
                "data" => null
            ];
        }
    }



    public function verificarEmail($email)
    {
        try {
            // Normalizar correo
            $emailNorm = strtolower(trim($email));

            // Consulta directa
            $vSql = "SELECT COUNT(*) as total FROM usuario WHERE email = '$emailNorm'";
            $vResultado = $this->enlace->ExecuteSQL($vSql);

            if (empty($vResultado)) return false;

            $first = $vResultado[0];
            $total = is_array($first) ? intval($first['total'] ?? 0) : intval($first->total ?? 0);

            // Devuelve true si ya existe, false si está disponible
            return $total > 0;
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }





    /* Obtener por email */
    public function get($email)
    {
        try {
            // Evitar inyección SQL — se usa comillas
            $vSql = "SELECT * FROM usuario WHERE email = '$email'";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //Para la validación en el fronend de crear el usuario para saber si ya está registrado el correo
    public function ValEmail($email)
    {
        try {
            $vSql = "SELECT COUNT(*) as total FROM usuario WHERE email = ?";
            $resultado = $this->enlace->executeSQL_DML($vSql, [$email]);
            return $resultado[0]['total'] > 0;
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }



    public function obtenerusuarioPorId($id)
    {
        try {
            // Evitar inyección SQL — se usa comillas
            $vSql = "SELECT * FROM usuario WHERE id = '$id'";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /* Obtener por tipo de rol */
    public function getRol($IdRol)
    {
        try {
            $vSql = "SELECT * FROM usuario WHERE IDRol = $IdRol";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getTecnicosPorCategoria($categoriaId)
    {
        try {
            $vSql = "SELECT u.id, u.nombre, GROUP_CONCAT(e.nombre SEPARATOR ', ') AS especialidades,
            (SELECT COUNT(*) 
            FROM ticket t 
            WHERE t.IDTecnico = u.id 
            AND t.IDEstado IN (2,3)) AS carga
            FROM usuario u
            INNER JOIN Tecnico_especialidad te ON u.id = te.IDTecnico
            INNER JOIN especialidad e ON te.IDEspecialidad = e.id
            INNER JOIN especialidad_categoria ec ON e.id = ec.IDEspecialidad
            WHERE u.activo = 1
            AND ec.IDCategoria = $categoriaId
            GROUP BY u.id, u.nombre
            HAVING carga <= 5";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return ["success" => true, "data" => $vResultado];
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

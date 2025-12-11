<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class GestionUsuarioModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    // Retorna todos los usuarios registrados
    public function all()
    {
        try {
            $sql = "SELECT u.id, u.email, u.nombre, u.IDRol, r.nombre AS rol, u.language, u.activo, u.disponibilidad
                    FROM usuario u
                    INNER JOIN rol r ON u.IDRol = r.id";
            return $this->enlace->ExecuteSQL($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Obtiene un usuario por ID e incluye su rol
    public function get($id)
    {
        try {
            $sql = "SELECT u.id, u.email, u.nombre, u.IDRol, r.nombre AS rol, u.language, u.activo, u.disponibilidad
                    FROM usuario u
                    INNER JOIN rol r ON u.IDRol = r.id
                    WHERE u.id = $id";
            $resultado = $this->enlace->ExecuteSQL($sql);
            return $resultado[0] ?? null;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Lista solo usuarios con rol cliente
    public function allCustomer()
    {
        try {
            $sql = "SELECT u.id, u.email, u.nombre, u.IDRol, r.nombre AS rol
                    FROM usuario u
                    INNER JOIN rol r ON u.IDRol = r.id
                    WHERE r.nombre = 'Cliente'";
            return $this->enlace->ExecuteSQL($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Obtiene clientes pertenecientes a una tienda específica
    public function customerByShopRental($idShop)
    {
        try {
            $sql = "SELECT u.id, u.email, u.nombre, u.IDRol, r.nombre AS rol
                    FROM usuario u
                    INNER JOIN rol r ON u.IDRol = r.id
                    INNER JOIN shop_rental sr ON u.id = sr.IDUsuario
                    WHERE sr.IDShop = $idShop";
            return $this->enlace->ExecuteSQL($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Login: verifica credenciales y retorna un token JWT
    public function login($objeto)
    {
        try {
            $email = $objeto->email;
            $password = $objeto->password;

            $sql = "SELECT u.id, u.email, u.contrasenna, u.nombre, r.nombre AS rol
                    FROM usuario u
                    INNER JOIN rol r ON u.IDRol = r.id
                    WHERE u.email = '$email' AND u.activo = 1";
            $resultado = $this->enlace->ExecuteSQL($sql);

            if (!empty($resultado)) {
                $usuario = $resultado[0];
                // Verificar contraseña
                if (password_verify($password, $usuario->contrasenna)) {
                    $data = [
                        'id' => $usuario->id,
                        'email' => $usuario->email,
                        'rol' => ['name' => $usuario->rol],
                        'iat' => time(),
                        'exp' => time() + 3600
                    ];
                    $jwt_token = JWT::encode($data, config::get('SECRET_KEY'), 'HS256');
                    return ['token' => $jwt_token, 'usuario' => $usuario];
                }
            }
            return null;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Crear usuario con contraseña encriptada
    public function create($objeto)
    {
        try {
            $hashedPassword = password_hash($objeto->contrasenna, PASSWORD_BCRYPT);
            $sql = "INSERT INTO usuario (email, contrasenna, nombre, IDRol, language, activo, disponibilidad)
                    VALUES ('$objeto->email', '$hashedPassword', '$objeto->nombre', $objeto->IDRol, 
                            '$objeto->language', 1, 'disponible')";
            $idUsuario = $this->enlace->executeSQL_DML_last($sql);
            return $this->get($idUsuario);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
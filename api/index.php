<?php
// Composer autoloader
require_once __DIR__ . '/vendor/autoload.php';
/*Encabezada de las solicitudes*/
/*CORS*/
header("Access-Control-Allow-Origin: * ");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header('Content-Type: application/json');

/*--- Requerimientos Clases o librerías*/
require_once "controllers/core/Config.php";
require_once "controllers/core/HandleException.php";
require_once "controllers/core/Logger.php";
require_once "controllers/core/MySqlConnect.php";
require_once "controllers/core/Request.php";
require_once "controllers/core/Response.php";
//Middleware
require_once "middleware/AuthMiddleware.php";

/***--- Agregar todos los modelos*/
require_once "models/AsignacionModel.php";
require_once "models/AutotriageModel.php";
require_once "models/CategoriaModel.php";
require_once "models/EspecialidadModel.php";
require_once "models/EtiquetaModel.php";
require_once "models/HistoriaModel.php";
require_once "models/ImagenModel.php";
require_once "models/NotificacionModel.php";
require_once "models/rolModel.php";
require_once "models/SlaModel.php";
require_once "models/TicketModel.php";
require_once "models/UsuarioModel.php";



/***--- Agregar todos los controladores*/
require_once "controllers/AsignacionController.php";
require_once "controllers/AutotriageController.php";
require_once "controllers/CategoriasController.php";
require_once "controllers/EtiquetaController.php";
require_once "controllers/EspecialidadesController.php";
require_once "controllers/HistoriaController.php";
require_once "controllers/ImagenesController.php";
require_once "controllers/NotificacionesController.php";
require_once "controllers/RolesController.php";
require_once "controllers/SlaController.php";
require_once "controllers/TicketsController.php";
require_once "controllers/UsuarioController.php";
<<<<<<< HEAD
//require_once "controllers/EspecialidadController.php";
=======
>>>>>>> ef3a9ab56ab4f626f061802468ce5465c0423b69

//Enrutador
require_once "routes/RoutesController.php";
$index = new RoutesController();
$index->index();




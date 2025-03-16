<?php

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, Authorization, X-Requested-With, Accept');
header('Access-Control-Allow-Credentials: true');

require 'vendor/autoload.php';
require './helpers/generateNewToken.php';
require './helpers/checkToken.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

$requestBody = file_get_contents("php://input");
$data = [
    'username' => isset($_COOKIE['username']) ? $_COOKIE['username'] : null,
    'session_id' => isset($_COOKIE['session_id']) ? $_COOKIE['session_id'] : null
];

if ($method === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Verbindung zu MongoDB herstellen
try {
    $dbClient = new MongoDB\Client($_ENV['MONGODB_URI']);
    $collection = $dbClient->game_data->countries;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Datenbank Verbindung konnte nicht hergestellt werden.', 'message' => $e->getMessage()]);
    exit();
}

$parsedUrl = parse_url($uri);
$path = $parsedUrl['path'];
$query = isset($parsedUrl['query']) ? $parsedUrl['query'] : '';

$uriParts = array_filter(explode('/', $path));
parse_str($query, $params);

if (!empty($params) && !is_array($params)) {
    http_response_code(400);
    echo json_encode(['error' => 'Ungültige Parameter.']);
    exit();
}

// Bereinigen und validieren Sie die Parameter dynamisch
$cleanParams = [];
foreach ($params as $key => $value) {
    if (!empty($value)) {
        $cleanParams[$key] = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    }
}

$params = $cleanParams;

// Überprüfen Sie, ob die URI mindestens drei Teile hat (z.B. /api/game_data/countries)
if (count($uriParts) < 3) {
    // Geben Sie eine 400-Fehlermeldung zurück, wenn die URI ungültig ist
    http_response_code(400);
    echo json_encode(['error' => 'Ungültige URI']);
    exit();
}

$uriParts = array_values($uriParts);
$apiFolder = $uriParts[0];
$dataFolder = $uriParts[1];
$functionFile = $uriParts[2];

if ($apiFolder !== 'api') {
    http_response_code(404);
    echo json_encode(['error' => 'API nicht gefunden']);
    exit();
}

if ($functionFile !== 'login' && $functionFile !== 'register' && (empty($data['username']) || empty($data['session_id'])) && $functionFile !== 'sendTestEmail') {
    http_response_code(401);
    echo json_encode(['error' => 'Fehlende authentifizierungsdaten']);
    exit();
}

if ($functionFile !== 'login' && $functionFile !== 'register' && $functionFile !== 'sendTestEmail') {
    checkToken($data['session_id'], $data['username']);
}

$returnValue = [];

// Erstellen Sie den Pfad zur entsprechenden Datei
$filePath = __DIR__ . "/$apiFolder/$dataFolder/$functionFile.php";

// Überprüfen Sie, ob die Datei existiert
if (!file_exists($filePath)) {
    // Geben Sie eine 404-Fehlermeldung zurück, wenn die Datei nicht gefunden wurde
    http_response_code(404);
    echo json_encode(['error' => 'Datei nicht gefunden']);
}

$requestBody = file_get_contents('php://input');

global $params, $dbClient, $data;

// Schließen Sie die Datei ein, um die Funktion aufzurufen
include $filePath;

switch ($method) {
    case 'GET':
        $returnValue += getRequest();
        break;
    case 'POST':
        $returnValue += postRequest();
        if ($functionFile !== 'login' && $functionFile !== 'register') {
            $returnValue += ["session_id" => generateNewToken($data['session_id'], $data['username'])];
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Methode nicht erlaubt']);
        break;
}

if (!empty($returnValue)) {
    http_response_code(200);
    echo json_encode($returnValue);
}
exit();

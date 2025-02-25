<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, Authorization, X-Requested-With, Accept');

require 'vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

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
    echo json_encode(['error' => 'Failed to connect to MongoDB', 'message' => $e->getMessage()]);
    return;
}

$parsedUrl = parse_url($uri);
$path = $parsedUrl['path'];
$query = isset($parsedUrl['query']) ? $parsedUrl['query'] : '';

$uriParts = array_filter(explode('/', $path));
parse_str($query, $params);

if (!empty($params) && !is_array($params)) {
    http_response_code(400);
    echo json_encode(['error' => 'Could not parse query string']);
    return;
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
    echo json_encode(['error' => 'Invalid URI']);
    return;
}

$uriParts = array_values($uriParts);
$apiFolder = $uriParts[0];
$dataFolder = $uriParts[1];
$functionFile = $uriParts[2];

if ($apiFolder !== 'api') {
    http_response_code(404);
    echo json_encode(['error' => 'API not found']);
    return;
}

// Erstellen Sie den Pfad zur entsprechenden Datei
$filePath = __DIR__ . "/$apiFolder/$dataFolder/$functionFile.php";

// Überprüfen Sie, ob die Datei existiert
if (!file_exists($filePath)) {
    // Geben Sie eine 404-Fehlermeldung zurück, wenn die Datei nicht gefunden wurde
    http_response_code(404);
    echo json_encode(['error' => 'File not found']);
}

$requestBody = file_get_contents('php://input');

global $params, $dbClient;

// Schließen Sie die Datei ein, um die Funktion aufzurufen
include $filePath;

switch ($method) {
    case 'GET':
        getRequest();
        break;
    case 'POST':
        postRequest();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

exit();

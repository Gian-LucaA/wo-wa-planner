<?php

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, Authorization, X-Requested-With, Accept');
header('Access-Control-Allow-Credentials: true');

require 'vendor/autoload.php';
require './helpers/generateNewToken.php';
require './helpers/checkToken.php';
require_once __DIR__ . '/logging/logger.php';

$logger = new Logger();
$logger->info("Incoming request: {$_SERVER['REQUEST_METHOD']} {$_SERVER['REQUEST_URI']}");

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

$requestBody = file_get_contents("php://input");
$logger->info("Request body received: " . ($requestBody ?: 'No body content'));

$data = [
    'username' => $_COOKIE['username'] ?? null,
    'session_id' => $_COOKIE['session_id'] ?? null
];

if ($method === 'OPTIONS') {
    $logger->info("CORS preflight request received. Returning 204.");
    http_response_code(204);
    exit();
}

// Verbindung zu MongoDB herstellen
try {
    $dbClient = new MongoDB\Client($_ENV['MONGODB_URI']);
    $collection = $dbClient->game_data->countries;
    $logger->info("Connected to MongoDB successfully.");
} catch (Exception $e) {
    $logger->error("Failed to connect to MongoDB: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Datenbank Verbindung konnte nicht hergestellt werden.', 'message' => "Interner Fehler!"]);
    exit();
}

$parsedUrl = parse_url($uri);
$path = $parsedUrl['path'];
$query = $parsedUrl['query'] ?? '';

$uriParts = array_filter(explode('/', $path));
parse_str($query, $params);

if (!empty($params) && !is_array($params)) {
    $logger->warning("Invalid query parameters: $query");
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
$logger->info("Cleaned parameters: " . json_encode($params));

// Überprüfen Sie, ob die URI mindestens drei Teile hat
if (count($uriParts) < 3) {
    $logger->warning("Invalid URI structure: $path");
    http_response_code(400);
    echo json_encode(['error' => 'Ungültige URI']);
    exit();
}

$uriParts = array_values($uriParts);
$apiFolder = $uriParts[0];
$dataFolder = $uriParts[1];
$functionFile = $uriParts[2];

if ($apiFolder !== 'api') {
    $logger->warning("Non-API call attempted: $path");
    http_response_code(404);
    echo json_encode(['error' => 'API nicht gefunden']);
    exit();
}

if ($functionFile !== 'login' && $functionFile !== 'register' && (empty($data['username']) || empty($data['session_id'])) && $functionFile !== 'sendMail') {
    $logger->warning("Unauthorized access attempt to $functionFile with missing credentials.");
    http_response_code(401);
    echo json_encode(['error' => 'Fehlende authentifizierungsdaten']);
    exit();
}

$sessionId = null;
if ($functionFile !== 'login' && $functionFile !== 'register' && $functionFile !== 'sendMail') {
    $sessionId = checkToken($data['session_id'], $data['username']);
    $logger->info("Session validated for user: " . $data['username']);

    $isAdmin = checkIfTokenIsAdmin($sessionId);
    if ($isAdmin) {
        $logger->info($data['username'] . " hat ADMIN rechte!");
    }
}

$returnValue = [];

if (!preg_match('/^[a-zA-Z0-9_-]+$/', $dataFolder) || !preg_match('/^[a-zA-Z0-9_-]+$/', $functionFile)) {
    $logger->warning("Ungültige Zeichen in API-Route: $dataFolder/$functionFile");
    http_response_code(400);
    echo json_encode(['error' => 'Ungültige API-Route']);
    exit();
}

// Dynamische Whitelist für $dataFolder
$apiBase = __DIR__ . '/api';
$dataFolders = array_filter(scandir($apiBase), function ($dir) use ($apiBase) {
    return is_dir("$apiBase/$dir") && $dir !== '.' && $dir !== '..';
});

// Dynamische Whitelist für $functionFile im gewählten $dataFolder
$functionFiles = [];
if (in_array($dataFolder, $dataFolders)) {
    $folderPath = "$apiBase/$dataFolder";
    foreach (glob("$folderPath/*.php") as $file) {
        $functionFiles[] = basename($file, '.php');
    }
}

// Prüfung
if (!in_array($dataFolder, $dataFolders) || !in_array($functionFile, $functionFiles)) {
    $logger->warning("API endpoint not found: $dataFolder/$functionFile");
    http_response_code(404);
    echo json_encode(['error' => 'API nicht gefunden']);
    exit();
}

// Erstellen Sie den Pfad zur entsprechenden Datei
$filePath = __DIR__ . "/$apiFolder/$dataFolder/$functionFile.php";

if (!file_exists($filePath)) {
    $logger->error("API handler not found: $filePath");
    http_response_code(404);
    echo json_encode(['error' => 'Interner Fehler!']);
    exit();
}

$logger->info("Including API handler: $filePath");

global $params, $dbClient, $data, $sessionId, $logger, $isAdmin;

include $filePath;

switch ($method) {
    case 'GET':
        $logger->info("GET request dispatched to $functionFile");
        $returnValue += getRequest();
        break;
    case 'POST':
        $logger->info("POST request dispatched to $functionFile");
        $returnValue += postRequest();
        if ($functionFile !== 'login' && $functionFile !== 'register') {
            $token = generateNewToken($data['session_id'], $data['username']);
            $returnValue += ["session_id" => $token];
            $logger->info("New session token generated for user: " . $data['username']);
        }
        break;
    default:
        $logger->warning("Unsupported HTTP method: $method");
        http_response_code(405);
        echo json_encode(['error' => 'Methode nicht erlaubt']);
        exit();
}

if (!empty($returnValue)) {
    $logger->info("Returning response: " . json_encode($returnValue));
    http_response_code(200);
    echo json_encode($returnValue);
} else {
    $logger->info("No data to return.");
}

exit();

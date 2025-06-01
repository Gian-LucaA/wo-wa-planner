<?php

function getRequest()
{
    global $logger;
    $logger->warning("getRequest called but not supported");
    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
    exit();
}

function postRequest()
{
    global $dbClient, $sessionId, $logger;

    $logger->info("postRequest called", ['sessionId' => $sessionId]);

    $placeCollection = $dbClient->place_data->places;
    $usersCollection = $dbClient->users_data->users;

    $requestingUser = $usersCollection->findOne(['_id' => $sessionId]);
    if (!$requestingUser) {
        $logger->warning("Benutzer nicht gefunden", ['sessionId' => $sessionId]);
        http_response_code(401);
        echo json_encode(['error' => 'Du hast nicht das Recht für diese Operation!']);
        exit();
    }

    if (!isset($requestingUser['isAdmin']) || !$requestingUser['isAdmin']) {
        $logger->warning("Unzureichende Rechte", ['userId' => (string)$requestingUser['_id']]);
        http_response_code(401);
        echo json_encode(['error' => 'Du hast nicht das Recht für diese Operation!']);
        exit();
    }

    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        $logger->error("Ungültige JSON-Daten", ['rawInput' => $rawInput, 'jsonError' => json_last_error_msg()]);
        http_response_code(400);
        echo json_encode(['error' => 'Ungültige JSON-Daten!']);
        exit();
    }

    if (!isset($data['id'])) {
        $logger->warning("Benutzer-ID fehlt im Request", ['data' => $data]);
        http_response_code(400);
        echo json_encode(['error' => 'Benutzer-ID fehlt!']);
        exit();
    }

    if (!isset($data['name'], $data['location'], $data['users'])) {
        $logger->warning("Fehlende erforderliche Felder", ['data' => $data]);
        http_response_code(400);
        echo json_encode(['error' => 'Fehlende Daten!']);
        exit();
    }

    try {
        $updateResult = $placeCollection->updateOne(
            ['_id' => new MongoDB\BSON\ObjectId($data['id'])],
            ['$set' => $data]
        );

        if ($updateResult->getMatchedCount() === 0) {
            $logger->warning("Ort nicht gefunden zum Aktualisieren", ['placeId' => $data['id']]);
            http_response_code(404);
            echo json_encode(['error' => 'Ort nicht gefunden!']);
            exit();
        }

        $logger->info("Ort erfolgreich geändert", ['placeId' => $data['id']]);
        http_response_code(200);
        return ['success' => 'Ort erfolgreich geändert!'];
    } catch (Exception $e) {
        $logger->error("Fehler beim Aktualisieren des Ortes", ['exception' => $e->getMessage()]);
        http_response_code(500);
        echo json_encode(['error' => 'Interner Serverfehler: ' . $e->getMessage()]);
    }
}

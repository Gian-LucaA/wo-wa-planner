<?php

function getRequest()
{
    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
    exit();
}

function postRequest()
{
    global $dbClient, $sessionId, $logger;

    $usersCollection = $dbClient->users_data->users;

    $requestingUser = $usersCollection->findOne(['_id' => $sessionId]);

    if (!isset($requestingUser['isAdmin']) || !$requestingUser['isAdmin']) {
        http_response_code(401);
        echo json_encode(['error' => 'Du hast nicht das Recht für diese Operation!']);
        exit();
    };

    $data = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Ungültige JSON-Daten!']);
        exit();
    }

    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Benutzer-ID fehlt!']);
        exit();
    }

    try {
        $pendingUsersCollection = $dbClient->users_data->pending_users;
        $result = $pendingUsersCollection->deleteOne(['_id' => new MongoDB\BSON\ObjectId($data['id'])]);

        if ($result->getDeletedCount() === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Benutzer nicht gefunden!']);
            exit();
        }

        if (isset($logger)) {
            $logger->info("Pending user deleted", ['user_id' => $data['id'], 'admin_id' => (string)$sessionId]);
        }

        http_response_code(200);
        return ['success' => 'Benutzer erfolgreich abgelehnt!'];
    } catch (Exception $e) {
        if (isset($logger)) {
            $logger->error("Error deleting pending user: " . $e->getMessage(), ['user_id' => $data['id']]);
        }
        http_response_code(500);
        echo json_encode(['error' => 'Interner Serverfehler: ' . $e->getMessage()]);
        exit();
    }
}

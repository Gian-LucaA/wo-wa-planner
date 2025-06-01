<?php

function getRequest()
{
    global $logger;

    $logger->warning("GET request received, but operation is not supported.");
    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
    exit();
}

function postRequest()
{
    global $dbClient, $logger;

    $logger->info("POST request received for login.");

    // Read request body
    $requestBody = file_get_contents("php://input");
    $data = json_decode($requestBody, true);

    if (empty($data['username']) || empty($data['password'])) {
        $logger->warning("Login attempt with missing credentials: " . json_encode($data));
        http_response_code(400);
        echo json_encode(['error' => 'Passwort oder Nutzername nicht ausgefüllt!']);
        exit();
    }

    $logger->info("Attempting login for username: {$data['username']}");

    try {
        $collection = $dbClient->users_data->users;
        $user = $collection->findOne(['username' => $data['username']]);
    } catch (Exception $e) {
        $logger->error("Database error during login: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Interner Serverfehler.']);
        exit();
    }

    if ($user && password_verify($data['password'], $user['password'])) {
        $logger->info("Login successful for user: {$data['username']}");

        $sessionId = bin2hex(random_bytes(64));
        $sessionCollection = $dbClient->users_data->sessions;
        $timeout = new MongoDB\BSON\UTCDateTime(strtotime('+15 minutes') * 1000);

        try {
            $sessionCollection->deleteMany(['user_id' => $user['_id']]);
            $sessionCollection->insertOne([
                'session_id' => $sessionId,
                'username' => $user['username'],
                'user_id' => $user['_id'],
                'timeout' => $timeout
            ]);
        } catch (Exception $e) {
            $logger->error("Failed to create session for user {$data['username']}: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Fehler beim Erstellen der Sitzung.']);
            exit();
        }

        http_response_code(200);
        echo json_encode(['session_id' => $sessionId, 'username' => $user['username']]);
        exit();
    } else {
        $logger->warning("Login failed for user: {$data['username']}");
        http_response_code(401);
        echo json_encode(['error' => 'Die Zugangsdaten sind nicht gültig!']);
        exit();
    }
}

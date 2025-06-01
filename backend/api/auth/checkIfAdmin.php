<?php

function getRequest()
{
    global $dbClient, $sessionId, $logger;

    $logger->info("GET request received with session ID: {$sessionId}");

    $usersCollection = $dbClient->users_data->users;

    try {
        $requestingUser = $usersCollection->findOne(['_id' => $sessionId]);
    } catch (Exception $e) {
        $logger->error("Database error during user lookup: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Interner Serverfehler bei der Benutzerabfrage']);
        exit();
    }

    if (!isset($requestingUser['isAdmin']) || !$requestingUser['isAdmin']) {
        $logger->warning("Unauthorized access attempt by session ID: {$sessionId}");
        http_response_code(401);
        echo json_encode(['error' => 'Du hast nicht das Recht für diese Operation!']);
        exit();
    }

    $logger->info("Admin access granted for session ID: {$requestingUser['username']}");
    return [];
}

function postRequest()
{
    global $logger;

    $logger->warning("POST request received but operation is not allowed.");
    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
    exit();
}

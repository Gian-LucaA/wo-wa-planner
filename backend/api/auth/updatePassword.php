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
    global $dbClient, $logger, $sessionId;

    // Read request body
    $requestBody = file_get_contents("php://input");
    $data = json_decode($requestBody, true);

    $usernameInput = isset($data['email']) ? trim($data['email']) : '';

    if (empty($data['email']) || empty($data['oldPassword']) || empty($data['newPassword'])) {
        $logger->warning("Login attempt with missing credentials: " . json_encode($data));
        http_response_code(400);
        echo json_encode(['error' => 'Passwort oder Nutzername nicht ausgefüllt!']);
        exit();
    }

    $logger->info("Attempting to update password for user: {$usernameInput}");

    try {
        $usersCollection = $dbClient->users_data->users;
        $sessionCollection = $dbClient->users_data->sessions;
        $user = $usersCollection->findOne(['_id' => $sessionId]);
    } catch (Exception $e) {
        $logger->error("Database error during login: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Interner Serverfehler.']);
        exit();
    }

    $logger->info("User found: " . json_encode($user['_id'] ?? null));

    if (
        !$user ||
        !isset($user['email']) ||
        $user['email'] !== $data['email']
    ) {
        $logger->warning("User not found or email does not match: send: {$data['email']} - found: " . ($user['email'] ?? 'NULL'));
        http_response_code(404);
        echo json_encode(['error' => 'Nutzer Passwort Kombination ist unbekannt!']);
        exit();
    }

    // Prüfe altes Passwort gegen OTP (falls vorhanden) oder normales Passwort
    $otpValid = isset($user['otp']) && !empty($user['otp']) && password_verify($data['oldPassword'], $user['otp']);
    $passwordValid = isset($user['password']) && password_verify($data['oldPassword'], $user['password']);

    if (!$otpValid && !$passwordValid) {
        $logger->warning("Incorrect old password for user: {$data['email']}");
        http_response_code(401);
        echo json_encode(['error' => 'Nutzer Passwort Kombination ist unbekannt!']);
        exit();
    }

    $logger->info("Updating password for user: {$data['email']}");
    $newPassword = password_hash($data['newPassword'], PASSWORD_BCRYPT);

    try {
        $sessionCollection->deleteMany(['user_id' => $sessionId]);

        $usersCollection->updateOne(
            ['_id' => $user['_id']],
            ['$set' => ['password' => $newPassword, 'otp' => null, 'otp_expiry' => null]]
        );
    } catch (Exception $e) {
        $logger->error("Failed to update password: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Interner Fehler beim Aktualisieren des Passworts.']);
        exit();
    }

    http_response_code(200);
    echo json_encode(['success' => 'Neues Passwort erfolgreich gesetzt!']);
    exit();
}

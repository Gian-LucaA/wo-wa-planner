<?php

function getRequest()
{
    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
    exit();
}

function postRequest()
{
    global $dbClient;

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

    if (!isset($data['username']) || !isset($data['email']) || !isset($data['user_tag'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Fehlende Daten!']);
        exit();
    }

    $username = trim($data['username']);
    $email = strtolower(trim($data['email']));

    $userTag = str_replace(' ', '_', $data['user_tag']);
    $userTag = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $userTag);
    $userTag = strtolower(preg_replace('/[^a-zA-Z_]/', '', $userTag));

    if (strlen($username) > 32) {
        http_response_code(400);
        echo json_encode(['error' => 'Benutzername und Passwort dürfen maximal 32 Zeichen lang sein!']);
        exit();
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL) && !empty($email)) {
        http_response_code(400);
        echo json_encode(['error' => 'Ungültige E-Mail-Adresse!']);
        exit();
    }

    $usersCollection = $dbClient->users_data->users;
    $pendingCollection = $dbClient->users_data->pending_users;

    $existingUser = $usersCollection->findOne([
        'username' => $username,
        '_id' => ['$ne' => new MongoDB\BSON\ObjectId($data['id'])]
    ]);
    $pendingUser = $pendingCollection->findOne([
        'username' => $username,
        '_id' => ['$ne' => new MongoDB\BSON\ObjectId($data['id'])]
    ]);
    $existingUserTag = $usersCollection->findOne([
        'user_tag' => $userTag,
        '_id' => ['$ne' => new MongoDB\BSON\ObjectId($data['id'])]
    ]);
    $pendingUserTag = $pendingCollection->findOne([
        'user_tag' => $userTag,
        '_id' => ['$ne' => new MongoDB\BSON\ObjectId($data['id'])]
    ]);

    if ($existingUser || $pendingUser || $existingUserTag || $pendingUserTag) {
        http_response_code(409);
        echo json_encode(['error' => 'Der Nutzername ist bereits vergeben!']);
        exit();
    }

    try {
        $pendingUsersCollection = $dbClient->users_data->users;
        $updateResult = $pendingUsersCollection->updateOne(
            ['_id' => new MongoDB\BSON\ObjectId($data['id'])],
            ['$set' => $data]
        );

        if ($updateResult->getMatchedCount() === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Benutzer nicht gefunden!']);
            exit();
        }

        http_response_code(200);
        return ['success' => 'Benutzer erfolgreich geändert!'];
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Interner Serverfehler: ' . $e->getMessage()]);
    }
}

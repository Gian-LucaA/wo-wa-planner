<?php

function getRequest()
{
    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
}

function postRequest()
{
    global $dbClient;

    $requestBody = file_get_contents("php://input");
    $data = json_decode($requestBody, true);

    if (empty($data['username']) || empty($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Ein Pflichtfeld wurde nicht ausgefüllt!']);
        return;
    }

    $username = strtolower(trim($data['username']));
    $password = password_hash($data['password'], PASSWORD_BCRYPT);

    $usersCollection = $dbClient->users_data->users;
    $pendingCollection = $dbClient->users_data->pending_users;

    $existingUser = $usersCollection->findOne(['username' => $username]);
    $pendingUser = $pendingCollection->findOne(['username' => $username]);

    if ($existingUser) {
        http_response_code(409);
        echo json_encode(['error' => 'Der Nutzername ist bereits vergeben!']);
        return;
    }

    if ($pendingUser) {
        http_response_code(409);
        echo json_encode(['error' => 'Du bist bereits auf der Warteliste, bitte habe etwas Geduld.']);
        return;
    }

    $result = $pendingCollection->insertOne([
        'username' => $username,
        'password' => $password,
        'created_at' => new MongoDB\BSON\UTCDateTime()
    ]);

    if ($result->getInsertedCount() > 0) {
        http_response_code(200);
        echo json_encode(['message' => 'Sie wurden erfolgreich der Warteliste hinzugefügt!']);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
    }
}

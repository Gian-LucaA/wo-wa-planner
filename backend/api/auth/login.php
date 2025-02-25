<?php

function getRequest()
{
    global $params, $dbClient;

    // Check if username parameter is provided
    if (empty($params['username'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Username is required']);
        return;
    }

    // Use the existing MongoDB client
    $collection = $dbClient->users_data->users;
    $user = $collection->findOne(['username' => $params['username']]);

    if ($user) {
        unset($user['_id'], $user['password']);
        echo json_encode($user);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
    }
}

function postRequest()
{
    global $dbClient;

    // Read request body
    $requestBody = file_get_contents("php://input");
    $data = json_decode($requestBody, true);

    if (empty($data['username']) || empty($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Passwort oder Nutzername nicht ausgefüllt!']);
        return;
    }

    $collection = $dbClient->users_data->users;
    $user = $collection->findOne(['username' => $data['username']]);

    if ($user && password_verify($data['password'], $user['password'])) {

        $sessionId = bin2hex(random_bytes(64));
        $sessionCollection = $dbClient->users_data->sessions;
        $timeout = new MongoDB\BSON\UTCDateTime(strtotime('+15 minutes') * 1000);

        $sessionCollection->deleteMany(['user_id' => $user['_id']]);
        $sessionCollection->insertOne([
            'session_id' => $sessionId,
            'username' => $user['username'],
            'user_id' => $user['_id'],
            'timeout' => $timeout
        ]);

        http_response_code(200);
        echo json_encode(['session_id' => $sessionId, 'username' => $user['username']]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Die Zugangsdaten sind nicht gültig!']);
    }
}

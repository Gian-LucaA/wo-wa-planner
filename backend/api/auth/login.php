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

    // Read request body
    $requestBody = file_get_contents("php://input");
    $data = json_decode($requestBody, true);

    if (empty($data['username']) || empty($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Passwort oder Nutzername nicht ausgefüllt!']);
        exit();
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
        exit();
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Die Zugangsdaten sind nicht gültig!']);
        exit();
    }
}

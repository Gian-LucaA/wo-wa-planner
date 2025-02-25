<?php

function getRequest()
{
    http_response_code(404);
    echo json_encode(['error' => 'GET method is not supported for registration']);
}

function postRequest()
{
    global $dbClient;

    $requestBody = file_get_contents("php://input");
    $data = json_decode($requestBody, true);

    if (empty($data['username']) || empty($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
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
        echo json_encode(['error' => 'User already registered']);
        return;
    }

    if ($pendingUser) {
        http_response_code(409);
        echo json_encode(['error' => 'User is already on the waiting list']);
        return;
    }

    $result = $pendingCollection->insertOne([
        'username' => $username,
        'password' => $password,
        'created_at' => new MongoDB\BSON\UTCDateTime()
    ]);

    if ($result->getInsertedCount() > 0) {
        echo json_encode(['message' => 'User added to the waiting list']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to add user to waiting list']);
    }
}

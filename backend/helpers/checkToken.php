<?php

function checkToken($currentSessionID, $username)
{

    global $dbClient;

    // Use the existing MongoDB client
    $sessionCollection = $dbClient->users_data->sessions;
    $session = $sessionCollection->findOne([
        'username' => $username,
        'session_id' => $currentSessionID
    ]);

    if ($session) {
        if ($session['timeout'] < new MongoDB\BSON\UTCDateTime()) {
            http_response_code(401);
            echo json_encode(['error' => 'Deine Session ist abgelaufen. Bitte melde dich erneut an.']);
            exit();
        }

        return $session['user_id'];
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Could not verify token!']);
        exit();
    }
}

function checkIfTokenIsAdmin($userId)
{
    global $dbClient;

    $usersCollection = $dbClient->users_data->users;
    $result = $usersCollection->findOne([
        '_id' => new MongoDB\BSON\ObjectId($userId)
    ], ['projection' => ['isAdmin' => 1, '_id' => 0]]);

    return $result['isAdmin'];
}

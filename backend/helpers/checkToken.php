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

        return;
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Could not verify token!']);
        exit();
    }
}

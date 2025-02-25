<?php

function getRequest()
{
    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
}

function postRequest()
{
    global $dbClient;

    // Read request body
    $requestBody = file_get_contents("php://input");
    $data = json_decode($requestBody, true);

    if (empty($data['username']) || empty($data['session_id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
        return;
    }

    // Use the existing MongoDB client
    $sessionCollection = $dbClient->users_data->sessions;
    $session = $sessionCollection->findOne([
        'username' => $data['username'],
        'session_id' => $data['session_id']
    ]);

    if ($session) {

        if ($session['timeout'] < new MongoDB\BSON\UTCDateTime()) {
            http_response_code(401);
            echo json_encode(['error' => 'Deine Session ist abgelaufen. Bitte melde dich erneut an.']);
            return;
        }

        // Create a new session ID
        $newSessionId = bin2hex(random_bytes(64));
        $timeout = new MongoDB\BSON\UTCDateTime(strtotime('+15 minutes') * 1000);

        // Update the session with the new session ID and timeout
        $sessionCollection->updateOne(
            ['_id' => $session['_id']],
            ['$set' => ['session_id' => $newSessionId, 'timeout' => $timeout]]
        );

        http_response_code(200);
        echo json_encode(['session_id' => $newSessionId]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
    }
}

<?php

function getRequest()
{
    global $data, $dbClient;

    $sessionsCollection = $dbClient->users_data->sessions;
    $usersCollection = $dbClient->users_data->users;
    $placesCollection = $dbClient->place_data->places;

    $session = $sessionsCollection->findOne(['session_id' => $data['session_id']]);
    if (!$session) {
        http_response_code(401);
        echo json_encode(['error' => 'Session ungültig.']);
        exit();
    }

    $user = $usersCollection->findOne(['_id' => $session['user_id']]);
    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'Benutzer nicht gefunden']);
        exit();
    }

    $places = $placesCollection->aggregate([
        [
            '$match' => [
                'users' => $user['user_tag']
            ]
        ]
    ]);

    $places = iterator_to_array($places);

    foreach ($places as &$place) {
        unset($place['users']);
    };

    return ["places" => $places];
}

function postRequest()
{
    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
    exit();
}

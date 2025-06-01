<?php

function getRequest()
{
    global $data, $dbClient, $params, $logger;

    $logger->info("getRequest called", ['session_id' => $data['session_id'] ?? null, 'params' => $params]);

    $sessionsCollection = $dbClient->users_data->sessions;
    $usersCollection = $dbClient->users_data->users;
    $placesCollection = $dbClient->place_data->places;

    $session = $sessionsCollection->findOne(['session_id' => $data['session_id']]);
    if (!$session) {
        $logger->warning("Ungültige Session", ['session_id' => $data['session_id'] ?? null]);
        http_response_code(401);
        echo json_encode(['error' => 'Session ungültig.']);
        exit();
    }
    $logger->info("Session valid", ['session_id' => $data['session_id']]);

    $user = $usersCollection->findOne(['_id' => $session['user_id']]);
    if (!$user) {
        $logger->error("Benutzer nicht gefunden", ['user_id' => (string)$session['user_id']]);
        http_response_code(404);
        echo json_encode(['error' => 'Benutzer nicht gefunden']);
        exit();
    }
    $logger->info("Benutzer gefunden", ['user_id' => (string)$session['user_id'], 'user_tag' => $user['user_tag']]);

    try {
        if (isset($params['placeId'])) {
            $logger->info("Abfrage eines einzelnen Ortes", ['placeId' => $params['placeId']]);
            $places = $placesCollection->find(["_id" => new MongoDB\BSON\ObjectId($params['placeId'])]);
        } else {
            $logger->info("Abfrage aller Orte für Benutzer", ['user_tag' => $user['user_tag']]);
            $places = $placesCollection->aggregate([
                ['$match' => ['users' => $user['user_tag']]]
            ]);
        }

        $places = iterator_to_array($places);

        if (!isset($params['placeId'])) {
            foreach ($places as &$place) {
                unset($place['users']);
            }
        }

        $logger->info("Orte abgerufen", ['count' => count($places)]);
    } catch (Exception $e) {
        $logger->error("Fehler beim Abrufen der Orte", ['exception' => $e->getMessage()]);
        http_response_code(500);
        echo json_encode(['error' => 'Interner Serverfehler beim Abrufen der Orte']);
        exit();
    }

    return ["places" => $places];
}

function postRequest()
{
    global $logger;
    $logger->warning("postRequest called but not supported");
    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
    exit();
}

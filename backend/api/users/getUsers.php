<?php

function getRequest()
{
    global $dbClient, $params, $logger;

    $pendingUsersCollection = $dbClient->users_data->users;
    $pendingUsers = null;

    try {
        if (isset($params['userId'])) {
            $logger->info("Fetching user with ID: " . $params['userId']);
            $pendingUsers = $pendingUsersCollection->find(["_id" => new MongoDB\BSON\ObjectId($params['userId'])]);
        } else {
            $logger->info("Fetching all users");
            $pendingUsers = $pendingUsersCollection->find([]);
        }
    } catch (Exception $e) {
        $logger->error("Fehler bei der Abfrage der Benutzer: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Interner Serverfehler']);
        exit();
    }

    $pendingUsersArray = iterator_to_array($pendingUsers);

    $pendingUsersArray = array_map(function ($user) {
        if (isset($user['created_at']) && $user['created_at'] instanceof MongoDB\BSON\UTCDateTime) {
            $user['created_at'] = $user['created_at']->toDateTime()->format('H:i d.m.Y');
        } else {
            $user['created_at'] = "Unbekannt";
        }
        unset($user['password']);
        return $user;
    }, $pendingUsersArray);

    $logger->info("Returned " . count($pendingUsersArray) . " users");

    return ["users" => $pendingUsersArray];
}

function postRequest()
{
    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
    exit();
}

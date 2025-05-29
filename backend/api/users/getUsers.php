<?php

function getRequest()
{
    global $dbClient, $params;

    $pendingUsersCollection = $dbClient->users_data->users;
    $pendingUsers = null;

    if (isset($params['userId'])) {
        $pendingUsers = $pendingUsersCollection->find(["_id" => new MongoDB\BSON\ObjectId($params['userId'])]);
    } else {
        $pendingUsers = $pendingUsersCollection->find([]);
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

    return ["users" => $pendingUsersArray];
}

function postRequest()
{
    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
    exit();
}

<?php

function getRequest()
{
    global $dbClient;

    $pendingUsersCollection = $dbClient->users_data->pending_users;
    $pendingUsers = $pendingUsersCollection->find([]);
    $pendingUsersArray = iterator_to_array($pendingUsers);

    $pendingUsersArray = array_map(function ($user) {
        $user['created_at'] = $user['created_at']->toDateTime()->format('H:i d.m.Y');
        unset($user['password']);
        return $user;
    }, $pendingUsersArray);

    return ["pendingUsers" => $pendingUsersArray];
}

function postRequest()
{
    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
    exit();
}

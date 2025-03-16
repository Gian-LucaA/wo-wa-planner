<?php

function getRequest()
{
    global $dbClient, $params;

    $pendingUsersCollection = $dbClient->users_data->users;
    $pendingUsers = null;

    if (isset($params['searched'])) {
        $searchTerm = new MongoDB\BSON\Regex($params['searched'], 'i'); // 'i' for case-insensitive search
        $pendingUsers = $pendingUsersCollection->find([
            '$or' => [
                ['username' => $searchTerm],
                ['user_tag' => $searchTerm],
                ['email' => $searchTerm]
            ]
        ]);
    }

    $pendingUsersArray = iterator_to_array($pendingUsers);

    $pendingUsersArray = array_map(function ($user) {
        $user['created_at'] = $user['created_at']->toDateTime()->format('H:i d.m.Y');
        unset($user['password']);
        unset($user['created_at']);
        unset($user['isAdmin']);
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

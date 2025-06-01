<?php

function getRequest()
{
    global $dbClient, $sessionId, $logger;

    $usersCollection = $dbClient->users_data->users;

    $requestingUser = $usersCollection->findOne(['_id' => $sessionId]);

    if (!isset($requestingUser['isAdmin']) || !$requestingUser['isAdmin']) {
        http_response_code(401);
        $logger->warning("Unauthorized access attempt by user {$sessionId} to pending users list.");
        echo json_encode(['error' => 'Du hast nicht das Recht für diese Operation!']);
        exit();
    };

    $pendingUsersCollection = $dbClient->users_data->pending_users;
    $pendingUsers = $pendingUsersCollection->find([]);
    $pendingUsersArray = iterator_to_array($pendingUsers);

    $pendingUsersArray = array_map(function ($user) {
        $user['created_at'] = $user['created_at']->toDateTime()->format('H:i d.m.Y');
        unset($user['password']);
        return $user;
    }, $pendingUsersArray);

    $logger->info("User {$sessionId} requested pending users list. Found " . count($pendingUsersArray) . " entries.");

    return ["pendingUsers" => $pendingUsersArray];
}

function postRequest()
{
    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
    exit();
}

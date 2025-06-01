<?php

function getRequest()
{
    global $dbClient, $params, $logger;

    $pendingUsersCollection = $dbClient->users_data->users;
    $pendingUsers = null;

    try {
        if (isset($params['searched'])) {
            $searchTerm = new MongoDB\BSON\Regex($params['searched'], 'i'); // 'i' for case-insensitive search
            $logger->info("Searching pending users with term: " . $params['searched']);
            $pendingUsers = $pendingUsersCollection->find([
                '$or' => [
                    ['username' => $searchTerm],
                    ['user_tag' => $searchTerm],
                    ['email' => $searchTerm]
                ]
            ]);
        } else {
            $logger->info("Fetching all pending users without search term");
            $pendingUsers = $pendingUsersCollection->find();
        }

        $pendingUsersArray = iterator_to_array($pendingUsers);

        $pendingUsersArray = array_map(function ($user) {
            $user['created_at'] = $user['created_at']->toDateTime()->format('H:i d.m.Y');
            unset($user['password'], $user['created_at'], $user['isAdmin']);
            return $user;
        }, $pendingUsersArray);

        return ["users" => $pendingUsersArray];
    } catch (Exception $e) {
        $logger->error("Error fetching pending users: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Interner Serverfehler!']);
        exit();
    }
}

function postRequest()
{
    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
    exit();
}

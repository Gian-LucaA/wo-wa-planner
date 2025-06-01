<?php

function getRequest()
{
    global $data, $logger;

    $logger->info("GET request received for user validation.");

    if (empty($data['username']) || empty($data['session_id'])) {
        $logger->warning("Missing username or session_id in GET request. Data: " . json_encode($data));
        http_response_code(400);
        echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
        exit();
    }

    $logger->info("GET request validation passed for user: {$data['username']}");
    return [];
}

function postRequest()
{
    global $logger;

    $logger->warning("POST request received but operation is not allowed.");
    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
    exit();
}

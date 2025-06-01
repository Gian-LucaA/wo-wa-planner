<?php

function getRequest()
{
    global $logger;

    $logger->warning("GET request received, but this operation is not supported.");
    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
}

function postRequest()
{
    global $data, $logger;

    $logger->info("POST request received with data: " . json_encode($data));

    if (empty($data['username']) || empty($data['session_id'])) {
        $logger->warning("POST request missing required fields: " . json_encode($data));
        http_response_code(400);
        echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
        exit();
    }

    $logger->info("POST request passed validation for user: {$data['username']}");
    return [];
}

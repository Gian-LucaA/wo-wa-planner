<?php

function getRequest()
{
    global $data;

    if (empty($data['username']) || empty($data['session_id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
        exit();
    }

    return [];
}

function postRequest()
{
    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
    exit();
}

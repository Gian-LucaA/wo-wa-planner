<?php

function getRequest()
{
    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
}

function postRequest()
{
    global $data;

    if (empty($data['username']) || empty($data['session_id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
        exit();
    }

    return [];
}

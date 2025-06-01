<?php

require_once __DIR__ . '/../../mailer/sendTestMail.php';

function getRequest()
{

    sendEmail("gianlucaafting@icloud.com", "Giani", "Test Subject", "This is a test email message.");

    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
    exit();
}

function postRequest()
{
    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
    exit();
}

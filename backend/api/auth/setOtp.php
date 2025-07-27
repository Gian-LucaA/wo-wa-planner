<?php

require_once __DIR__ . '/../../mailer/sendOneTimePassword.php';
require_once __DIR__ . '/../../helpers/genTempPassword.php';

function getRequest()
{
    global $logger;

    $logger->warning("GET request received on set opt endpoint, which is not allowed.");
    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
}

function postRequest()
{
    global $dbClient, $logger;

    $logger->info("POST request received on password forgotten endpoint.");

    $currentIp = $_SERVER['REMOTE_ADDR'] ?? '';
    $currentAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';

    $rateLimitKey = hash('sha256', $currentIp . '|' . $currentAgent);
    $otpRequestsLimiterCollection = $dbClient->rate_limiter->otp_requests;

    $rateLimit = $otpRequestsLimiterCollection->findOne(['_id' => $rateLimitKey]);
    if ($rateLimit && $rateLimit['count'] >= 5 && $rateLimit['expiry'] > new MongoDB\BSON\UTCDateTime()) {
        $logger->warning("OTP Rate limit was hit by IP: {$currentIp}");
        http_response_code(429);
        echo json_encode(['error' => 'Zu viele Anfragen. Bitte versuche es später erneut.']);
        exit();
    } else {
        $logger->info("Rate limit check passed for IP: {$currentIp}");
        $otpRequestsLimiterCollection->updateOne(
            ['_id' => $rateLimitKey],
            ['$set' => ['count' => ($rateLimit ? $rateLimit['count'] + 1 : 1), 'expiry' => new MongoDB\BSON\UTCDateTime(strtotime('+15 minutes') * 1000)]],
            ['upsert' => true]
        );
    }

    $requestBody = file_get_contents("php://input");
    $data = json_decode($requestBody, true);

    if (empty($data['username']) || empty($data['email'])) {
        $logger->warning("Missing required registration fields.");
        http_response_code(400);
        echo json_encode(['error' => 'Ein Pflichtfeld wurde nicht ausgefüllt!']);
        exit();
    }

    $username = trim($data['username'] ?? null);
    $email = strtolower(trim($data['email'] ?? null));

    if (!$email || !$username) {
        $logger->warning("Username or email is empty.");
        http_response_code(400);
        echo json_encode(['error' => 'Benutzername und E-Mail müssen ausgefüllt sein!']);
        exit();
    }

    try {
        $usersCollection = $dbClient->users_data->users;
        $existingUser = $usersCollection->findOne(['username' => $username]) ?: $usersCollection->findOne(['email' => $email]);
    } catch (Exception $e) {
        $logger->error("Database query error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
        exit();
    }

    if ($existingUser['otp_expiry'] && $existingUser['otp_expiry'] > new MongoDB\BSON\UTCDateTime()) {
        $logger->warning("User tried to generate a OTP, while the old one is still valid: {$username}");
        http_response_code(200);
        echo json_encode(['success' => 'Wir haben dir eine E-Mail gesendet, wenn deine E-Mail existiert!']);
        exit();
    }

    if ($existingUser['email'] !== $email) {
        $logger->info("User tried to reset password with invalid data: {$username} / {$email}");
        http_response_code(200);
        echo json_encode(['success' => 'Wir haben dir eine E-Mail gesendet, wenn deine E-Mail existiert!']);
        exit();
    }

    $otp = generatePassword(9, true, 'luds');
    $logger->info("Generated OTP for user: {$existingUser['username']}");

    try {
        $usersCollection->updateOne(
            ['username' => $existingUser['username']],
            ['$set' => ['otp' => password_hash($otp, PASSWORD_BCRYPT), 'otp_expiry' => new MongoDB\BSON\UTCDateTime(strtotime('+20 minutes') * 1000)]]
        );
    } catch (Exception $e) {
        $logger->error("Failed to update user OTP: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
        exit();
    }

    try {
        sendOneTimePasswordMail($existingUser['username'], $existingUser['email'], $otp);
        $logger->info("Registration emails sent to: {$email}");
    } catch (Exception $e) {
        $logger->error("Failed to send registration emails: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
        exit();
    }
    http_response_code(200);
    echo json_encode(['success' => 'Wir haben dir eine E-Mail gesendet, wenn deine E-Mail existiert!']);
    exit();
}

<?php

function getRequest()
{
    global $logger;

    $logger->warning("GET request received, but operation is not supported.");
    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
    exit();
}

function postRequest()
{
    global $dbClient, $logger;

    $currentIp = $_SERVER['REMOTE_ADDR'] ?? '';
    $currentAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';

    $rateLimitKey = hash('sha256', $currentIp . '|' . $currentAgent);
    $loginRequestsLimiterCollection = $dbClient->rate_limiter->login_requests;

    $rateLimit = $loginRequestsLimiterCollection->findOne(['_id' => $rateLimitKey]);
    if ($rateLimit && $rateLimit['count'] >= 20 && $rateLimit['expiry'] > new MongoDB\BSON\UTCDateTime()) {
        $logger->warning("Rate limit was hit by IP: {$currentIp}");
        http_response_code(429);
        echo json_encode(['error' => 'Zu viele Anfragen. Bitte versuche es später erneut.']);
        exit();
    } else {
        $logger->info("Rate limit check passed for IP: {$currentIp}");
        $loginRequestsLimiterCollection->updateOne(
            ['_id' => $rateLimitKey],
            ['$set' => ['count' => ($rateLimit ? $rateLimit['count'] + 1 : 1), 'expiry' => new MongoDB\BSON\UTCDateTime(strtotime('+15 minutes') * 1000)]],
            ['upsert' => true]
        );
    }

    // Read request body
    $requestBody = file_get_contents("php://input");
    $data = json_decode($requestBody, true);

    $usernameInput = isset($data['username']) ? trim($data['username']) : '';

    if (empty($data['username']) || empty($data['password'])) {
        $logger->warning("Login attempt with missing credentials: " . json_encode($data));
        http_response_code(400);
        echo json_encode(['error' => 'Passwort oder Nutzername nicht ausgefüllt!']);
        exit();
    }

    $logger->info("Attempting login for username or email: {$usernameInput}");

    try {
        $collection = $dbClient->users_data->users;
        $user = $collection->findOne([
            '$or' => [
                ['username' => $usernameInput],
                ['email' => $usernameInput]
            ]
        ]);
    } catch (Exception $e) {
        $logger->error("Database error during login: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Interner Serverfehler.']);
        exit();
    }

    $successLoggedIn = false;
    $isOtpSession = false;

    if (
        $user &&
        isset($user['otp']) && !empty($user['otp']) &&
        password_verify($data['password'], $user['otp'])
    ) {
        $logger->info("User {$user['username']} logging in with OTP.");

        if (
            isset($user['otp_expiry']) &&
            $user['otp_expiry'] instanceof MongoDB\BSON\UTCDateTime &&
            $user['otp_expiry']->toDateTime()->getTimestamp() > time()
        ) {
            $logger->info("OTP for user {$user['username']} is still valid.");
        } else {
            $logger->warning("OTP for user {$user['username']} has expired or is invalid.");
            http_response_code(401);
            echo json_encode(['error' => 'Das einmalige Passwort ist abgelaufen oder ungültig!']);
            exit();
        }

        $collection->updateOne(
            ['_id' => $user['_id']],
            ['$set' => ['otp_expiry' => null]]
        );

        $successLoggedIn = true;
        $isOtpSession = true;
    } else if (
        $user &&
        isset($user['password']) &&
        password_verify($data['password'], $user['password'])
    ) {
        $logger->info("Login successful for user: {$user['username']}");

        if (isset($user['otp']) && !empty($user['otp'])) {
            $logger->warning("User {$user['username']} has an OTP set, but is logging in with password.");

            $collection->updateOne(
                ['_id' => $user['_id']],
                ['$set' => ['otp_expiry' => null, 'otp' => null]]
            );
        }

        $successLoggedIn = true;
    } else {
        $logger->warning("Login failed for identifier: {$usernameInput}");
        http_response_code(401);
        echo json_encode(['error' => 'Die Zugangsdaten sind nicht gültig!']);
        exit();
    }

    if ($successLoggedIn) {
        $sessionId = bin2hex(random_bytes(64));
        $sessionCollection = $dbClient->users_data->sessions;
        $timeout = new MongoDB\BSON\UTCDateTime(strtotime('+15 minutes') * 1000);

        $ipHash = hashValue($currentIp);
        $agentHash = hashValue($currentAgent);

        try {
            $sessionCollection->deleteMany(['user_id' => $user['_id']]);
            $sessionCollection->insertOne([
                'session_id' => $sessionId,
                'username' => $user['username'],
                'user_id' => $user['_id'],
                'timeout' => $timeout,
                'ip' => $ipHash,
                'user_agent' => $agentHash,
                'is_otp_session' => $isOtpSession,
            ]);
        } catch (Exception $e) {
            $logger->error("Failed to create session for user {$user['username']}: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Fehler beim Erstellen der Sitzung.']);
            exit();
        }

        http_response_code(200);
        echo json_encode(['session_id' => $sessionId, 'username' => $user['username'], 'is_otp_session' => $isOtpSession]);
        exit();
    } else {
        $logger->warning("Login failed for user: {$user['username']}");
        http_response_code(401);
        echo json_encode(['error' => 'Die Zugangsdaten sind nicht gültig!']);
    }
}

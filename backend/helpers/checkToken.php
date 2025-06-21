<?php

function checkToken($currentSessionID, $username)
{
    global $dbClient, $logger;

    $currentIp = $_SERVER['REMOTE_ADDR'] ?? '';
    $currentAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';

    $ipHash = hashValue($currentIp);
    $agentHash = hashValue($currentAgent);

    // Use the existing MongoDB client
    $sessionCollection = $dbClient->users_data->sessions;
    $session = $sessionCollection->findOne([
        'username' => $username,
        'session_id' => $currentSessionID
    ]);

    if ($session) {
        $logger->info("Session found for user: $username");

        if ($session['timeout'] < new MongoDB\BSON\UTCDateTime()) {
            $logger->warning("Session expired for user: $username");
            http_response_code(401);
            echo json_encode(['error' => 'Deine Session ist abgelaufen. Bitte melde dich erneut an.']);
            exit();
        }

        if (
            (isset($session['ip']) && $session['ip'] !== $ipHash) ||
            (isset($session['user_agent']) && $session['user_agent'] !== $agentHash)
        ) {
            $logger->warning("Session attribute mismatch for user: $username.");
            http_response_code(401);
            echo json_encode(['error' => 'Could not verify token!']);
            exit();
        }

        $logger->info("Session validated for user: $username");
        return ["session" => $session['user_id'], "isOtpSession" => $session['is_otp_session']];
    } else {
        $logger->warning("No session found for user: $username with session ID: $currentSessionID");
        http_response_code(401);
        echo json_encode(['error' => 'Could not verify token!']);
        exit();
    }
}

function checkIfTokenIsAdmin($userId)
{
    global $dbClient, $logger;

    $usersCollection = $dbClient->users_data->users;
    $result = $usersCollection->findOne([
        '_id' => new MongoDB\BSON\ObjectId($userId)
    ], ['projection' => ['isAdmin' => 1, '_id' => 0]]);

    if ($result && isset($result['isAdmin']) && $result['isAdmin']) {
        $logger->info("User $userId is admin.");
        return true;
    } else {
        $logger->info("User $userId is not admin.");
        return false;
    }
}

function hashValue($value)
{
    return hash('sha256', $value);
}

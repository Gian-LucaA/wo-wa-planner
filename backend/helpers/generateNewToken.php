<?php

function generateNewToken($currentSessionID, $username)
{

  global $dbClient;

  // Use the existing MongoDB client
  $sessionCollection = $dbClient->users_data->sessions;
  $session = $sessionCollection->findOne([
    'username' => $username,
    'session_id' => $currentSessionID
  ]);

  if ($session) {
    if ($session['timeout'] < new MongoDB\BSON\UTCDateTime()) {
      http_response_code(401);
      echo json_encode(['error' => 'Deine Session ist abgelaufen. Bitte melde dich erneut an.']);
      exit();
    }

    // Create a new session ID
    $newSessionId = bin2hex(random_bytes(64));
    $timeout = new MongoDB\BSON\UTCDateTime(strtotime('+15 minutes') * 1000);

    // Update the session with the new session ID and timeout
    $sessionCollection->updateOne(
      ['_id' => $session['_id']],
      ['$set' => ['session_id' => $newSessionId, 'timeout' => $timeout]]
    );

    $isSecure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');

    setcookie('session_id', $newSessionId, [
      'expires' => time() + 60 * 60 * 24,
      'path' => '/',
      'secure' => $isSecure,
      'httponly' => true,
      'samesite' => 'Strict',
    ]);

    return $newSessionId;
  } else {
    http_response_code(500);
    echo json_encode(['error' => 'Could not refresh token!']);
    exit();
  }
}

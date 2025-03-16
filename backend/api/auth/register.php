<?php

function getRequest()
{
  http_response_code(400);
  echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
}

function postRequest()
{
  global $dbClient;

  $requestBody = file_get_contents("php://input");
  $data = json_decode($requestBody, true);

  if (empty($data['username']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Ein Pflichtfeld wurde nicht ausgefüllt!']);
    exit();
  }

  $username = trim($data['username']);
  $password = password_hash($data['password'], PASSWORD_BCRYPT);
  $email = strtolower(trim($data['email']));

  $userTag = str_replace(' ', '_', $username);
  $userTag = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $userTag);
  $userTag = strtolower(preg_replace('/[^a-zA-Z_]/', '', $userTag));

  if (strlen($username) > 32) {
    http_response_code(400);
    echo json_encode(['error' => 'Benutzername und Passwort dürfen maximal 32 Zeichen lang sein!']);
    exit();
  }

  if (!filter_var($email, FILTER_VALIDATE_EMAIL) && !empty($email)) {
    http_response_code(400);
    echo json_encode(['error' => 'Ungültige E-Mail-Adresse!']);
    exit();
  }

  $usersCollection = $dbClient->users_data->users;
  $pendingCollection = $dbClient->users_data->pending_users;

  $existingUser = $usersCollection->findOne(['username' => $username]);
  $pendingUser = $pendingCollection->findOne(['username' => $username]);
  $existingUserTag = $usersCollection->findOne(['user_tag' => $userTag]);
  $pendingUserTag = $pendingCollection->findOne(['user_tag' => $userTag]);

  if ($existingUser) {
    http_response_code(409);
    echo json_encode(['error' => 'Der Nutzername ist bereits vergeben!']);
    exit();
  }

  if ($pendingUser) {
    http_response_code(409);
    echo json_encode(['error' => 'Du bist bereits auf der Warteliste, bitte habe etwas Geduld.']);
    exit();
  }

  if ($existingUserTag || $pendingUserTag) {
    http_response_code(409);
    echo json_encode(['error' => 'Der Nutzername ist bereits vergeben!']);
    exit();
  }

  $result = $pendingCollection->insertOne([
    'username' => $username,
    'user_tag' => $userTag,
    'password' => $password,
    'email' => $email,
    'created_at' => new MongoDB\BSON\UTCDateTime()
  ]);

  if ($result->getInsertedCount() > 0) {
    http_response_code(200);
    return ['message' => 'Sie wurden erfolgreich der Warteliste hinzugefügt!'];
  } else {
    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
    exit();
  }
}

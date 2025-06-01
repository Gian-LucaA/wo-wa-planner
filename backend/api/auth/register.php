<?php

require_once __DIR__ . '/../../mailer/registered.php';
require_once __DIR__ . '/../../mailer/newRegistration.php';

function getRequest()
{
  global $logger;

  $logger->warning("GET request received on registration endpoint, which is not allowed.");
  http_response_code(400);
  echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
}

function postRequest()
{
  global $dbClient, $logger;

  $logger->info("POST request received on registration endpoint.");

  $requestBody = file_get_contents("php://input");
  $data = json_decode($requestBody, true);
  $logger->info("POST data: " . json_encode($data));

  if (empty($data['username']) || empty($data['password'])) {
    $logger->warning("Missing required registration fields.");
    http_response_code(400);
    echo json_encode(['error' => 'Ein Pflichtfeld wurde nicht ausgefüllt!']);
    exit();
  }

  $username = trim($data['username']);
  $password = password_hash($data['password'], PASSWORD_BCRYPT);
  $email = strtolower(trim($data['email'] ?? ''));

  $userTag = str_replace(' ', '_', $username);
  $userTag = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $userTag);
  $userTag = strtolower(preg_replace('/[^a-zA-Z_]/', '', $userTag));

  if (strlen($username) > 32) {
    $logger->warning("Username too long: {$username}");
    http_response_code(400);
    echo json_encode(['error' => 'Benutzername und Passwort dürfen maximal 32 Zeichen lang sein!']);
    exit();
  }

  if (!filter_var($email, FILTER_VALIDATE_EMAIL) && !empty($email)) {
    $logger->warning("Invalid email format: {$email}");
    http_response_code(400);
    echo json_encode(['error' => 'Ungültige E-Mail-Adresse!']);
    exit();
  }

  try {
    $usersCollection = $dbClient->users_data->users;
    $pendingCollection = $dbClient->users_data->pending_users;

    $existingUser = $usersCollection->findOne(['username' => $username]) ?: $usersCollection->findOne(['email' => $email]);
    $pendingUser = $pendingCollection->findOne(['username' => $username]) ?: $pendingCollection->findOne(['email' => $email]);
    $existingUserTag = $usersCollection->findOne(['user_tag' => $userTag]);
    $pendingUserTag = $pendingCollection->findOne(['user_tag' => $userTag]);
  } catch (Exception $e) {
    $logger->error("Database query error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Interner Fehler bei der Datenbankabfrage.']);
    exit();
  }

  if ($existingUser) {
    $logger->info("User already exists with username or email: {$username} / {$email}");
    http_response_code(409);
    echo json_encode(['error' => 'Der Nutzername ist bereits vergeben!']);
    exit();
  }

  if ($pendingUser) {
    $logger->info("User already pending with username or email: {$username} / {$email}");
    http_response_code(409);
    echo json_encode(['error' => 'Du bist bereits auf der Warteliste, bitte habe etwas Geduld.']);
    exit();
  }

  if ($existingUserTag || $pendingUserTag) {
    $logger->info("User tag already in use: {$userTag}");
    http_response_code(409);
    echo json_encode(['error' => 'Der Nutzername ist bereits vergeben!']);
    exit();
  }

  try {
    sendRegisteredMail($username, $email);
    sendRegistrationReminderMail($username, $email);
    $logger->info("Registration emails sent to: {$email}");
  } catch (Exception $e) {
    $logger->error("Failed to send registration emails: " . $e->getMessage());
  }

  try {
    $result = $pendingCollection->insertOne([
      'username' => $username,
      'user_tag' => $userTag,
      'password' => $password,
      'email' => $email,
      'created_at' => new MongoDB\BSON\UTCDateTime()
    ]);
  } catch (Exception $e) {
    $logger->error("Failed to insert pending user: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Interner Fehler beim Hinzufügen zur Warteliste.']);
    exit();
  }

  if ($result->getInsertedCount() > 0) {
    $logger->success("User successfully added to pending list: {$username}");
    http_response_code(200);
    return ['message' => 'Sie wurden erfolgreich der Warteliste hinzugefügt!'];
  } else {
    $logger->error("Insertion failed for user: {$username}");
    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
    exit();
  }
}

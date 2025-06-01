<?php

require_once __DIR__ . '/../../mailer/acceptedRegistration.php';

function getRequest()
{
    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
    exit();
}

function postRequest()
{
    global $dbClient, $sessionId, $logger;

    $data = json_decode(file_get_contents('php://input'), true);
    if (!isset($data['_id']) || !$data['_id']) {
        http_response_code(400);
        echo json_encode(['error' => 'Benutzer-ID fehlt!']);
        exit();
    }

    $pendingUsersCollection = $dbClient->users_data->pending_users;
    $usersCollection = $dbClient->users_data->users;

    $requestingUser = $usersCollection->findOne(['_id' => $sessionId]);
    if (!isset($requestingUser['isAdmin']) || !$requestingUser['isAdmin']) {
        http_response_code(401);
        echo json_encode(['error' => 'Du hast nicht das Recht für diese Operation!']);
        exit();
    }

    try {
        $objectId = new MongoDB\BSON\ObjectId($data['_id']);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => 'Ungültige Benutzer-ID!']);
        exit();
    }

    $user = $pendingUsersCollection->findOne(['_id' => $objectId]);
    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'Benutzer nicht gefunden!']);
        exit();
    }

    $logger->info("Benutzer wird akzeptiert:", ['user' => $user]);

    try {
        acceptedRegistrationMail($user['username'], $user['email']);
        $logger->info("Akzeptierungs-Mail erfolgreich gesendet an " . $user['email']);
    } catch (Exception $e) {
        $logger->error("Fehler beim Senden der Akzeptierungs-Mail: " . $e->getMessage());
        // Optional: decide if you want to fail here or continue
    }

    unset($user['_id']);
    $user['created_at'] = new MongoDB\BSON\UTCDateTime((new DateTime())->getTimestamp() * 1000);

    $result = $usersCollection->insertOne($user);
    if ($result->getInsertedCount() == 1) {
        $pendingUsersCollection->deleteOne(['_id' => $objectId]);
        $logger->info("Benutzer erfolgreich in Benutzer-Collection eingefügt und aus Warteliste entfernt", ['user' => $user['username']]);

        http_response_code(200);
        return ['success' => 'Benutzer erfolgreich akzeptiert!'];
    } else {
        $logger->error("Fehler beim Einfügen des Benutzers in die Benutzer-Collection", ['user' => $user['username']]);
        http_response_code(500);
        echo json_encode(['error' => 'Fehler beim Einfügen des Benutzers in die Benutzertabelle!']);
        exit();
    }
}

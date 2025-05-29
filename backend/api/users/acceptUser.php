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
    global $dbClient;

    $data = json_decode(file_get_contents('php://input'), true);
    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Benutzer-ID fehlt!']);
        exit();
    }

    $pendingUsersCollection = $dbClient->users_data->pending_users;
    $usersCollection = $dbClient->users_data->users;

    $user = $pendingUsersCollection->findOne(['_id' => new MongoDB\BSON\ObjectId($data['id'])]);

    acceptedRegistrationMail($user['username'], $user['email']);

    if ($user) {
        unset($user['_id']);
        $user['created_at'] = new MongoDB\BSON\UTCDateTime((new DateTime())->getTimestamp() * 1000);
        $result = $usersCollection->insertOne($user);
        if ($result->getInsertedCount() == 1) {
            $pendingUsersCollection->deleteOne(['_id' => new MongoDB\BSON\ObjectId($data['id'])]);
            http_response_code(200);
            return ['success' => 'Benutzer erfolgreich akzeptiert!'];
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Fehler beim Einfügen des Benutzers in die Benutzertabelle!']);
            exit();
        }
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Benutzer nicht gefunden!']);
        exit();
    }
}

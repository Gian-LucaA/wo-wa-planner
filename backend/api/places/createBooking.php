<?php

require_once __DIR__ . '/../../mailer/newBooking.php';

function getRequest()
{
    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
    exit();
}

function postRequest()
{
    global $dbClient, $sessionId;

    $data = json_decode(file_get_contents('php://input'), true);

    // Überprüfen, ob alle erforderlichen Felder vorhanden sind
    if (!isset($data['locationId'], $data['from'], $data['to'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Fehlende Felder in der Anfrage!']);
        exit();
    }

    try {
        $fromDate = new MongoDB\BSON\UTCDateTime(new DateTime($data['from']));
        $toDate = new MongoDB\BSON\UTCDateTime(new DateTime($data['to']));
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => 'Ungültiges Datumsformat: ' . $e->getMessage()]);
        exit();
    }

    $bookingsCollection = $dbClient->selectCollection('place_data', 'bookings');
    try {
        $existingBooking = $bookingsCollection->findOne(['placeId' => $data['locationId'], 'from' => $fromDate, 'to' => $toDate]);
        if ($existingBooking) {
            http_response_code(409);
            echo json_encode(['error' => 'Dieser Zeitpunkt ist bereits gebucht!']);
            exit();
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Fehler bei der Überprüfung der Buchung: ' . $e->getMessage()]);
        exit();
    }

    $usersCollection = $dbClient->selectCollection('users_data', 'users');
    $user = $usersCollection->findOne(['_id' => $sessionId]);

    $placesCollection = $dbClient->selectCollection('place_data', 'places');
    $place = $placesCollection->findOne(['_id' => new MongoDB\BSON\ObjectId($data['locationId'])]);

    sendBookedMail(
        $user['username'],
        $user['email'],
        'Buchung ' . $place['name'],
        'Buchung des WoWas über WoWaPlanner',
        $place['location'],
        new DateTime($data['from'], new DateTimeZone('UTC')),
        new DateTime($data['to'], new DateTimeZone('UTC'))
    );

    // Neues Dokument erstellen
    $newBooking = [
        'placeId' => new MongoDB\BSON\ObjectId($data['locationId']),
        'userId' => $sessionId,
        'from' => $fromDate,
        'to' => $toDate,
    ];

    // Einfügen des Dokuments in die MongoDB
    try {
        $bookingsCollection->insertOne($newBooking);

        http_response_code(201);
        return ['success' => 'Ort erfolgreich erstellt'];
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Fehler beim Erstellen der Buchung: ' . $e->getMessage()]);
    }
}

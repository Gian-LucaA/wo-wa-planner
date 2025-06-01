<?php

require_once __DIR__ . '/../../mailer/newBooking.php';

function getRequest()
{
    global $logger;

    $logger->warning("GET request received on booking endpoint, which is not allowed.");
    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
    exit();
}

function postRequest()
{
    global $dbClient, $sessionId, $logger;

    $logger->info("POST request received on booking endpoint.");

    $data = json_decode(file_get_contents('php://input'), true);
    $logger->info("POST data: " . json_encode($data));

    if (!isset($data['locationId'], $data['from'], $data['to'])) {
        $logger->warning("Missing fields in booking request.");
        http_response_code(400);
        echo json_encode(['error' => 'Fehlende Felder in der Anfrage!']);
        exit();
    }

    try {
        $fromDate = new MongoDB\BSON\UTCDateTime(new DateTime($data['from']));
        $toDate = new MongoDB\BSON\UTCDateTime(new DateTime($data['to']));
    } catch (Exception $e) {
        $logger->error("Invalid date format in booking request: " . $e->getMessage());
        http_response_code(400);
        echo json_encode(['error' => 'Ungültiges Datumsformat: ' . $e->getMessage()]);
        exit();
    }

    $bookingsCollection = $dbClient->selectCollection('place_data', 'bookings');
    try {
        $existingBooking = $bookingsCollection->findOne([
            'placeId' => new MongoDB\BSON\ObjectId($data['locationId']),
            'from' => $fromDate,
            'to' => $toDate
        ]);

        if ($existingBooking) {
            $logger->info("Booking conflict detected for placeId {$data['locationId']} between {$data['from']} and {$data['to']}.");
            http_response_code(409);
            echo json_encode(['error' => 'Dieser Zeitpunkt ist bereits gebucht!']);
            exit();
        }
    } catch (Exception $e) {
        $logger->error("Error checking existing bookings: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Fehler bei der Überprüfung der Buchung: ' . $e->getMessage()]);
        exit();
    }

    $usersCollection = $dbClient->selectCollection('users_data', 'users');
    $user = $usersCollection->findOne(['_id' => $sessionId]);

    $placesCollection = $dbClient->selectCollection('place_data', 'places');
    $place = $placesCollection->findOne(['_id' => new MongoDB\BSON\ObjectId($data['locationId'])]);

    if (!$user) {
        $logger->warning("User not found for sessionId: {$sessionId}");
    }

    if (!$place) {
        $logger->warning("Place not found for locationId: {$data['locationId']}");
    }

    if (!isset($user['email']) || !$user['email']) {
        $logger->warning("User email is missing.", ['user' => $user]);
    } else {
        try {
            sendBookedMail(
                $user['username'],
                $user['email'],
                'Buchung ' . $place['name'],
                'Buchung des WoWas über WoWaPlanner',
                $place['location'],
                new DateTime($data['from'], new DateTimeZone('UTC')),
                new DateTime($data['to'], new DateTimeZone('UTC'))
            );
            $logger->info("Booking confirmation mail sent to " . $user['email']);
        } catch (Exception $e) {
            $logger->error("Failed to send booking mail: " . $e->getMessage());
        }
    }

    $newBooking = [
        'placeId' => new MongoDB\BSON\ObjectId($data['locationId']),
        'userId' => $sessionId,
        'from' => $fromDate,
        'to' => $toDate,
    ];

    try {
        $insertResult = $bookingsCollection->insertOne($newBooking);
        $logger->info("New booking inserted", ['bookingId' => (string)$insertResult->getInsertedId()]);
        http_response_code(201);
        return ['success' => 'Ort erfolgreich erstellt'];
    } catch (Exception $e) {
        $logger->error("Failed to insert booking: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Fehler beim Erstellen der Buchung: ' . $e->getMessage()]);
    }
}

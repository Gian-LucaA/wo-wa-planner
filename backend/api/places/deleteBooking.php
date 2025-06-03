<?php

function getRequest()
{
    global $logger;

    $logger->warning("GET request received on delete booking endpoint. Not allowed.");
    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
    exit();
}

function postRequest()
{
    global $dbClient, $logger, $sessionId, $isAdmin;
    $data = json_decode(file_get_contents('php://input'), true);

    $username = isset($data['username']) ? $data['username'] : 'Unbekannt';

    $logger->info("POST request received for booking deletion by user '{$username}' (sessionId: {$sessionId}).");
    $logger->info("Included data: ", $data);

    $bookingId = $data['id'];

    if (!$bookingId) {
        $logger->warning("Missing required query parameter 'bookingId'. User: {$username}");
        http_response_code(400);
        echo json_encode(['error' => 'Fehlende Daten!']);
        exit();
    }

    try {
        $bookingsCollection = $dbClient->place_data->bookings;

        // Ein einzelnes Dokument abrufen
        $booking = $bookingsCollection->findOne(['_id' => new MongoDB\BSON\ObjectId($bookingId)]);

        if (!$booking) {
            $logger->warning("Buchung mit ID {$bookingId} wurde nicht gefunden. Anfrage von: {$username}");
            http_response_code(404);
            echo json_encode(['error' => 'Buchung nicht gefunden!']);
            exit();
        }

        if ($booking['userId'] != $sessionId && !$isAdmin) {
            $logger->error("Unbefugter Löschversuch durch User '{$username}' (sessionId: {$sessionId}) für Buchung {$bookingId}, die einem anderen User gehört (userId: {$booking['userId']}).");
            http_response_code(403);
            echo json_encode(['error' => 'Nicht autorisiert!']);
            exit();
        }

        $deleteResult = $bookingsCollection->deleteOne(['_id' => new MongoDB\BSON\ObjectId($bookingId)]);

        if ($deleteResult->getDeletedCount() === 1) {
            $logger->info("Buchung {$bookingId} erfolgreich gelöscht durch User '{$username}' (sessionId: {$sessionId}).");
            http_response_code(200);
            return ['message' => "Erfolgreich gelöscht."];
        } else {
            $logger->warning("Löschvorgang für Buchung {$bookingId} durch User '{$username}' schlug fehl.");
            http_response_code(500);
            echo json_encode(['error' => 'Löschen fehlgeschlagen.']);
            exit();
        }
    } catch (Exception $e) {
        $logger->error("Fehler beim Löschen der Buchung {$bookingId} durch User '{$username}': " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Interner Serverfehler beim Löschen der Buchung.']);
        exit();
    }
}

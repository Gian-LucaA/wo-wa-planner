<?php

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

    // Überprüfen, ob alle erforderlichen Felder vorhanden sind
    if (!isset($data['userId'], $data['placeId'], $data['from'], $data['to'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Fehlende Felder in der Anfrage!']);
        exit();
    }

    $bookingsCollection = $dbClient->selectCollection('bookings', 'places');
    try {
        $existingBooking = $bookingsCollection->findOne(['placeId' => $data['placeId'], 'from' => $data['from'], 'to' => $data['to']]);
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

    // Neues Dokument erstellen
    $newBooking = [
        'placeId' => $data['placeId'],
        'userId' => $data['userId'],
        'from' => $data['from'],
        'to' => $data['to'],
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

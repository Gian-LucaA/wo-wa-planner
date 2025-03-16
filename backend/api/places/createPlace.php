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
    if (!isset($data['name'], $data['location'], $data['users'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Fehlende Felder in der Anfrage!']);
        exit();
    }

    try {
        $collection = $dbClient->selectCollection('place_data', 'places');
        $existingPlace = $collection->findOne(['name' => $data['name']]);
        if ($existingPlace) {
            http_response_code(409);
            echo json_encode(['error' => 'Ein Ort mit diesem Namen existiert bereits!']);
            exit();
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Fehler bei der Überprüfung des Namens: ' . $e->getMessage()]);
        exit();
    }

    // Neues Dokument erstellen
    $newPlace = [
        'name' => $data['name'],
        'location' => $data['location'],
        'imgPath' => $data['imgPath'],
        'users' => $data['users'],
    ];

    // Einfügen des Dokuments in die MongoDB
    try {
        $collection = $dbClient->selectCollection('place_data', 'places');
        $collection->insertOne($newPlace);

        http_response_code(201);
        return ['success' => 'Ort erfolgreich erstellt'];
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Fehler beim Erstellen des Ortes: ' . $e->getMessage()]);
    }
}

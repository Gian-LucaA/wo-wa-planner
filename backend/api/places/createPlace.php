<?php

function getRequest()
{
    global $logger;

    $logger->warning("GET request received on place creation endpoint, which is not allowed.");
    http_response_code(400);
    echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
    exit();
}

function postRequest()
{
    global $dbClient, $logger;

    $logger->info("POST request received to create a new place.");

    $data = json_decode(file_get_contents('php://input'), true);
    $logger->info("Received data: " . json_encode($data));

    // Überprüfen, ob alle erforderlichen Felder vorhanden sind
    if (!isset($data['name'], $data['location'], $data['users'])) {
        $logger->warning("Fehlende Felder in der Anfrage: " . json_encode($data));
        http_response_code(400);
        echo json_encode(['error' => 'Fehlende Felder in der Anfrage!']);
        exit();
    }

    try {
        $collection = $dbClient->selectCollection('place_data', 'places');
        $existingPlace = $collection->findOne(['name' => $data['name']]);
        if ($existingPlace) {
            $logger->info("Place with name '{$data['name']}' already exists.");
            http_response_code(409);
            echo json_encode(['error' => 'Ein Ort mit diesem Namen existiert bereits!']);
            exit();
        }
    } catch (Exception $e) {
        $logger->error("Fehler bei der Überprüfung des Namens: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Fehler bei der Überprüfung des Namens: ' . $e->getMessage()]);
        exit();
    }

    // Neues Dokument erstellen
    $newPlace = [
        'name' => $data['name'],
        'location' => $data['location'],
        'imgPath' => $data['imgPath'] ?? null,
        'users' => $data['users'],
    ];

    $logger->info("Attempting to insert new place: " . json_encode($newPlace));

    // Einfügen des Dokuments in die MongoDB
    try {
        $insertResult = $collection->insertOne($newPlace);
        $logger->info("New place created successfully with ID: " . $insertResult->getInsertedId());

        http_response_code(201);
        return ['success' => 'Ort erfolgreich erstellt'];
    } catch (Exception $e) {
        $logger->error("Fehler beim Erstellen des Ortes: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Fehler beim Erstellen des Ortes: ' . $e->getMessage()]);
    }
}

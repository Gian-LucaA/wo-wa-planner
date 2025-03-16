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

    echo json_encode(["fields" => $_FILES, "post" => $_POST]);

    $placeId = $_POST['place_id'];
    $file = $_FILES['image'];


    $maxFileSize = 20 * 1024 * 1024; // 5 MB

    // Überprüfen, ob die Datei erfolgreich hochgeladen wurde
    if ($file['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['error' => 'Fehler beim Hochladen der Datei!']);
        exit();
    }

    if ($file['size'] > $maxFileSize) {
        http_response_code(400);
        echo json_encode(['error' => 'Die Datei ist zu groß!']);
        exit();
    }

    // Dateiinhalt lesen
    $fileContent = file_get_contents($file['tmp_name']);

    // Datei in die Datenbank einfügen
    $collection = $dbClient->selectCollection('place_data', 'place_images');
    $collection->insertOne([
        'place_id' => $placeId,
        'file' => new MongoDB\BSON\Binary($fileContent, MongoDB\BSON\Binary::TYPE_GENERIC),
        'filename' => $file['name'],
        'filetype' => $file['type'],
    ]);

    http_response_code(200);
    return json_encode(['success' => 'Bild erfolgreich hochgeladen!']);
}

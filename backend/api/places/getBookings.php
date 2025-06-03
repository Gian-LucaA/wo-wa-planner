<?php

function getRequest()
{
  global $data, $dbClient, $logger;

  $logger->info("GET request received for booking data.");

  $placeId = isset($_GET['placeId']) ? $_GET['placeId'] : null;
  $year = isset($_GET['year']) ? intval($_GET['year']) : null;

  if (!$placeId || !$year) {
    $logger->warning("Missing required query parameters: placeId = {$placeId}, year = {$year}");
    http_response_code(400);
    echo json_encode(['error' => 'Fehlende Daten!']);
    exit();
  }

  try {
    $bookingsCollection = $dbClient->place_data->bookings;
    $usersCollection = $dbClient->users_data->users;
    $placesCollection = $dbClient->place_data->places;

    $startOfYear = new MongoDB\BSON\UTCDateTime(strtotime("$year-01-01T00:00:00Z") * 1000);
    $endOfYear = new MongoDB\BSON\UTCDateTime(strtotime("$year-12-31T23:59:59Z") * 1000);

    $logger->info("Querying bookings for placeId = {$placeId} between {$startOfYear} and {$endOfYear}");

    $bookings = $bookingsCollection->find([
      'placeId' => new MongoDB\BSON\ObjectId($placeId),
      '$or' => [
        ['from' => ['$gte' => $startOfYear, '$lte' => $endOfYear]],
        ['to' => ['$gte' => $startOfYear, '$lte' => $endOfYear]],
        ['from' => ['$lte' => $endOfYear], 'to' => ['$gte' => $startOfYear]]
      ]
    ])->toArray();

    $logger->info("Found " . count($bookings) . " bookings.");

    foreach ($bookings as &$booking) {
      if (isset($booking['userId'])) {
        $user = $usersCollection->findOne(['_id' => new MongoDB\BSON\ObjectId($booking['userId'])]);
        $place = $placesCollection->findOne(['_id' => new MongoDB\BSON\ObjectId($booking['placeId'])]);

        $booking['username'] = $user ? $user['username'] : null;
        $booking['user_color'] = $user ? $user['color'] : null;
        $booking['placeName'] = $place ? $place['name'] : null;
        $booking['location'] = $place ? $place['location'] : null;

        unset($booking['userId'], $booking['placeId'], $booking['_id']);
      }
    }

    return ["bookings" => $bookings];
  } catch (Exception $e) {
    $logger->error("Fehler beim Abrufen der Buchungsdaten: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Interner Serverfehler beim Abrufen der Buchungsdaten.']);
    exit();
  }
}

function postRequest()
{
  global $logger;

  $logger->warning("POST request received on booking-fetch endpoint, which is not allowed.");
  http_response_code(400);
  echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
  exit();
}

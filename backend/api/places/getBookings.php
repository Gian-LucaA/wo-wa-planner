<?php

function getRequest()
{
  global $data, $dbClient;

  $placeId = isset($_GET['placeId']) ? $_GET['placeId'] : null;
  $year = isset($_GET['year']) ? intval($_GET['year']) : null;

  if (!$placeId || !$year) {
    http_response_code(400);
    echo json_encode(['error' => 'Fehlende Daten!']);
    exit();
  }

  $bookingsCollection = $dbClient->place_data->bookings;
  $usersCollection = $dbClient->users_data->users;
  $placesCollection = $dbClient->place_data->places;

  $startOfYear = new MongoDB\BSON\UTCDateTime(strtotime("$year-01-01T00:00:00Z") * 1000);
  $endOfYear = new MongoDB\BSON\UTCDateTime(strtotime("$year-12-31T23:59:59Z") * 1000);

  $bookings = $bookingsCollection->find([
    'placeId' => new MongoDB\BSON\ObjectId($placeId),
    '$or' => [
      // 'from' liegt im Jahr
      ['from' => ['$gte' => $startOfYear, '$lte' => $endOfYear]],
      // 'to' liegt im Jahr
      ['to' => ['$gte' => $startOfYear, '$lte' => $endOfYear]],
      // Zeitraum überschneidet sich mit dem Jahr
      [
        'from' => ['$lte' => $endOfYear],
        'to' => ['$gte' => $startOfYear]
      ]
    ]
  ])->toArray();

  foreach ($bookings as &$booking) {
    if (isset($booking['userId'])) {
      $user = $usersCollection->findOne(['_id' => new MongoDB\BSON\ObjectId($booking['userId'])]);
      $booking['username'] = $user ? $user['username'] : null;
      $place = $placesCollection->findOne(['_id' => new MongoDB\BSON\ObjectId($booking['placeId'])]);
      $booking['placeName'] = $place ? $place['name'] : null;
      $booking['location'] = $place ? $place['location'] : null;
      unset($booking['userId'], $booking['placeId'], $booking['_id']);
    }
  }

  return ["bookings" => $bookings];
}

function postRequest()
{
  http_response_code(400);
  echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
  exit();
}

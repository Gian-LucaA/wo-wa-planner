<?php

function getRequest()
{
  global $data, $dbClient, $logger, $sessionId, $isAdmin;

  $logger->info("GET request received for booking data by user {$data['username']}");

  $placeId = isset($_GET['placeId']) ? $_GET['placeId'] : null;

  if (!$placeId) {
    $logger->warning("Missing required query parameter 'placeId'. User: {$data['username']}");
    http_response_code(400);
    echo json_encode(['error' => 'Fehlende Daten!']);
    exit();
  }

  try {
    $bookingsCollection = $dbClient->place_data->bookings;
    $now = new MongoDB\BSON\UTCDateTime((new DateTime())->getTimestamp() * 1000);

    if ($isAdmin) {
      $filter = [
        '$and' => [
          ['placeId' => new MongoDB\BSON\ObjectId($placeId)],
          ['to' => ['$gte' => $now]]
        ]
      ];
    } else {
      $filter = [
        '$and' => [
          ['userId' => new MongoDB\BSON\ObjectId($sessionId)],
          ['placeId' => new MongoDB\BSON\ObjectId($placeId)],
          ['to' => ['$gte' => $now]]
        ]
      ];
    }

    $bookings = $bookingsCollection->find($filter)->toArray();

    $bookings = array_map(function ($booking) {
      $booking['startDate'] = $booking['from']->toDateTime()->format('d.m.Y');
      $booking['endDate'] = $booking['to']->toDateTime()->format('d.m.Y');
      return $booking;
    }, $bookings);

    $logger->info("Fetched " . count($bookings) . " bookings for user {$data['username']} at place {$placeId}.");

    return ["bookings" => $bookings];
  } catch (Exception $e) {
    $logger->error("Fehler beim Abrufen der Buchungsdaten für User {$data['username']}: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Interner Serverfehler beim Abrufen der Buchungsdaten.']);
    exit();
  }
}

function postRequest()
{
  global $logger;

  $logger->warning("POST request received on booking-fetch endpoint. Not allowed.");
  http_response_code(400);
  echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
  exit();
}

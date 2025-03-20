
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

  $bookings = $bookingsCollection->find([
    'placeId' => $placeId,
    'year' => $year,
  ])->toArray();

  return ["bookings" => $bookings];
}

function postRequest()
{
  http_response_code(400);
  echo json_encode(['error' => 'Etwas ist schief gelaufen!']);
  exit();
}

<?php

require 'vendor/autoload.php';

use Mailgun\Mailgun;

function sendBookedMail(
    string $name,
    string $mailAddress,
    string $eventSummary,
    string $eventDescription,
    string $eventLocation,
    DateTime $eventStart,
    DateTime $eventEnd
) {
    global $logger;

    $mg = Mailgun::create($_ENV['MAILGUN_API_KEY'] ?? 'MAILGUN_API_KEY', 'https://api.eu.mailgun.net');

    $logger->info("Sende buchungs E-Mail: " . $name . "(" . $mailAddress . ")");

    // 1. ICS-Datei als String bauen (UTC-Zeitformat)
    $dtStart = $eventStart->format('Ymd\THis\Z');
    $dtEnd = $eventEnd->format('Ymd\THis\Z');
    $dtStamp = (new DateTime('now', new DateTimeZone('UTC')))->format('Ymd\THis\Z');
    $uid = uniqid() . '@wowaplan.toastylabs.de';

    $icsContent = <<<ICS
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//WoWaPlanner//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
UID:$uid
DTSTAMP:$dtStamp
DTSTART:$dtStart
DTEND:$dtEnd
SUMMARY:$eventSummary
DESCRIPTION:$eventDescription
LOCATION:$eventLocation
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR
ICS;

    $logger->info("Generated ICS: " . $icsContent);

    $htmlBody = '
    <html>
    <head>
        <style>
            body {
                background-color: #f2f5f7;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                margin: 0;
                padding: 0;
                color: #333;
            }
            .email-container {
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                text-align: center;
            }
            h1 {
                font-size: 22px;
                color: #1a1a1a;
                margin-bottom: 20px;
            }
            p {
                font-size: 16px;
                line-height: 1.6;
                margin: 0 0 20px 0;
            }
            .footer {
                font-size: 12px;
                color: #999;
                margin-top: 40px;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <h1>Du hast eine neue Buchugn erstellt!</h1>
            <p>Hallo ' . htmlspecialchars($name) . ',<br>
            deine Buchung wurde erfolgreich erstellt..</p>
            <p>Der Termin für die Buchung ist angehängt. Du kannst diesen in deinem Kalender abspeichern.</p>
            <div class="footer">
                © ' . date("Y") . ' WoWaPlanner – Smarte Planung
            </div>
        </div>
    </body>
    </html>';

    $textBody = "Hallo $name,\n\nDeine Registrierung wurde akzeptiert.\nDer Termin für deine Buchung ist im Anhang enthalten.\n\nViele Grüße\nWoWaPlanner";

    $result = $mg->messages()->send(
        'wowaplan.toastylabs.de',
        [
            'from'    => 'WoWaPlanner <postmaster@wowaplan.toastylabs.de>',
            'to'      => "$name <$mailAddress>",
            'subject' => 'Deine Buchung wurde akzeptiert! Termin im Anhang',
            'html'    => $htmlBody,
            'text'    => $textBody,
            'attachment' => [
                [
                    'fileContent' => $icsContent,
                    'filename'    => 'termin.ics',
                    'contentType' => 'text/calendar; method=REQUEST; charset=UTF-8'
                ]
            ]
        ]
    );


    $logger->info("Email Versand Ergebniss: " . $result->getMessage());
}

<?php

require_once __DIR__ . '/sendMail.php';

function sendBookedMail(
    string $name,
    string $mailAddress,
    string $eventSummary,
    string $eventDescription,
    string $eventLocation,
    DateTime $eventStart,
    DateTime $eventEnd
): void {
    global $logger;

    // 1. ICS-Content vorbereiten (for all-day event)
    $dtStart = $eventStart->setTime(12, 0)->format('Ymd\THis');
    $eventEnd->setTime(12, 0);
    $eventEndPlusOne = clone $eventEnd;
    $eventEndPlusOne->modify('+1 day');
    $dtEnd = $eventEndPlusOne->format('Ymd\THis');

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
DTSTART;TZID=Europe/Berlin:$dtStart
DTEND;TZID=Europe/Berlin:$dtEnd
SUMMARY:$eventSummary
DESCRIPTION:$eventDescription
LOCATION:$eventLocation
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR
ICS;

    $logger->info("Generated ICS for calendar invite: " . $icsContent);

    // HTML mail body
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
                <h1>Du hast eine neue Buchung erstellt!</h1>
                <p>Hallo ' . htmlspecialchars($name) . ',<br>
                deine Buchung wurde erfolgreich erstellt.</p>
                <p>Der Termin wurde deinem Kalender hinzugefügt (sofern unterstützt).</p>
                <div class="footer">
                    © ' . date("Y") . ' WoWaPlanner - Smarte Planung
                </div>
            </div>
        </body>
        </html>';

    // Plain text fallback
    $textBody = "Hallo {$name},\n\ndeine Buchung wurde erfolgreich erstellt.\n" .
        "Hier sind die Details:\n\n" .
        "Titel: {$eventSummary}\n" .
        "Beschreibung: {$eventDescription}\n" .
        "Ort: {$eventLocation}\n" .
        "Start: " . $eventStart->format('d.m.Y') . "\n" .
        "Ende: " . $eventEnd->format('d.m.Y') . "\n\n" .
        "WoWaPlanner – Smarte Planung";

    // Call the reusable PHPMailer-based function
    sendEmailWithInlineCalendar(
        $mailAddress,
        $name,
        'Deine Buchung wurde akzeptiert! Termin im Kalender',
        $htmlBody,
        $textBody,
        $icsContent // Include calendar invite inline
    );
}

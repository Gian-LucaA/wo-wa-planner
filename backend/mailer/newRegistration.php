<?php

require_once __DIR__ . '/sendMail.php';

function sendRegistrationReminderMail($name, $mailAddress)
{
    global $logger;

    $logger->info("Sende Erinnerung für neue Registrierung E-Mail: Gian-Luca Afting (gianlucaafting@gmail.com)");

    $toEmail = 'gianlucaafting@gmail.com';
    $toName = 'Gian-Luca Afting';
    $subject = 'Neue Registrierung auf WoWaPlan! ' . $mailAddress;

    $htmlMessage = "<p>Es gibt eine neue Registrierung auf WoWaPlan:</p>
                    <p><strong>Name:</strong> " . htmlspecialchars($name) . "<br>
                    <strong>Email:</strong> " . htmlspecialchars($mailAddress) . "</p>
                    <p>Besuche <a href='https://wowaplanner.toastylabs.de/'>wowaplanner.toastylabs.de</a> für Details.</p>";

    $plainTextMessage = "Es gibt eine neue Registrierung auf WoWaPlan:\n"
        . "Name: $name\n"
        . "Email: $mailAddress\n"
        . "Besuche wowaplanner.toastylabs.de für Details.";

    sendEmailWithInlineCalendar(
        $toEmail,
        $toName,
        $subject,
        $htmlMessage,
        $plainTextMessage,
        null // no ICS calendar invite
    );

    $logger->info("E-Mail mit PHPMailer an {$toEmail} gesendet.");
}

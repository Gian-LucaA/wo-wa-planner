<?php

require "vendor/autoload.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

function sendEmailWithInlineCalendar(
    string $toEmail,
    string $toName,
    string $subject,
    string $htmlMessage,
    ?string $altBody = null,
    ?string $icsContent = null
) {
    global $logger;
    $mail = new PHPMailer(true);

    try {
        $logger->info("Initialisiere Mailversand an {$toEmail} ({$toName})");

        $mail->isSMTP();
        $mail->SMTPAuth = true;

        $mail->Host = "smtp.gmail.com";
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->Username = $_ENV['MAIL_ADDRESS'] ?? 'MAIL_ADDRESS';
        $mail->Password = $_ENV['MAIL_PASSWORD'] ?? 'MAIL_PASSWORD';

        $mail->setFrom($mail->Username, "WoWaPlanner");
        $mail->addAddress($toEmail, $toName);

        $mail->Subject = $subject;
        $mail->isHTML(true);
        $mail->Body = $htmlMessage;
        $mail->AltBody = $altBody ?? strip_tags($htmlMessage);

        if ($icsContent) {
            $mail->addAttachment($icsContent, 'text/calendar; method=REQUEST; charset=UTF-8');
            $logger->info("ICS-Inhalt als Inline-Kalender hinzugefügt.");
        }

        $logger->info("Sende E-Mail an {$toEmail} mit Betreff '{$subject}'");

        $mail->send();
        $logger->success("E-Mail erfolgreich an {$toEmail} gesendet.");
    } catch (Exception $e) {
        $logger->error("Fehler beim E-Mail-Versand an {$toEmail}: " . $e->getMessage());
        $logger->error("Mailer ErrorInfo: " . $mail->ErrorInfo);
    }
}

<?php

require_once __DIR__ . '/sendMail.php';

function sendRegisteredMail($name, $mailAddress)
{
    global $logger;

    $logger->info("Sende Wartelisten E-Mail: {$name} ({$mailAddress})");

    $subject = 'Du bist auf der Warteliste!';

    $htmlMessage = '
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
                .button {
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #007bff;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: 600;
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
                <h1>Danke für deine Registrierung!</h1>
                <p>
                    Wir freuen uns, dass du dich bei <strong>WoWaPlan</strong> registriert hast.<br>
                    Du wirst benachrichtigt, sobald deine Registrierung akzeptiert wurde.
                </p>
                <a href="https://wowaplanner.toastylabs.de/" class="button">Zur Website</a>
                <div class="footer">
                    © ' . date("Y") . ' WoWaPlanner – Smarte Planung
                </div>
            </div>
        </body>
        </html>
    ';

    $plainTextMessage = 'Danke für deine Registrierung bei WoWaPlan! Du wirst benachrichtigt, sobald deine Registrierung akzeptiert wurde. Besuche uns auf https://wowaplanner.toastylabs.de/';

    // Use PHPMailer function
    sendEmailWithInlineCalendar(
        $mailAddress,
        $name,
        $subject,
        $htmlMessage,
        $plainTextMessage,
        null // No ICS
    );

    $logger->info("E-Mail mit PHPMailer an {$mailAddress} gesendet.");
}

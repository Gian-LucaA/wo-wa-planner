<?php

// Include the Autoloader (see "Libraries" for install instructions)
require 'vendor/autoload.php';

// Use the Mailgun class from mailgun/mailgun-php v4.2
use Mailgun\Mailgun;

function acceptedRegistrationMail($name, $mailAddress)
{
    global $logger;

    $mg = Mailgun::create($_ENV['MAILGUN_API_KEY'] ?: 'MAILGUN_API_KEY');

    $logger->info("Sende mail an " . $name . "(" . $mailAddress . ")");

    $result = $mg->messages()->send(
        'wowaplan.toastylabs.de',
        [
            'from' => 'WoWaPlanner <postmaster@wowaplan.toastylabs.de>',
            'to' => $name . ' <' . $mailAddress . '>',
            'subject' => 'Deine Registrierung wurde akzeptiert!',
            'html'    => '
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
                   <h1>Herzlich willkommen bei WoWaPlan!</h1>
                   <p>
                       Deine Registrierung wurde erfolgreich akzeptiert.<br>
                       Du kannst dich jetzt mit deinen Zugangsdaten anmelden und den Service nutzen.
                   </p>
                   <a href="https://wowaplanner.toastylabs.de/" class="button">Zur Website</a>
                    <p>
                       Solltest du fragen oder Probleme haben melde dich gerne bei mir! :D
                   </p>
                   <div class="footer">
                       © ' . date("Y") . ' WoWaPlanner – Smarte Planung
                   </div>
                </div>
            </body>
            </html>
        ',
            'text' => 'Herzlich willkommen bei WoWaPlan! Deine Registrierung wurde erfolgreich akzeptiert. Du kannst dich jetzt anmelden unter https://wowaplanner.toastylabs.de/.'
        ]
    );

    $logger->info("Email Versand Ergebniss: " . $result->getMessage());
}

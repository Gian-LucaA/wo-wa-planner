<?php

require_once __DIR__ . '/sendMail.php';

function sendOneTimePasswordMail($name, $mailAddress, $otp)
{
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
                .otp {
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #007bff;
                    color: #ffffff;
                    font-size: 18px;
                    font-weight: bold;
                    border-radius: 6px;
                    margin-top: 10px;
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
               <h1>Einmaliges Passwort fuer deinen Zugriff</h1>
               <p>Hallo ' . htmlspecialchars($name) . ',
                   Hier dein einmal Passwort (OTP). Du kannst es verwenden um dich normal einzuloggen und dann ein neues eigenes Passwort zu setzten.
               </p>
               <div class="otp">' . htmlspecialchars($otp) . '</div>
               <p/>
               <p>
                   Dieses Passwort ist nur einmal gueltig und lauft nach 20 Minuten ab. Wenn es abgelaufen ist, musst du ein neues anfordern.
                   Gib es bitte nicht an Dritte weiter.
               </p>
               <p>
                   Wenn du dieses Passwort nicht angefordert hast, kannst du diese E-Mail ignorieren.
               </p>
               <div class="footer">© ' . date("Y") . ' WoWaPlanner - Smarte Planung</div>
            </div>
        </body>
        </html>
    ';

    $plainTextMessage = "Hallo $name,\n\nDein einmaliges Passwort lautet: $otp\n\nDieses Passwort ist nur einmal gültig und läuft nach 20 Minuten ab.\n\nWenn du es nicht angefordert hast, kannst du diese E-Mail ignorieren.\n\n© " . date("Y") . " WoWaPlanner - Smarte Planung";

    sendEmailWithInlineCalendar(
        $mailAddress,
        $name,
        'Dein einmaliges Passwort (OTP)',
        $htmlMessage,
        $plainTextMessage,
        null
    );
}

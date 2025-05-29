<?php

// Include the Autoloader (see "Libraries" for install instructions)
require 'vendor/autoload.php';

// Use the Mailgun class from mailgun/mailgun-php v4.2
use Mailgun\Mailgun;

function sendRegistrationReminderMail($name, $mailAddress)
{
    global $logger;

    $logger->info("Sende Erinnerung für neue Regristration E-Mail: Gian-Luca Afting (gianlucaafting@gmail.com)");

    $mg = Mailgun::create($_ENV['MAILGUN_API_KEY'] ?: 'MAILGUN_API_KEY');

    $result = $result = $mg->messages()->send(
        'wowaplan.toastylabs.de',
        [
            'from' => 'WoWaPlanner <postmaster@wowaplan.toastylabs.de>',
            'to' => 'Gian-Luca Afting <gianlucaafting@gmail.com>',
            'subject' => 'Neue Registrierung auf WoWaPlan!' . $mailAddress,
            'text' => 'Es gibt eine neue Registrierung auf WoWaPlan: ' . $name . '(' . $mailAddress . ') general-alcazar.toastylabs.de/'
        ]
    );


    $logger->info("Email Versand Ergebniss: " . $result->getMessage());
}

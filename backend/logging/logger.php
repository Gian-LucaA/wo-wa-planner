<?php

class Logger
{
    private string $logFile;

    public function __construct(string $logFile = __DIR__ . '/logs/app.log')
    {
        $this->logFile = $logFile;
    }

    private function maskSensitiveData(string $message): string
    {
        $patterns = [
            '/("?(password|token|session_id)"?\s*[:=]\s*)("[^"]*"|\'[^\']*\'|[a-zA-Z0-9\-_\.]+)/i',
            '/(Bearer\s+)[a-zA-Z0-9\-_\.]+/i'
        ];
        $replacements = [
            '$1"***MASKIERT***"',
            '$1***MASKIERT***'
        ];
        return preg_replace($patterns, $replacements, $message);
    }

    private function writeLog(string $level, string $message): void
    {
        $timestamp = (new DateTime())->format('Y-m-d H:i:s');
        $levelTag = strtoupper($level);
        // Maskiere sensible Daten vor dem Loggen
        $maskedMessage = $this->maskSensitiveData($message);
        $logEntry = "[$timestamp] [$levelTag] $maskedMessage" . PHP_EOL;
        $result = file_put_contents($this->logFile, $logEntry, FILE_APPEND);
        if ($result === false) {
            error_log("❌ Konnte nicht in Logdatei schreiben: {$this->logFile}");
        }
    }

    public function error(string $message): void
    {
        $this->writeLog('error', $message);
    }

    public function warning(string $message): void
    {
        $this->writeLog('warning', $message);
    }

    public function info(string $message): void
    {
        $this->writeLog('info', $message);
    }

    public function success(string $message): void
    {
        $this->writeLog('success', $message);
    }
}

<?php

class Logger
{
    private string $logFile;

    public function __construct(string $logFile = __DIR__ . '/app.log')
    {
        $this->logFile = $logFile;
    }

    private function writeLog(string $level, string $message): void
    {
        $timestamp = (new DateTime())->format('Y-m-d H:i:s');
        $levelTag = strtoupper($level);
        $logEntry = "[$timestamp] [$levelTag] $message" . PHP_EOL;
        $result = file_put_contents($this->logFile, $logEntry, FILE_APPEND);
        if ($result === false) {
            error_log("❌ Konnte nicht in Logdatei schreiben: {$this->logFile}");
        } else {
            error_log("✅ Log geschrieben: {$logEntry}");
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

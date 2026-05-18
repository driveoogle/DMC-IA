<?php
/**
 * DMC IA — "Notify me" handler
 * Saves email to a local list and sends notification to admin
 */

header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false]);
    exit;
}

$email = trim($_POST['email'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email']);
    exit;
}

$email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');

// ── Rate limiting ────────────────────────────────────────────────────────────
$ip       = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$lockFile = sys_get_temp_dir() . '/dmcia_notify_' . md5($ip) . '.lock';
if (file_exists($lockFile) && (time() - filemtime($lockFile)) < 300) {
    // Silently succeed to avoid enumeration
    echo json_encode(['success' => true]);
    exit;
}
touch($lockFile);

// ── Save to local file (append) ──────────────────────────────────────────────
$listFile = __DIR__ . '/../data/notify_list.txt';
$dataDir  = dirname($listFile);

if (!is_dir($dataDir)) {
    mkdir($dataDir, 0750, true);
}

$line = date('Y-m-d H:i:s') . ' | ' . $email . "\n";
file_put_contents($listFile, $line, FILE_APPEND | LOCK_EX);

// ── Notify admin ─────────────────────────────────────────────────────────────
$subject = '[DMC IA] New notify signup: ' . $email;
$body    = "New email signup on dmc-ia.com\n\nEmail: {$email}\nDate:  " . date('Y-m-d H:i:s') . "\nIP:    {$ip}\n";
$headers = "From: no-reply@dmc-ia.com\r\nContent-Type: text/plain; charset=UTF-8\r\n";

mail('contact@dmc-ia.com', $subject, $body, $headers);

echo json_encode(['success' => true]);

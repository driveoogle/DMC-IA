<?php
/**
 * DMC IA — "Notify me" handler
 * Saves email to a local list and sends notification to admin
 */

header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    echo json_encode(['success' => false]);
    exit;
}

$email = trim($_POST['email'] ?? '');

// Bound the input before any further processing.
if (strlen($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email']);
    exit;
}

// FILTER_VALIDATE_EMAIL already rejects CR/LF, but the address is interpolated
// into mail headers and a log line, so reject control characters explicitly.
if (preg_match('/[\x00-\x1F\x7F]/', $email)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email']);
    exit;
}

// ── Rate limiting ────────────────────────────────────────────────────────────
$ip       = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$lockFile = sys_get_temp_dir() . '/dmcia_notify_' . hash('sha256', $ip) . '.lock';
if (file_exists($lockFile) && (time() - filemtime($lockFile)) < 300) {
    // Silently succeed to avoid enumeration
    echo json_encode(['success' => true]);
    exit;
}
touch($lockFile);

// ── Save to local file (append) ──────────────────────────────────────────────
// The list holds personal data and must never sit under the document root,
// where it would be downloadable (robots.txt is not an access control).
$dataDir  = getenv('DMCIA_DATA_DIR') ?: dirname(__DIR__, 2) . '/dmcia-private';
$listFile = $dataDir . '/notify_list.txt';

if (!is_dir($dataDir)) {
    mkdir($dataDir, 0700, true);
}

// Defence in depth for hosts that keep the directory inside the web root.
$htaccess = $dataDir . '/.htaccess';
if (!file_exists($htaccess)) {
    file_put_contents($htaccess, "Require all denied\nDeny from all\n");
}

$line = date('Y-m-d H:i:s') . ' | ' . $email . "\n";
if (file_put_contents($listFile, $line, FILE_APPEND | LOCK_EX) !== false) {
    chmod($listFile, 0600);
}

// ── Notify admin ─────────────────────────────────────────────────────────────
$subject = '[DMC IA] New notify signup';
$body    = "New email signup on dmc-ia.com\n\nEmail: {$email}\nDate:  " . date('Y-m-d H:i:s') . "\nIP:    {$ip}\n";
$headers = "From: no-reply@dmc-ia.com\r\nContent-Type: text/plain; charset=UTF-8\r\n";

mail('contact@dmc-ia.com', $subject, $body, $headers);

echo json_encode(['success' => true]);

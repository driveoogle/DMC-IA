<?php
/**
 * DMC IA — Contact form handler
 * Receives POST, validates, sends email and creates lead in dmc-ia-crm (HubSpot)
 */

header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

function clean(string $val): string {
    return htmlspecialchars(strip_tags(trim($val)), ENT_QUOTES, 'UTF-8');
}

$name    = clean($_POST['name']    ?? '');
$email   = clean($_POST['email']   ?? '');
$company = clean($_POST['company'] ?? '');
$subject = clean($_POST['subject'] ?? '');
$message = clean($_POST['message'] ?? '');
$lang    = in_array($_POST['lang'] ?? 'fr', ['en', 'pt', 'fr']) ? $_POST['lang'] : 'fr';

if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email address']);
    exit;
}

$ip       = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$lockFile = sys_get_temp_dir() . '/dmcia_' . md5($ip) . '.lock';
if (file_exists($lockFile) && (time() - filemtime($lockFile)) < 60) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Too many requests']);
    exit;
}
touch($lockFile);

// ── Envoyer l'email ──────────────────────────────────────────────────────────
$to      = 'contact@dmc-ia.com';
$subjectLine = $subject
    ? '[DMC IA Contact] ' . $subject
    : '[DMC IA Contact] New message from ' . $name;

$companyLine = $company ? "Company:  {$company}\n" : '';

$body = <<<TEXT
New contact form submission from dmc-ia.com
============================================

Name:     {$name}
Email:    {$email}
{$companyLine}Language: {$lang}

Message:
--------
{$message}

============================================
Sent from dmc-ia.com contact form
TEXT;

$headers  = "From: no-reply@dmc-ia.com\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail($to, $subjectLine, $body, $headers);

// ── Créer le lead dans dmc-ia-crm (HubSpot) — non-bloquant ──────────────────
$crmPayload = json_encode([
    'name'    => $name,
    'email'   => $email,
    'company' => $company,
    'subject' => $subject,
    'message' => $message,
    'lang'    => $lang,
]);

$ch = curl_init('https://dmc-ia-crm-ten.vercel.app/api/contacts');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $crmPayload,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json', 'Content-Length: ' . strlen($crmPayload)],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 5,
    CURLOPT_SSL_VERIFYPEER => true,
]);
curl_exec($ch);
curl_close($ch);

// ── Réponse ──────────────────────────────────────────────────────────────────
if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Mail delivery failed']);
}

<?php
/**
 * DMC IA — Contact form handler
 * Receives POST, validates, sends email and creates lead in dmc-ia-crm (HubSpot)
 */

header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

/**
 * Normalises a free-text field for a plain-text email body: strips markup,
 * removes control characters (which could forge mail headers) and caps the
 * length so a single request cannot be used to send an unbounded payload.
 */
function clean(string $val, int $max = 2000): string {
    $val = strip_tags(trim($val));
    $val = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $val);
    return mb_substr($val, 0, $max);
}

/** Single-line fields must not contain CR/LF at all — they reach mail headers. */
function cleanLine(string $val, int $max = 200): string {
    return str_replace(["\r", "\n"], ' ', clean($val, $max));
}

$name    = cleanLine($_POST['name']    ?? '');
$email   = cleanLine($_POST['email']   ?? '', 254);
$company = cleanLine($_POST['company'] ?? '');
$subject = cleanLine($_POST['subject'] ?? '');
$message = clean($_POST['message']  ?? '', 5000);
$lang    = in_array($_POST['lang'] ?? 'fr', ['en', 'pt', 'fr'], true) ? $_POST['lang'] : 'fr';

if ($name === '' || $email === '' || $message === '') {
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
$lockFile = sys_get_temp_dir() . '/dmcia_' . hash('sha256', $ip) . '.lock';
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

// Forward the lead to the CRM. POST /api/contacts is the CRM's public,
// write-only lead endpoint (it creates/updates a HubSpot contact); it needs
// no credential. Override with CRM_LEADS_URL if the endpoint ever moves.
$crmUrl = getenv('CRM_LEADS_URL') ?: 'https://dmc-ia-crm-ten.vercel.app/api/contacts';

$ch = curl_init($crmUrl);
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $crmPayload,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'Content-Length: ' . strlen($crmPayload),
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 5,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_FOLLOWLOCATION => false,
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

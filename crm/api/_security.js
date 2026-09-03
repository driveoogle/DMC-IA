/**
 * Shared security helpers for the DMC IA CRM API.
 *
 * These endpoints proxy a HubSpot private-app token that can read and write
 * every contact of the account, so each one must be authenticated and must not
 * be callable from arbitrary origins.
 *
 * Environment:
 *   CRM_API_TOKEN       required — shared secret expected in `Authorization:
 *                       Bearer <token>` (or the `x-api-key` header).
 *   CRM_ALLOWED_ORIGINS optional — comma-separated list of browser origins
 *                       allowed to call the API. When unset, no CORS headers
 *                       are emitted and only same-origin / server-side callers
 *                       can reach the endpoints.
 */

function allowedOrigins() {
  return (process.env.CRM_ALLOWED_ORIGINS || '')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);
}

function applyCors(req, res) {
  const origin = req.headers.origin;
  const allowed = allowedOrigins();

  // Vary on Origin so a cached response for one origin is never replayed
  // for another.
  res.setHeader('Vary', 'Origin');

  if (origin && allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
}

/**
 * Constant-time string comparison, so a wrong token cannot be recovered by
 * timing the rejection.
 */
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function presentedToken(req) {
  const auth = req.headers.authorization || '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  return bearer || (req.headers['x-api-key'] || '').trim();
}

/**
 * Runs CORS, preflight, method and authentication checks.
 * Returns true when the handler may continue; when it returns false the
 * response has already been sent.
 */
export function guard(req, res, { methods }) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cache-Control', 'no-store');

  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', [...methods, 'OPTIONS'].join(', '));
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
    res.setHeader('Access-Control-Max-Age', '600');
    res.status(204).end();
    return false;
  }

  if (!methods.includes(req.method)) {
    res.setHeader('Allow', [...methods, 'OPTIONS'].join(', '));
    res.status(405).json({ error: 'Method not allowed' });
    return false;
  }

  const expected = process.env.CRM_API_TOKEN;
  if (!expected) {
    // Fail closed: without a configured secret the endpoint would be public.
    res.status(503).json({ error: 'API not configured' });
    return false;
  }

  if (!safeEqual(presentedToken(req), expected)) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }

  return true;
}

export function hubspotToken(res) {
  const token = process.env.HUBSPOT_TOKEN;
  if (!token) {
    res.status(503).json({ error: 'CRM backend not configured' });
    return null;
  }
  return token;
}

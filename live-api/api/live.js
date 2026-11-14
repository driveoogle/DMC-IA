// Vercel serverless function: checks a viewer's password and returns the YouTube video id.
// Env vars (Vercel project settings):
//   LIVE_ACCESS      = "marie:motdepasse1,paul:motdepasse2"   (one entry per viewer)
//   LIVE_JWT_PEM     = base64 of an RSA private key (PEM) used to sign playback tokens
//   LIVE_JWT_KID     = key id (any string, e.g. "dmcprint-1")
//   LIVE_HLS_URL     = public HLS playlist URL, e.g. https://live.dmc-ia.com/live/index.m3u8
const crypto = require('crypto');

const ALLOWED_ORIGINS = ['https://dmc-ia.com', 'https://www.dmc-ia.com'];

function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function b64url(x) {
  return Buffer.from(x).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

// Short-lived JWT that MediaMTX (authMethod: jwt) accepts for reading the 'live' path.
function signToken(ttl) {
  const kid = process.env.LIVE_JWT_KID;
  const now = Math.floor(Date.now() / 1000);
  const head = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT', kid }));
  const body = b64url(JSON.stringify({
    iat: now, nbf: now - 30, exp: now + ttl,
    mediamtx_permissions: [{ action: 'read', path: 'live' }]
  }));
  const pem = Buffer.from(process.env.LIVE_JWT_PEM, 'base64').toString('utf8');
  const sig = crypto.createSign('RSA-SHA256').update(head + '.' + body).sign(pem);
  return head + '.' + body + '.' + b64url(sig);
}

module.exports = async (req, res) => {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const user = String(body.user || '').trim().toLowerCase();
  const password = String(body.password || '');

  const access = {};
  (process.env.LIVE_ACCESS || '').split(',').forEach((pair) => {
    const i = pair.indexOf(':');
    if (i > 0) access[pair.slice(0, i).trim().toLowerCase()] = pair.slice(i + 1);
  });

  // Always do one comparison and a small delay to slow down guessing.
  const expected = Object.prototype.hasOwnProperty.call(access, user) ? access[user] : crypto.randomBytes(16).toString('hex');
  const valid = safeEqual(password, expected) && Object.prototype.hasOwnProperty.call(access, user);
  await new Promise((r) => setTimeout(r, 600));

  if (!valid || !process.env.LIVE_JWT_PEM || !process.env.LIVE_HLS_URL) return res.status(401).json({ ok: false });
  const token = signToken(6 * 3600);
  return res.status(200).json({ ok: true, hls: process.env.LIVE_HLS_URL, token });
};

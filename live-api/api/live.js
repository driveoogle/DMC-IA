// Vercel serverless function: checks a viewer's password and returns the YouTube video id.
// Env vars (Vercel project settings):
//   LIVE_VIDEO_ID  = id of the unlisted YouTube live (e.g. dQw4w9WgXcQ)
//   LIVE_ACCESS    = "marie:motdepasse1,paul:motdepasse2"   (one entry per viewer)
const crypto = require('crypto');

const ALLOWED_ORIGINS = ['https://dmc-ia.com', 'https://www.dmc-ia.com'];

function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
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

  if (!valid || !process.env.LIVE_VIDEO_ID) return res.status(401).json({ ok: false });
  return res.status(200).json({ ok: true, videoId: process.env.LIVE_VIDEO_ID });
};

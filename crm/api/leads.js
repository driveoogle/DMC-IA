import { publicFormGuard, hubspotToken } from './_security.js';

/**
 * Public contact-form endpoint: creates (or updates) a HubSpot contact from a
 * submission on dmc-ia.com.
 *
 * This is the only endpoint callable without the CRM shared secret, because the
 * website has no credential to present. It is safe to be public because it is
 * WRITE-ONLY: it never returns stored CRM data, so it cannot be used to read
 * the contact base the way the old public `/api/contacts` could. The HubSpot
 * token stays server-side and is never exposed to the browser.
 *
 * Abuse is limited by: origin restriction, a honeypot field, per-IP rate
 * limiting, strict input validation and length caps. For robust distributed
 * rate limiting across serverless instances, back RATE_STORE with Vercel KV /
 * Upstash — the in-memory limiter below is best-effort per warm instance.
 */

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;
const rateStore = new Map(); // ip -> [timestamps]

function rateLimited(ip) {
  const now = Date.now();
  const hits = (rateStore.get(ip) || []).filter(t => now - t < RATE_WINDOW_MS);
  hits.push(now);
  rateStore.set(ip, hits);
  // Opportunistic cleanup so the map cannot grow unbounded on a warm instance.
  if (rateStore.size > 5000) {
    for (const [k, v] of rateStore) {
      if (v.every(t => now - t >= RATE_WINDOW_MS)) rateStore.delete(k);
    }
  }
  return hits.length > RATE_MAX;
}

function clean(val, max) {
  if (typeof val !== 'string') return '';
  // Strip control characters and cap the length.
  return val.replace(/[\x00-\x1F\x7F]/g, " ").trim().slice(0, max);
}

function isEmail(str) {
  return typeof str === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str) && str.length <= 254;
}

export default async function handler(req, res) {
  if (!publicFormGuard(req, res, { methods: ['POST'] })) return;

  const token = hubspotToken(res);
  if (!token) return;

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
    || req.socket?.remoteAddress || 'unknown';
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'invalid body' });
  }

  // Honeypot: real users never fill a hidden field. Pretend success for bots.
  if (clean(body.website || body._gotcha || '', 100)) {
    return res.status(200).json({ ok: true });
  }

  const email = clean(body.email, 254);
  const name = clean(body.name, 200);
  const phone = clean(body.phone, 40);
  const company = clean(body.company, 200);
  const subject = clean(body.subject, 200);
  const message = clean(body.message, 5000);
  const lang = ['fr', 'en', 'pt'].includes(body.lang) ? body.lang : 'fr';

  if (!isEmail(email) || !name || !message) {
    return res.status(400).json({ error: 'name, valid email and message are required' });
  }

  const [firstname, ...rest] = name.split(/\s+/);
  const properties = {
    email,
    firstname,
    lastname: rest.join(' '),
    phone,
    company,
    subject__c: subject,
    message__c: message,
    hs_lead_status: 'NEW',
  };

  try {
    const ok = await upsertContact(token, email, properties);
    if (!ok) return res.status(502).json({ error: 'Upstream error' });
    return res.status(201).json({ ok: true });
  } catch (e) {
    console.error('leads handler error', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}

/**
 * Create the contact; if it already exists (409), look it up by email and
 * update it instead. Returns true on success.
 */
async function upsertContact(token, email, properties) {
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const create = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    method: 'POST',
    headers,
    body: JSON.stringify({ properties }),
  });
  if (create.ok) return true;
  if (create.status !== 409) {
    console.error('HubSpot create failed', create.status);
    return false;
  }

  // Existing contact — find its id by email, then patch.
  const search = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: email }] }],
      properties: ['email'],
      limit: 1,
    }),
  });
  if (!search.ok) {
    console.error('HubSpot search failed', search.status);
    return false;
  }
  const found = await search.json();
  const id = found.results?.[0]?.id;
  if (!id) return false;

  // Don't overwrite an existing lead status on update.
  const { hs_lead_status, ...updatable } = properties;
  const patch = await fetch(
    `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(id)}`,
    { method: 'PATCH', headers, body: JSON.stringify({ properties: updatable }) }
  );
  if (!patch.ok) {
    console.error('HubSpot update failed', patch.status);
    return false;
  }
  return true;
}

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

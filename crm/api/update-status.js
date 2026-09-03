import { guard, hubspotToken } from './_security.js';

const ALLOWED_STATUS = ['NEW', 'OPEN', 'IN_PROGRESS', 'QUALIFIED', 'UNQUALIFIED'];

export default async function handler(req, res) {
  if (!guard(req, res, { methods: ['PATCH'] })) return;

  const token = hubspotToken(res);
  if (!token) return;

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'invalid body' });
  }

  const { id, status } = body;

  // HubSpot contact ids are numeric. Anything else would be interpolated into
  // the API path and could escape it (e.g. "1/../../../objects/deals").
  if (typeof id !== 'string' && typeof id !== 'number') {
    return res.status(400).json({ error: 'id and status required' });
  }
  const contactId = String(id);
  if (!/^[0-9]{1,32}$/.test(contactId)) {
    return res.status(400).json({ error: 'invalid id' });
  }

  if (typeof status !== 'string' || !ALLOWED_STATUS.includes(status)) {
    return res.status(400).json({ error: 'invalid status' });
  }

  try {
    const r = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(contactId)}`,
      {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ properties: { hs_lead_status: status } })
      }
    );

    if (!r.ok) {
      console.error('HubSpot status update failed', r.status);
      return res.status(r.status === 404 ? 404 : 502).json({ error: 'Upstream error' });
    }

    const data = await r.json();
    res.status(200).json({ id: data.id, status: data.properties?.hs_lead_status ?? status });
  } catch (e) {
    console.error('update-status handler error', e);
    res.status(500).json({ error: 'Internal error' });
  }
}

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

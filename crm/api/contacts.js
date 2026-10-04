import { guard, hubspotToken } from './_security.js';

export default async function handler(req, res) {
  if (!guard(req, res, { methods: ['GET'] })) return;

  const token = hubspotToken(res);
  if (!token) return;

  try {
    const fields = 'email,firstname,lastname,company,phone,hs_lead_status,subject__c,message__c,createdate';
    const url = `https://api.hubapi.com/crm/v3/objects/contacts?properties=${fields}&limit=100&sort=-createdate`;
    const r = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    const data = await r.json();
    if (!r.ok) {
      // Never forward the upstream body: HubSpot errors can echo the request,
      // including the private-app token.
      console.error('HubSpot contacts fetch failed', r.status);
      return res.status(502).json({ error: 'Upstream error' });
    }

    const contacts = (data.results || []).map(c => ({
      id: c.id,
      name: [c.properties.firstname, c.properties.lastname].filter(Boolean).join(' ') || '—',
      email: c.properties.email || '—',
      company: c.properties.company || '—',
      status: c.properties.hs_lead_status || 'NEW',
      createdAt: c.properties.createdate,
    }));

    res.status(200).json({ contacts, total: contacts.length });
  } catch (e) {
    console.error('contacts handler error', e);
    res.status(500).json({ error: 'Internal error' });
  }
}

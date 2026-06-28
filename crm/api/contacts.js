export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = process.env.HUBSPOT_TOKEN;
  if (!token) return res.status(500).json({ error: 'HUBSPOT_TOKEN not configured' });

  try {
    const fields = 'email,firstname,lastname,company,phone,hs_lead_status,subject__c,message__c,createdate';
    const url = `https://api.hubapi.com/crm/v3/objects/contacts?properties=${fields}&limit=100&sort=-createdate`;
    const r = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);

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
    res.status(500).json({ error: e.message });
  }
}

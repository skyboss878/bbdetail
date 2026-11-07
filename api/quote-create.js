const crypto = require('crypto');
const SERVICES = require('../lib/services');
const sms = require('../lib/sms');
const AT = 'https://api.airtable.com/v0/appNp2qvT32FiDGlC/Quotes';

module.exports = async (req, res) => {
  if (req.method === 'GET') return res.json(SERVICES);
  if (req.method !== 'POST') return res.status(405).end();
  if (req.headers['x-admin-key'] !== process.env.ADMIN_KEY) return res.status(401).json({ error: 'unauthorized' });
  try {
    const { name, phone, vehicle, ids } = req.body || {};
    const items = SERVICES.filter(s => (ids || []).includes(s.id)).map(({ name, price }) => ({ name, price }));
    if (!name || !phone || !items.length) return res.status(400).json({ error: 'name, phone, services required' });
    const total = items.reduce((a, i) => a + i.price, 0);
    const token = crypto.randomBytes(8).toString('hex');
    let to = String(phone).replace(/\D/g, '');
    if (to.length === 10) to = '1' + to;
    to = '+' + to;
    const r = await fetch(AT, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + process.env.AIRTABLE_TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: { Name: name, Phone: to, Vehicle: vehicle || '', Items: JSON.stringify(items), Total: total, Status: 'Sent', Token: token } })
    });
    if (!r.ok) throw new Error('Airtable ' + r.status + ' ' + (await r.text()));
    const link = `https://bakersfieldsbestmobiledetailing.com/quote.html?t=${token}`;
    await sms(to, `Hi ${name}, here's your quote from Bakersfield's Best Mobile Detailing ($${total}). Review and approve here: ${link}`);
    res.json({ ok: true, link, total });
  } catch (e) { res.status(500).json({ error: String(e.message || e) }); }
};

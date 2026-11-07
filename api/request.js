const crypto = require('crypto');
const SERVICES = require('../lib/services');
const sms = require('../lib/sms');
const AT = 'https://api.airtable.com/v0/appNp2qvT32FiDGlC/Quotes';

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const b = req.body || {};
    if (b.website) return res.json({ ok: true }); // honeypot for bots
    const clean = (v, n) => String(v || '').trim().slice(0, n);
    const name = clean(b.name, 80), address = clean(b.address, 200);
    const vehicle = clean(b.vehicle, 80), notes = clean(b.notes, 500), preferred = clean(b.preferred, 80);
    let d = String(b.phone || '').replace(/\D/g, '');
    if (d.length === 10) d = '1' + d;
    if (d.length !== 11) return res.status(400).json({ error: 'Please enter a valid phone number.' });
    const phone = '+' + d;
    const items = SERVICES.filter(s => (b.ids || []).includes(s.id)).map(({ name, price }) => ({ name, price }));
    if (!name || !address || !items.length) return res.status(400).json({ error: 'Name, address and at least one service are required.' });
    const total = items.reduce((a, i) => a + i.price, 0);
    const token = crypto.randomBytes(8).toString('hex');
    const ticket = 'BB-' + token.slice(0, 5).toUpperCase();
    const r = await fetch(AT, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + process.env.AIRTABLE_TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: { Name: name, Phone: phone, Vehicle: vehicle, Address: address, Preferred: preferred, Notes: notes, Items: JSON.stringify(items), Total: total, Status: 'Requested', Token: token, Ticket: ticket } })
    });
    if (!r.ok) throw new Error('Airtable ' + r.status + ' ' + (await r.text()));
    // Ticket is saved. Texts are best-effort so an SMS problem never loses a request.
    if (process.env.OWNER_PHONE) {
      try { await sms(process.env.OWNER_PHONE, `NEW REQUEST ${ticket}: ${name} ${phone} | ${vehicle || 'no vehicle'} | ${address} | ${items.map(i => i.name).join(', ')} ($${total}) | ${preferred || 'no time given'}${notes ? ' | ' + notes : ''}`); } catch (e) { console.error(e); }
    }
    try { await sms(phone, `Thanks ${name}! Your request ${ticket} was received by Bakersfield's Best Mobile Detailing. We'll text you shortly to confirm your appointment.`); } catch (e) { console.error(e); }
    res.json({ ok: true, ticket, total });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Something went wrong. Please call or text us instead.' }); }
};

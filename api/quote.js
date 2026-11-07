const sms = require('../lib/sms');
const AT = 'https://api.airtable.com/v0/appNp2qvT32FiDGlC/Quotes';
const H = { Authorization: 'Bearer ' + process.env.AIRTABLE_TOKEN, 'Content-Type': 'application/json' };

async function find(t) {
  const q = encodeURIComponent(`{Token}='${String(t).replace(/[^a-f0-9]/gi, '')}'`);
  const r = await fetch(`${AT}?filterByFormula=${q}&maxRecords=1`, { headers: H });
  if (!r.ok) throw new Error('Airtable ' + r.status);
  return (await r.json()).records[0];
}

module.exports = async (req, res) => {
  try {
    const t = req.method === 'GET' ? req.query.t : (req.body || {}).t;
    const rec = t && (await find(t));
    if (!rec) return res.status(404).json({ error: 'not found' });
    const f = rec.fields;
    if (req.method === 'GET') {
      return res.json({ name: f.Name, vehicle: f.Vehicle, items: JSON.parse(f.Items || '[]'), total: f.Total, status: f.Status });
    }
    const action = (req.body || {}).action;
    if (!['approve', 'decline'].includes(action) || f.Status !== 'Sent') return res.status(400).json({ error: 'invalid' });
    const status = action === 'approve' ? 'Approved' : 'Declined';
    const u = await fetch(`${AT}/${rec.id}`, {
      method: 'PATCH', headers: H,
      body: JSON.stringify({ fields: { Status: status, RespondedAt: new Date().toISOString() } })
    });
    if (!u.ok) throw new Error('Airtable update ' + u.status);
    if (process.env.OWNER_PHONE) {
      try { await sms(process.env.OWNER_PHONE, `${f.Name} ${status.toUpperCase()} their quote ($${f.Total}) - ${f.Vehicle || 'no vehicle listed'} - ${f.Phone}`); } catch (e) { console.error(e); }
    }
    res.json({ ok: true, status });
  } catch (e) { res.status(500).json({ error: String(e.message || e) }); }
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { name, phone, email, vehicle, size, plan, day } = req.body || {};
  if (!name || !phone || !size) return res.status(400).json({ error: 'Missing fields' });
  const r = await fetch('https://api.airtable.com/v0/appNp2qvT32FiDGlC/Memberships', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ typecast: true, fields: {
      Name: name, Phone: phone, Email: email || '', Vehicle: vehicle || '',
      Size: size, Plan: plan || 'Maintenance', 'Preferred Day': day || '', Status: 'New' } })
  });
  if (!r.ok) { console.error(await r.text()); return res.status(502).json({ error: 'Save failed' }); }
  res.json({ ok: true });
};

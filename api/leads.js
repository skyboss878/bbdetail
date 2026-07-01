export default async function handler(req, res) {
  const BASE = process.env.AIRTABLE_BASE_ID
  const TABLE = process.env.AIRTABLE_TABLE_ID
  const TOKEN = process.env.AIRTABLE_TOKEN
  const headers = { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }

  if (req.method === 'GET') {
    try {
      const r = await fetch(`https://api.airtable.com/v0/${BASE}/${TABLE}?sort[0][field]=Date&sort[0][direction]=desc&maxRecords=100`, { headers })
      const data = await r.json()
      const leads = (data.records || []).map(rec => ({
        id: rec.id,
        name: rec.fields.Name || '',
        phone: rec.fields.Phone || '',
        email: rec.fields.Email || '',
        service: rec.fields.Service || '',
        address: rec.fields.Address || '',
        notes: rec.fields.Notes || '',
        source: rec.fields.Source || 'website',
        status: rec.fields.Status || 'new',
        date: rec.fields.Date ? new Date(rec.fields.Date).toLocaleDateString('en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }) : '',
        type: rec.fields.Service?.includes('appt:') ? 'appointment' : 'lead',
        time: rec.fields.Notes?.match(/time:(\d+:\d+)/)?.[1] || '',
        dateRaw: rec.fields.Date || '',
      }))
      const appointments = leads.filter(l => l.notes?.startsWith('appt:')).map(l => ({
        ...l,
        date: l.notes.match(/date:([^|]+)/)?.[1]?.trim() || '',
        time: l.notes.match(/time:([^|]+)/)?.[1]?.trim() || '',
      }))
      return res.status(200).json({ leads: leads.filter(l => !l.notes?.startsWith('appt:')), appointments })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'PATCH') {
    const { id, status } = req.body
    try {
      await fetch(`https://api.airtable.com/v0/${BASE}/${TABLE}/${id}`, {
        method: 'PATCH', headers,
        body: JSON.stringify({ fields: { Status: status } })
      })
      return res.status(200).json({ ok: true })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'POST') {
    const { type, name, phone, service, time, date, notes } = req.body
    try {
      await fetch(`https://api.airtable.com/v0/${BASE}/${TABLE}`, {
        method: 'POST', headers,
        body: JSON.stringify({
          records: [{ fields: {
            Name: name, Phone: phone || '', Service: service || '',
            Notes: `appt: | date:${date} | time:${time} | ${notes || ''}`,
            Source: 'manual', Status: 'confirmed',
            Date: new Date().toISOString(),
          }}]
        })
      })
      return res.status(200).json({ ok: true })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).end()
}

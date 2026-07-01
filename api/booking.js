export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { name, phone, email, service, address, message } = req.body
  if (!name || !phone || !service) return res.status(400).json({ error: 'Missing fields' })

  try {
    await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [{
          fields: {
            Name: name,
            Phone: phone,
            Email: email || '',
            Service: service,
            Address: address || '',
            Notes: message || '',
            Source: 'website',
            Status: 'new',
            Date: new Date().toISOString(),
          }
        }]
      })
    })
  } catch (err) {
    console.error('Airtable error:', err)
  }

  return res.status(200).json({ ok: true })
}

const BASE  = process.env.AIRTABLE_BASE_ID
const TABLE = process.env.AIRTABLE_TABLE_ID
const TOKEN = process.env.AIRTABLE_TOKEN

const SLOTS = ['9:00 AM', '12:00 PM', '3:00 PM']

const SYSTEM = `You are the booking agent for Bakersfield's Best Mobile Detailing (Bakersfield, CA). We come to the customer.
Services: Exterior Detail ($80+), Interior Detail ($100+), Full Detail ($160+), Paint Correction ($250+), Ceramic Coating: Essential $500, Signature $900, Elite $1400+. Fleet Detailing: ask for details.
Open 7 days a week. Appointment slots: 9:00 AM, 12:00 PM, 3:00 PM.
Phone: (661) 932-0000.
Today's date: ${new Date().toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.

Your job: answer questions, quote prices, and BOOK appointments.
Booking flow: 1) get the service they want, 2) get their preferred date, 3) use check_availability for that date, 4) offer open slots, 5) collect name, phone number, and service address, 6) use create_booking. Never book without name + phone + address.
Keep replies short, warm, and helpful. Never invent availability - always use the tool.`

const TOOLS = [
  {
    name: 'check_availability',
    description: 'Check which appointment slots are open on a given date',
    input_schema: {
      type: 'object',
      properties: { date: { type: 'string', description: 'Date in YYYY-MM-DD format' } },
      required: ['date']
    }
  },
  {
    name: 'create_booking',
    description: 'Book an appointment. Only call after confirming service, date, slot, name, phone, and address.',
    input_schema: {
      type: 'object',
      properties: {
        name:    { type: 'string' },
        phone:   { type: 'string' },
        address: { type: 'string' },
        service: { type: 'string' },
        date:    { type: 'string', description: 'YYYY-MM-DD' },
        slot:    { type: 'string', description: 'One of: 9:00 AM, 12:00 PM, 3:00 PM' },
        notes:   { type: 'string' }
      },
      required: ['name', 'phone', 'address', 'service', 'date', 'slot']
    }
  }
]

async function getBookingsOn(date) {
  const formula = encodeURIComponent(`AND(IS_SAME({Date},'${date}','day'),{Status}!='cancelled')`)
  const r = await fetch(`https://api.airtable.com/v0/${BASE}/${TABLE}?filterByFormula=${formula}`, {
    headers: { 'Authorization': `Bearer ${TOKEN}` }
  })
  const d = await r.json()
  return d.records || []
}

function slotToISO(date, slot) {
  const h = { '9:00 AM': '09', '12:00 PM': '12', '3:00 PM': '15' }[slot] || '09'
  return `${date}T${h}:00:00-07:00`
}

async function checkAvailability({ date }) {
  const records = await getBookingsOn(date)
  if (records.length >= 3) return { date, available: [], message: 'Fully booked that day' }
  const taken = records.map(r => new Date(r.fields.Date).toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit' }))
  const available = SLOTS.filter(s => !taken.includes(s))
  return { date, available }
}

async function createBooking(b) {
  const check = await checkAvailability({ date: b.date })
  if (!check.available.includes(b.slot)) {
    return { ok: false, error: 'Slot no longer available', available: check.available }
  }
  const r = await fetch(`https://api.airtable.com/v0/${BASE}/${TABLE}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ records: [{ fields: {
      Name: b.name, Phone: b.phone, Address: b.address, Service: b.service,
      Notes: b.notes || '', Source: 'ai-agent', Status: 'booked',
      Date: slotToISO(b.date, b.slot)
    }}]})
  })
  if (!r.ok) {
    const errBody = await r.text()
    console.error('Airtable rejected:', errBody)
    return { ok: false, error: 'Booking save failed: ' + errBody.slice(0, 300) }
  }

  try {
    const sid = process.env.TWILIO_ACCOUNT_SID
    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${sid}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        From: process.env.TWILIO_PHONE,
        To: process.env.OWNER_PHONE,
        Body: `NEW BOOKING\n${b.service}\n${b.date} @ ${b.slot}\n${b.name} ${b.phone}\n${b.address}`
      })
    })
  } catch (e) { console.error('SMS failed:', e) }

  return { ok: true, confirmed: `${b.date} at ${b.slot}` }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  let messages = req.body.messages.map(m => ({ role: m.role, content: m.content }))

  try {
    for (let i = 0; i < 5; i++) {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          system: SYSTEM,
          tools: TOOLS,
          messages
        })
      })
      const data = await r.json()
      if (!data.content) throw new Error(JSON.stringify(data.error || data))

      if (data.stop_reason === 'tool_use') {
        messages.push({ role: 'assistant', content: data.content })
        const results = []
        for (const block of data.content) {
          if (block.type !== 'tool_use') continue
          let result
          try {
            result = block.name === 'check_availability'
              ? await checkAvailability(block.input)
              : await createBooking(block.input)
          } catch (e) { result = { error: e.message } }
          results.push({ type: 'tool_result', tool_use_id: block.id, content: JSON.stringify(result) })
        }
        messages.push({ role: 'user', content: results })
        continue
      }

      const text = data.content.filter(b => b.type === 'text').map(b => b.text).join('\n')
      return res.status(200).json({ reply: text || 'Call us at (661) 932-0000!' })
    }
    return res.status(200).json({ reply: 'Let me get you booked - call (661) 932-0000 and we will set it up!' })
  } catch (err) {
    console.error('Agent error:', err)
    return res.status(200).json({ reply: 'Something glitched on my end - call (661) 932-0000 and we will take care of you!' })
  }
}

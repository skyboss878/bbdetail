export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { messages } = req.body

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: `You are a friendly booking assistant for Bakersfield's Best Mobile Detailing in Bakersfield, CA.
Services: Exterior Detail ($80+), Interior Detail ($100+), Full Detail ($160+), Paint Correction ($250+), Ceramic Coating ($400+), Fleet Detailing.
You help customers understand services, pricing, and schedule appointments.
Keep replies short, warm, and helpful. If they want to book, direct them to fill out the form at the top of the page or call (661) 555-0000.`,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    }),
  })

  const data = await response.json()
  return res.status(200).json({ reply: data.content?.[0]?.text || 'Reach us at (661) 555-0000!' })
}

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end();
  }
  const topics = [
    "before/after interior detail on a family SUV",
    "why Bakersfield dust and heat wreck paint and how to protect it",
    "ceramic coating benefits for Central Valley summers",
    "monthly maintenance detail membership",
    "we come to you: mobile detailing at home or work",
    "headlight and window tint tips"
  ];
  const topic = topics[new Date().getDate() % topics.length];
  const ai = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: "claude-haiku-5-5",
      max_tokens: 300,
      messages: [{ role: "user", content:
        `Write one short, friendly Facebook post (under 80 words, 1-2 emojis, no hashtags spam) for Bakersfield's Best Mobile Detailing about: ${topic}. End with: Book at bakersfieldsbestmobiledetailing.com. Output only the post.` }]
    })
  }).then(r => r.json());
  const message = ai.content?.[0]?.text;
  if (!message) return res.status(500).json({ error: "no content", ai });
  const fb = await fetch(`https://graph.facebook.com/v19.0/${process.env.FB_PAGE_ID}/feed`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message, access_token: process.env.FB_PAGE_TOKEN })
  }).then(r => r.json());
  return res.status(200).json({ message, fb });
}

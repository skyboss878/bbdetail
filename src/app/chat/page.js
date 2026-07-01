'use client'
import { useState, useRef, useEffect } from 'react'

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! I'm the BBMD virtual assistant. Ask me anything about our services, pricing, or to get booked in. 🚗✨" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottom = useRef(null)

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Give us a call at (661) 555-0000!' }])
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-silver font-semibold">BB<span className="text-gold">MD</span> Assistant</h1>
          <p className="text-chrome/50 text-sm mt-2">Ask about services, pricing, or book right here.</p>
        </div>
        <div className="bg-carbon border border-steel/30 flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-gold text-obsidian font-medium'
                    : 'bg-graphite text-chrome/80 border border-steel/20'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-graphite border border-steel/20 px-4 py-2.5 text-chrome/40 text-sm">Thinking…</div>
              </div>
            )}
            <div ref={bottom} />
          </div>
          <div className="border-t border-steel/20 p-3 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask anything…"
              className="flex-1 bg-graphite border border-steel/30 focus:border-gold/50 outline-none text-silver text-sm px-4 py-2.5 placeholder-chrome/30"
            />
            <button onClick={send} disabled={loading} className="bg-gold hover:bg-gold-light disabled:opacity-50 text-obsidian px-5 py-2.5 text-sm font-semibold transition-colors">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

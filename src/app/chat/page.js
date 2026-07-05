'use client'
import { useState, useRef, useEffect } from 'react'

const C = {
  obs:'#0A0A0B', carb:'#141416', graph:'#1E1E22', steel:'#2C2C32',
  chro:'#C8C8CC', sil:'#E8E8EC', gold:'#C9A84C', goldL:'#E2C97E',
}

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role:'assistant', content:"Hey! I'm the BBMD booking assistant. I can quote prices, check availability, and book your detail right here. What can I help with? 🚗✨" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottom = useRef(null)

  useEffect(() => { bottom.current?.scrollIntoView({ behavior:'smooth' }) }, [messages, loading])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role:'user', content: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role:'assistant', content: data.reply }])
    } catch {
      setMessages(prev => [...prev, { role:'assistant', content:'Sorry, something went wrong. Call or text us at (661) 932-0000!' }])
    }
    setLoading(false)
  }

  const QUICK = ['What are your prices?', 'Book a Full Detail', 'Ceramic coating info', 'What times are open tomorrow?']

  return (
    <div style={{ minHeight:'100dvh', background:C.obs, display:'flex', flexDirection:'column', fontFamily:'Inter,sans-serif' }}>

      {/* Header */}
      <div style={{ background:'rgba(10,10,11,0.97)', backdropFilter:'blur(12px)', borderBottom:`1px solid ${C.steel}`, padding:'0.9rem 1.2rem', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:10 }}>
        <a href="/" style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.3rem', fontWeight:600, color:C.sil, textDecoration:'none' }}>
          BB<span style={{ color:C.gold }}>MD</span>
        </a>
        <div style={{ textAlign:'center' }}>
          <div style={{ color:C.sil, fontSize:'0.85rem', fontWeight:600 }}>Booking Assistant</div>
          <div style={{ color:'#22c55e', fontSize:'0.65rem', display:'flex', alignItems:'center', gap:'0.3rem', justifyContent:'center' }}>
            <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#22c55e', display:'inline-block' }}></span>
            Online — books instantly
          </div>
        </div>
        <a href="tel:6619320000" style={{ color:C.gold, fontSize:'1.1rem', textDecoration:'none' }}>📞</a>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'1.2rem', display:'flex', flexDirection:'column', gap:'0.8rem', maxWidth:'640px', width:'100%', margin:'0 auto', boxSizing:'border-box' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display:'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth:'85%',
              padding:'0.75rem 1rem',
              fontSize:'0.9rem',
              lineHeight:1.55,
              whiteSpace:'pre-wrap',
              background: m.role === 'user' ? C.gold : C.graph,
              color: m.role === 'user' ? C.obs : C.sil,
              fontWeight: m.role === 'user' ? 500 : 400,
              borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              border: m.role === 'user' ? 'none' : `1px solid ${C.steel}`,
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:'flex', justifyContent:'flex-start' }}>
            <div style={{ background:C.graph, border:`1px solid ${C.steel}`, padding:'0.75rem 1rem', borderRadius:'16px 16px 16px 4px', color:'rgba(200,200,204,0.5)', fontSize:'0.9rem' }}>
              Typing…
            </div>
          </div>
        )}
        <div ref={bottom} />
      </div>

      {/* Quick replies (only at start) */}
      {messages.length === 1 && (
        <div style={{ maxWidth:'640px', width:'100%', margin:'0 auto', padding:'0 1.2rem 0.8rem', boxSizing:'border-box', display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
          {QUICK.map(q => (
            <button key={q} onClick={() => { setInput(q); }} style={{
              background:'transparent', border:`1px solid rgba(201,168,76,0.4)`, color:C.gold,
              padding:'0.5rem 0.9rem', borderRadius:'999px', fontSize:'0.78rem', cursor:'pointer',
              fontFamily:'Inter,sans-serif',
            }}>{q}</button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div style={{ borderTop:`1px solid ${C.steel}`, background:C.carb, padding:'0.8rem 1.2rem', paddingBottom:'calc(0.8rem + env(safe-area-inset-bottom))' }}>
        <div style={{ maxWidth:'640px', margin:'0 auto', display:'flex', gap:'0.6rem' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask about pricing or book a detail…"
            style={{
              flex:1, background:C.graph, border:`1px solid ${C.steel}`, borderRadius:'999px',
              color:C.sil, fontSize:'0.9rem', padding:'0.75rem 1.1rem', outline:'none',
              fontFamily:'Inter,sans-serif',
            }}
          />
          <button onClick={send} disabled={loading} style={{
            background:C.gold, color:C.obs, border:'none', borderRadius:'999px',
            padding:'0 1.3rem', fontWeight:700, fontSize:'0.85rem', cursor:'pointer',
            opacity: loading ? 0.6 : 1,
          }}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

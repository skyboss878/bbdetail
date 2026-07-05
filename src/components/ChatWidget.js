'use client'
import { useState, useRef, useEffect } from 'react'

const C = {
  obs:'#0A0A0B', carb:'#141416', graph:'#1E1E22', steel:'#2C2C32',
  chro:'#C8C8CC', sil:'#E8E8EC', gold:'#C9A84C',
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [nudge, setNudge] = useState(false)
  const [messages, setMessages] = useState([
    { role:'assistant', content:"Hey! 👋 Want your car looking showroom-new? I can quote you a price and book your detail in under a minute — right here. What kind of vehicle do you have?" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottom = useRef(null)

  // Nudge bubble after 5s if not opened
  useEffect(() => {
    const t = setTimeout(() => setNudge(true), 5000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => { if (open) bottom.current?.scrollIntoView({ behavior:'smooth' }) }, [messages, loading, open])

  const send = async (text) => {
    const msg = (text ?? input).trim()
    if (!msg || loading) return
    const userMsg = { role:'user', content: msg }
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
      setMessages(prev => [...prev, { role:'assistant', content:'Sorry, something glitched — call or text (661) 932-0000 and we\'ll take care of you!' }])
    }
    setLoading(false)
  }

  const QUICK = ['Get a price 💰', 'Book a detail 📅', 'Ceramic coating ✨']

  return (
    <>
      {/* Nudge bubble */}
      {!open && nudge && (
        <div onClick={() => { setOpen(true); setNudge(false) }} style={{
          position:'fixed', bottom:'5.5rem', right:'1.5rem', zIndex:59,
          background:C.carb, border:`1px solid rgba(201,168,76,0.5)`, color:C.sil,
          padding:'0.8rem 1rem', borderRadius:'14px 14px 4px 14px', fontSize:'0.82rem',
          maxWidth:'230px', cursor:'pointer', lineHeight:1.5,
          boxShadow:'0 8px 30px rgba(0,0,0,0.6)', fontFamily:'Inter,sans-serif',
        }}>
          💬 Get an instant quote & book in under a minute — tap here!
        </div>
      )}

      {/* Floating button */}
      <button onClick={() => { setOpen(!open); setNudge(false) }} style={{
        position:'fixed', bottom:'1.5rem', right:'1.5rem', zIndex:60,
        background:C.gold, color:C.obs, border:'none', borderRadius:'999px',
        padding:'0.9rem 1.35rem', fontWeight:700, fontSize:'0.9rem', cursor:'pointer',
        boxShadow:'0 4px 20px rgba(201,168,76,0.45)', fontFamily:'Inter,sans-serif',
        display:'flex', alignItems:'center', gap:'0.5rem',
      }}>
        {open ? '✕ Close' : '💬 Book Now'}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position:'fixed', bottom:'5.2rem', right:'1rem', left:'1rem', zIndex:59,
          maxWidth:'400px', marginLeft:'auto', height:'min(520px, 70dvh)',
          background:C.obs, border:`1px solid ${C.steel}`, borderRadius:'16px',
          display:'flex', flexDirection:'column', overflow:'hidden',
          boxShadow:'0 20px 60px rgba(0,0,0,0.7)', fontFamily:'Inter,sans-serif',
        }}>
          {/* Header */}
          <div style={{ background:C.carb, borderBottom:`1px solid ${C.steel}`, padding:'0.8rem 1rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ color:C.sil, fontSize:'0.85rem', fontWeight:700 }}>
                BB<span style={{ color:C.gold }}>MD</span> Booking Assistant
              </div>
              <div style={{ color:'#22c55e', fontSize:'0.65rem', display:'flex', alignItems:'center', gap:'0.3rem' }}>
                <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#22c55e', display:'inline-block' }}></span>
                Online — books instantly
              </div>
            </div>
            <a href="tel:6619320000" style={{ color:C.gold, textDecoration:'none', fontSize:'1rem' }}>📞</a>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:'0.9rem', display:'flex', flexDirection:'column', gap:'0.6rem' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display:'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth:'85%', padding:'0.6rem 0.85rem', fontSize:'0.83rem', lineHeight:1.5, whiteSpace:'pre-wrap',
                  background: m.role === 'user' ? C.gold : C.graph,
                  color: m.role === 'user' ? C.obs : C.sil,
                  borderRadius: m.role === 'user' ? '13px 13px 4px 13px' : '13px 13px 13px 4px',
                  border: m.role === 'user' ? 'none' : `1px solid ${C.steel}`,
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ background:C.graph, border:`1px solid ${C.steel}`, padding:'0.6rem 0.85rem', borderRadius:'13px 13px 13px 4px', color:'rgba(200,200,204,0.5)', fontSize:'0.83rem', alignSelf:'flex-start' }}>
                Typing…
              </div>
            )}
            <div ref={bottom} />
          </div>

          {/* Quick replies */}
          {messages.length === 1 && (
            <div style={{ padding:'0 0.9rem 0.6rem', display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
              {QUICK.map(q => (
                <button key={q} onClick={() => send(q)} style={{
                  background:'transparent', border:`1px solid rgba(201,168,76,0.4)`, color:C.gold,
                  padding:'0.4rem 0.75rem', borderRadius:'999px', fontSize:'0.72rem', cursor:'pointer',
                  fontFamily:'Inter,sans-serif',
                }}>{q}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ borderTop:`1px solid ${C.steel}`, background:C.carb, padding:'0.6rem 0.8rem', display:'flex', gap:'0.5rem' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Type here…"
              style={{
                flex:1, background:C.graph, border:`1px solid ${C.steel}`, borderRadius:'999px',
                color:C.sil, fontSize:'0.83rem', padding:'0.6rem 0.95rem', outline:'none',
                fontFamily:'Inter,sans-serif',
              }}
            />
            <button onClick={() => send()} disabled={loading} style={{
              background:C.gold, color:C.obs, border:'none', borderRadius:'999px',
              padding:'0 1rem', fontWeight:700, fontSize:'0.8rem', cursor:'pointer',
              opacity: loading ? 0.6 : 1,
            }}>➤</button>
          </div>
        </div>
      )}
    </>
  )
}

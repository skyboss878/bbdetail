'use client'
import { useState, useEffect } from 'react'

const C = {
  obs:'#0A0A0B', carb:'#141416', graph:'#1E1E22', steel:'#2C2C32',
  chro:'#C8C8CC', sil:'#E8E8EC', gold:'#C9A84C', goldL:'#E2C97E',
  amb:'#F5A623', green:'#22c55e', red:'#ef4444', blue:'#3b82f6',
}

const STATUS = {
  new:       { label:'New',       color:'#C9A84C', bg:'rgba(201,168,76,0.15)' },
  confirmed: { label:'Confirmed', color:'#22c55e', bg:'rgba(34,197,94,0.15)' },
  done:      { label:'Done',      color:'#C8C8CC', bg:'rgba(200,200,204,0.1)' },
  cancelled: { label:'Cancelled', color:'#ef4444', bg:'rgba(239,68,68,0.15)' },
}

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const SERVICES = ['Express Detail — $80','Signature Detail — $160','Elite Detail — $300+','Paint Correction','Ceramic Coating','Fleet Detailing','Other']

export default function Dashboard() {
  const [pin, setPin] = useState('')
  const [authed, setAuthed] = useState(false)
  const [pinErr, setPinErr] = useState(false)
  const [tab, setTab] = useState('calendar')
  const [leads, setLeads] = useState([])
  const [appointments, setAppointments] = useState([])
  const [today] = useState(new Date())
  const [calDate, setCalDate] = useState(new Date())
  const [selected, setSelected] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDay, setSelectedDay] = useState(null)
  const [newAppt, setNewAppt] = useState({ name:'', phone:'', service:'', time:'09:00', notes:'' })
  const [detailLead, setDetailLead] = useState(null)

  const DASH_PIN = '1234'

  useEffect(() => {
    if (authed) fetchData()
  }, [authed])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/leads')
      const data = await res.json()
      setLeads(data.leads || [])
      setAppointments(data.appointments || [])
    } catch {}
  }

  const checkPin = () => {
    if (pin === DASH_PIN) { setAuthed(true); setPinErr(false) }
    else { setPinErr(true); setPin('') }
  }

  const updateLeadStatus = async (id, status) => {
    try {
      await fetch('/api/leads', { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, status }) })
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
      if (detailLead?.id === id) setDetailLead(prev => ({ ...prev, status }))
    } catch {}
  }

  const addAppointment = async () => {
    if (!newAppt.name || !selectedDay) return
    const appt = {
      ...newAppt,
      date: selectedDay.toISOString().split('T')[0],
      id: Date.now().toString(),
      status: 'confirmed',
    }
    try {
      await fetch('/api/leads', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ type:'appointment', ...appt }) })
    } catch {}
    setAppointments(prev => [...prev, appt])
    setShowAddModal(false)
    setNewAppt({ name:'', phone:'', service:'', time:'09:00', notes:'' })
  }

  // Calendar helpers
  const year = calDate.getFullYear()
  const month = calDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevMonth = () => setCalDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCalDate(new Date(year, month + 1, 1))

  const getApptForDay = (day) => {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    return appointments.filter(a => a.date === dateStr)
  }

  const isToday = (day) => {
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
  }

  const inputStyle = {
    width:'100%', background:C.graph, border:`1px solid ${C.steel}`,
    color:C.sil, fontSize:'0.85rem', padding:'0.65rem 0.9rem',
    outline:'none', boxSizing:'border-box', fontFamily:'Inter,sans-serif',
    marginBottom:'0.6rem',
  }

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    confirmed: leads.filter(l => l.status === 'confirmed').length,
    thisMonth: appointments.filter(a => {
      const d = new Date(a.date)
      return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
    }).length,
  }

  if (!authed) return (
    <div style={{ minHeight:'100vh', background:C.obs, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter,sans-serif' }}>
      <div style={{ background:C.carb, border:`1px solid ${C.steel}`, padding:'3rem', width:'100%', maxWidth:'360px', textAlign:'center' }}>
        <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'2rem', color:C.sil, marginBottom:'0.5rem' }}>BB<span style={{ color:C.gold }}>MD</span></div>
        <p style={{ color:C.chro, fontSize:'0.75rem', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'2rem' }}>Dashboard Access</p>
        <input type="password" placeholder="Enter PIN" value={pin} onChange={e => setPin(e.target.value)} onKeyDown={e => e.key === 'Enter' && checkPin()}
          style={{ width:'100%', background:C.graph, border:`1px solid ${pinErr ? C.red : C.steel}`, color:C.sil, padding:'0.75rem', fontSize:'1.2rem', outline:'none', textAlign:'center', letterSpacing:'0.4em', marginBottom:'0.75rem', boxSizing:'border-box' }} />
        {pinErr && <p style={{ color:C.red, fontSize:'0.75rem', marginBottom:'0.75rem' }}>Incorrect PIN</p>}
        <button onClick={checkPin} style={{ width:'100%', background:C.gold, color:C.obs, border:'none', padding:'0.75rem', fontWeight:700, cursor:'pointer' }}>Unlock</button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:C.obs, fontFamily:'Inter,sans-serif', color:C.sil }}>
      {/* Header */}
      <div style={{ background:C.carb, borderBottom:`1px solid ${C.steel}`, padding:'1rem 1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.4rem', color:C.sil }}>BB<span style={{ color:C.gold }}>MD</span> <span style={{ fontSize:'0.85rem', color:C.chro, fontFamily:'Inter,sans-serif' }}>Dashboard</span></div>
        <div style={{ display:'flex', gap:'0.5rem' }}>
          {['calendar','leads'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding:'0.4rem 1rem', fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'0.1em', background: tab === t ? C.gold : C.graph, color: tab === t ? C.obs : C.chro, border:`1px solid ${tab === t ? C.gold : C.steel}`, cursor:'pointer', fontWeight: tab === t ? 700 : 400 }}>{t}</button>
          ))}
        </div>
        <a href="/" style={{ color:C.chro, fontSize:'0.75rem', textDecoration:'none' }}>← Site</a>
      </div>

      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'1.5rem' }}>
        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1px', background:C.steel, marginBottom:'1.5rem' }}>
          {[
            { label:'Total Leads', value:stats.total, color:C.sil },
            { label:'New', value:stats.new, color:C.gold },
            { label:'Confirmed', value:stats.confirmed, color:C.green },
            { label:'This Month', value:stats.thisMonth, color:C.blue },
          ].map((s,i) => (
            <div key={i} style={{ background:C.graph, padding:'1.2rem', textAlign:'center' }}>
              <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'2rem', color:s.color, fontWeight:600 }}>{s.value}</div>
              <div style={{ fontSize:'0.65rem', color:C.chro, letterSpacing:'0.15em', textTransform:'uppercase', marginTop:'0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* CALENDAR TAB */}
        {tab === 'calendar' && (
          <div style={{ background:C.carb, border:`1px solid ${C.steel}` }}>
            {/* Cal header */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 1.5rem', borderBottom:`1px solid ${C.steel}` }}>
              <button onClick={prevMonth} style={{ background:'none', border:'none', color:C.gold, fontSize:'1.2rem', cursor:'pointer' }}>‹</button>
              <span style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.4rem', color:C.sil }}>{MONTHS[month]} {year}</span>
              <button onClick={nextMonth} style={{ background:'none', border:'none', color:C.gold, fontSize:'1.2rem', cursor:'pointer' }}>›</button>
            </div>
            {/* Day headers */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'1px', background:C.steel }}>
              {DAYS.map(d => (
                <div key={d} style={{ background:C.graph, padding:'0.5rem', textAlign:'center', fontSize:'0.7rem', color:C.chro, letterSpacing:'0.1em', textTransform:'uppercase' }}>{d}</div>
              ))}
            </div>
            {/* Calendar grid */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'1px', background:C.steel }}>
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`e${i}`} style={{ background:C.obs, minHeight:'80px' }} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const dayAppts = getApptForDay(day)
                const todayFlag = isToday(day)
                return (
                  <div key={day} onClick={() => { setSelectedDay(new Date(year, month, day)); setShowAddModal(true) }}
                    style={{ background: todayFlag ? 'rgba(201,168,76,0.08)' : C.carb, minHeight:'80px', padding:'0.4rem', cursor:'pointer', border: todayFlag ? `1px solid rgba(201,168,76,0.4)` : 'none', boxSizing:'border-box' }}>
                    <div style={{ fontSize:'0.8rem', color: todayFlag ? C.gold : C.chro, fontWeight: todayFlag ? 700 : 400, marginBottom:'0.3rem' }}>{day}</div>
                    {dayAppts.map((a, ai) => (
                      <div key={ai} onClick={e => { e.stopPropagation(); setSelected(a) }}
                        style={{ background:C.gold, color:C.obs, fontSize:'0.6rem', padding:'0.15rem 0.3rem', marginBottom:'0.2rem', borderRadius:'2px', fontWeight:600, overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis' }}>
                        {a.time} {a.name.split(' ')[0]}
                      </div>
                    ))}
                    <div style={{ color:'rgba(201,168,76,0.3)', fontSize:'0.65rem', marginTop:'0.2rem' }}>+ Add</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* LEADS TAB */}
        {tab === 'leads' && (
          <div style={{ display:'grid', gridTemplateColumns: detailLead ? '1fr 360px' : '1fr', gap:'1px', background:C.steel }}>
            <div style={{ background:C.carb }}>
              {leads.length === 0 && <div style={{ padding:'3rem', textAlign:'center', color:C.chro, fontSize:'0.875rem' }}>No leads yet — run the bot or wait for bookings.</div>}
              {leads.map(lead => (
                <div key={lead.id} onClick={() => setDetailLead(detailLead?.id === lead.id ? null : lead)}
                  style={{ padding:'1.1rem 1.5rem', borderBottom:`1px solid ${C.steel}`, cursor:'pointer', background: detailLead?.id === lead.id ? C.graph : 'transparent', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.25rem' }}>
                      <span style={{ fontWeight:600, color:C.sil, fontSize:'0.9rem' }}>{lead.name}</span>
                      <span style={{ fontSize:'0.6rem', padding:'0.15rem 0.5rem', background:STATUS[lead.status]?.bg, color:STATUS[lead.status]?.color, textTransform:'uppercase', letterSpacing:'0.1em' }}>{STATUS[lead.status]?.label}</span>
                    </div>
                    <div style={{ color:C.gold, fontSize:'0.75rem', marginBottom:'0.2rem' }}>{lead.service}</div>
                    <div style={{ color:'rgba(200,200,204,0.5)', fontSize:'0.7rem' }}>{lead.date} · {lead.source}</div>
                  </div>
                  <span style={{ color:C.chro }}>›</span>
                </div>
              ))}
            </div>
            {detailLead && (
              <div style={{ background:C.graph, padding:'1.5rem', borderLeft:`1px solid ${C.steel}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1.5rem' }}>
                  <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.5rem', color:C.sil }}>{detailLead.name}</h2>
                  <button onClick={() => setDetailLead(null)} style={{ background:'none', border:'none', color:C.chro, cursor:'pointer', fontSize:'1.2rem' }}>✕</button>
                </div>
                {[['Phone', detailLead.phone], ['Service', detailLead.service], ['Address', detailLead.address], ['Notes', detailLead.notes], ['Source', detailLead.source], ['Date', detailLead.date]].map(([l,v]) => v ? (
                  <div key={l} style={{ marginBottom:'0.9rem' }}>
                    <div style={{ fontSize:'0.6rem', color:C.chro, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'0.2rem' }}>{l}</div>
                    <div style={{ color:C.sil, fontSize:'0.85rem' }}>{v}</div>
                  </div>
                ) : null)}
                <div style={{ marginTop:'1.2rem', marginBottom:'0.6rem' }}>
                  <div style={{ fontSize:'0.6rem', color:C.chro, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'0.6rem' }}>Status</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
                    {Object.entries(STATUS).map(([key, val]) => (
                      <button key={key} onClick={() => updateLeadStatus(detailLead.id, key)} style={{ padding:'0.35rem 0.8rem', fontSize:'0.7rem', letterSpacing:'0.08em', textTransform:'uppercase', background: detailLead.status === key ? val.bg : 'transparent', color: detailLead.status === key ? val.color : C.chro, border:`1px solid ${detailLead.status === key ? val.color : C.steel}`, cursor:'pointer', fontWeight: detailLead.status === key ? 700 : 400 }}>{val.label}</button>
                    ))}
                  </div>
                </div>
                {detailLead.phone && (
                  <a href={`tel:${detailLead.phone}`} style={{ display:'block', background:C.gold, color:C.obs, textAlign:'center', padding:'0.75rem', fontWeight:700, fontSize:'0.85rem', textDecoration:'none', marginTop:'1rem' }}>
                    📞 Call {detailLead.name.split(' ')[0]}
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div onClick={() => setShowAddModal(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ background:C.carb, border:`1px solid ${C.steel}`, padding:'2rem', width:'100%', maxWidth:'420px' }}>
            <h3 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.5rem', color:C.sil, marginBottom:'0.25rem' }}>Add Appointment</h3>
            <p style={{ color:C.gold, fontSize:'0.8rem', marginBottom:'1.5rem' }}>
              {selectedDay?.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })}
            </p>
            <input placeholder="Client name *" value={newAppt.name} onChange={e => setNewAppt(p => ({...p, name:e.target.value}))} style={inputStyle} />
            <input placeholder="Phone number" value={newAppt.phone} onChange={e => setNewAppt(p => ({...p, phone:e.target.value}))} style={inputStyle} />
            <select value={newAppt.service} onChange={e => setNewAppt(p => ({...p, service:e.target.value}))} style={{...inputStyle, color: newAppt.service ? C.sil : 'rgba(200,200,204,0.4)'}}>
              <option value="">Select service</option>
              {SERVICES.map(s => <option key={s} style={{color:'#000'}}>{s}</option>)}
            </select>
            <input type="time" value={newAppt.time} onChange={e => setNewAppt(p => ({...p, time:e.target.value}))} style={inputStyle} />
            <textarea placeholder="Notes / address..." value={newAppt.notes} onChange={e => setNewAppt(p => ({...p, notes:e.target.value}))} rows={3} style={inputStyle} />
            <div style={{ display:'flex', gap:'0.75rem', marginTop:'0.5rem' }}>
              <button onClick={() => setShowAddModal(false)} style={{ flex:1, padding:'0.75rem', background:'transparent', border:`1px solid ${C.steel}`, color:C.chro, cursor:'pointer' }}>Cancel</button>
              <button onClick={addAppointment} style={{ flex:2, padding:'0.75rem', background:C.gold, color:C.obs, border:'none', fontWeight:700, cursor:'pointer' }}>Add Appointment</button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment detail modal */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ background:C.carb, border:`1px solid ${C.steel}`, padding:'2rem', width:'100%', maxWidth:'380px' }}>
            <h3 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.5rem', color:C.sil, marginBottom:'1rem' }}>{selected.name}</h3>
            {[['Service', selected.service], ['Time', selected.time], ['Date', selected.date], ['Phone', selected.phone], ['Notes', selected.notes]].map(([l,v]) => v ? (
              <div key={l} style={{ marginBottom:'0.75rem' }}>
                <div style={{ fontSize:'0.6rem', color:C.chro, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'0.2rem' }}>{l}</div>
                <div style={{ color:C.sil, fontSize:'0.875rem' }}>{v}</div>
              </div>
            ) : null)}
            {selected.phone && <a href={`tel:${selected.phone}`} style={{ display:'block', background:C.gold, color:C.obs, textAlign:'center', padding:'0.75rem', fontWeight:700, textDecoration:'none', marginTop:'1rem' }}>📞 Call</a>}
            <button onClick={() => setSelected(null)} style={{ width:'100%', background:'transparent', border:`1px solid ${C.steel}`, color:C.chro, padding:'0.6rem', cursor:'pointer', marginTop:'0.5rem' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'
import { useState, useEffect } from 'react'

const C = {
  obs:   '#0A0A0B',
  carb:  '#141416',
  graph: '#1E1E22',
  steel: '#2C2C32',
  chro:  '#C8C8CC',
  sil:   '#E8E8EC',
  gold:  '#C9A84C',
  goldL: '#E2C97E',
  amb:   '#F5A623',
  green: '#22c55e',
  red:   '#ef4444',
}

const MOCK_LEADS = [
  { id:1, name:'Marcus Johnson',  phone:'(661) 555-0182', service:'Full Detail — $160',      address:'4821 Stockdale Hwy',   status:'new',       date:'Jun 29, 9:14am', notes:'2022 Chevy Tahoe, black' },
  { id:2, name:'Priya Sandoval',  phone:'(661) 555-0341', service:'Ceramic Coating',         address:'910 Truxtun Ave',      status:'confirmed', date:'Jun 29, 8:02am', notes:'Tesla Model 3' },
  { id:3, name:'Derek Okafor',    phone:'(661) 555-0774', service:'Exterior Detail — $80',   address:'2200 White Ln',        status:'done',      date:'Jun 28, 3:45pm', notes:'Needs clay bar focus on hood' },
  { id:4, name:'Samantha Cruz',   phone:'(661) 555-0556', service:'Paint Correction',        address:'11300 Ming Ave',       status:'new',       date:'Jun 28, 1:20pm', notes:'2019 Ford F-150, silver' },
  { id:5, name:'Tony Reyes',      phone:'(661) 555-0903', service:'Fleet Detailing',         address:'Cottonwood Rd yard',   status:'confirmed', date:'Jun 27, 11:00am',notes:'4 trucks, recurring monthly' },
]

const STATUS = {
  new:       { label:'New',       bg:'rgba(201,168,76,0.15)',  color:'#C9A84C' },
  confirmed: { label:'Confirmed', bg:'rgba(34,197,94,0.15)',   color:'#22c55e' },
  done:      { label:'Done',      bg:'rgba(200,200,204,0.1)',  color:'#C8C8CC' },
  cancelled: { label:'Cancelled', bg:'rgba(239,68,68,0.15)',   color:'#ef4444' },
}

export default function Dashboard() {
  const [leads, setLeads] = useState(MOCK_LEADS)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [pin, setPin] = useState('')
  const [authed, setAuthed] = useState(false)
  const [pinErr, setPinErr] = useState(false)

  const DASHBOARD_PIN = process.env.NEXT_PUBLIC_DASHBOARD_PIN || '1234'

  const checkPin = () => {
    if (pin === DASHBOARD_PIN) { setAuthed(true); setPinErr(false) }
    else { setPinErr(true); setPin('') }
  }

  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter)

  const stats = {
    total:     leads.length,
    new:       leads.filter(l => l.status === 'new').length,
    confirmed: leads.filter(l => l.status === 'confirmed').length,
    done:      leads.filter(l => l.status === 'done').length,
  }

  const updateStatus = (id, status) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
    if (selected?.id === id) setSelected(prev => ({ ...prev, status }))
  }

  const s = (obj) => Object.entries(obj).map(([k,v]) => `${k}:${v}`).join(';')

  if (!authed) return (
    <div style={{ minHeight:'100vh', background:C.obs, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter,sans-serif' }}>
      <div style={{ background:C.carb, border:`1px solid ${C.steel}`, padding:'3rem', width:'100%', maxWidth:'360px', textAlign:'center' }}>
        <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'2rem', color:C.sil, marginBottom:'0.5rem' }}>
          BB<span style={{ color:C.gold }}>MD</span>
        </div>
        <p style={{ color:C.chro, fontSize:'0.8rem', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'2rem' }}>Dashboard Access</p>
        <input
          type="password"
          placeholder="Enter PIN"
          value={pin}
          onChange={e => setPin(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && checkPin()}
          style={{ width:'100%', background:C.graph, border:`1px solid ${pinErr ? C.red : C.steel}`, color:C.sil, padding:'0.75rem 1rem', fontSize:'1rem', outline:'none', textAlign:'center', letterSpacing:'0.4em', marginBottom:'0.75rem', boxSizing:'border-box' }}
        />
        {pinErr && <p style={{ color:C.red, fontSize:'0.75rem', marginBottom:'0.75rem' }}>Incorrect PIN</p>}
        <button onClick={checkPin} style={{ width:'100%', background:C.gold, color:C.obs, border:'none', padding:'0.75rem', fontWeight:700, fontSize:'0.875rem', cursor:'pointer', letterSpacing:'0.05em' }}>
          Unlock
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:C.obs, fontFamily:'Inter,sans-serif', color:C.sil }}>
      {/* Header */}
      <div style={{ background:C.carb, borderBottom:`1px solid ${C.steel}`, padding:'1rem 1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.5rem', color:C.sil }}>
          BB<span style={{ color:C.gold }}>MD</span> <span style={{ fontSize:'0.875rem', color:C.chro, fontFamily:'Inter,sans-serif', fontWeight:400 }}>Leads Dashboard</span>
        </div>
        <a href="/" style={{ color:C.chro, fontSize:'0.8rem', textDecoration:'none', letterSpacing:'0.1em' }}>← Back to site</a>
      </div>

      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'2rem 1.5rem' }}>
        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1px', background:C.steel, marginBottom:'2rem' }}>
          {[
            { label:'Total Leads', value:stats.total,     color:C.sil },
            { label:'New',         value:stats.new,       color:C.gold },
            { label:'Confirmed',   value:stats.confirmed, color:C.green },
            { label:'Completed',   value:stats.done,      color:C.chro },
          ].map((s,i) => (
            <div key={i} style={{ background:C.graph, padding:'1.5rem', textAlign:'center' }}>
              <div style={{ fontSize:'2.5rem', fontFamily:'Cormorant Garamond,serif', fontWeight:600, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:'0.7rem', color:C.chro, letterSpacing:'0.2em', textTransform:'uppercase', marginTop:'0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
          {['all','new','confirmed','done','cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding:'0.4rem 1rem', fontSize:'0.75rem', letterSpacing:'0.1em', textTransform:'uppercase',
              background: filter === f ? C.gold : C.graph,
              color: filter === f ? C.obs : C.chro,
              border: `1px solid ${filter === f ? C.gold : C.steel}`,
              cursor:'pointer', fontWeight: filter === f ? 700 : 400,
            }}>
              {f === 'all' ? 'All' : STATUS[f]?.label}
            </button>
          ))}
        </div>

        {/* Leads list + detail panel */}
        <div style={{ display:'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap:'1px', background:C.steel }}>
          {/* List */}
          <div style={{ background:C.carb }}>
            {filtered.length === 0 && (
              <div style={{ padding:'3rem', textAlign:'center', color:C.chro, fontSize:'0.875rem' }}>No leads in this category.</div>
            )}
            {filtered.map(lead => (
              <div
                key={lead.id}
                onClick={() => setSelected(selected?.id === lead.id ? null : lead)}
                style={{
                  padding:'1.25rem 1.5rem',
                  borderBottom:`1px solid ${C.steel}`,
                  cursor:'pointer',
                  background: selected?.id === lead.id ? C.graph : 'transparent',
                  transition:'background 0.15s',
                  display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem',
                }}
              >
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.35rem' }}>
                    <span style={{ fontWeight:600, color:C.sil, fontSize:'0.95rem' }}>{lead.name}</span>
                    <span style={{
                      fontSize:'0.65rem', padding:'0.2rem 0.6rem', letterSpacing:'0.1em', textTransform:'uppercase',
                      background: STATUS[lead.status]?.bg, color: STATUS[lead.status]?.color, borderRadius:'2px',
                    }}>{STATUS[lead.status]?.label}</span>
                  </div>
                  <div style={{ color:C.gold, fontSize:'0.8rem', marginBottom:'0.25rem' }}>{lead.service}</div>
                  <div style={{ color:C.chro, fontSize:'0.75rem' }}>{lead.address} · {lead.date}</div>
                </div>
                <div style={{ color:C.chro, fontSize:'1rem' }}>›</div>
              </div>
            ))}
          </div>

          {/* Detail panel */}
          {selected && (
            <div style={{ background:C.graph, padding:'2rem', borderLeft:`1px solid ${C.steel}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem' }}>
                <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.75rem', color:C.sil }}>{selected.name}</h2>
                <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', color:C.chro, fontSize:'1.25rem', cursor:'pointer' }}>✕</button>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:'1rem', marginBottom:'2rem' }}>
                {[
                  { label:'Phone',   value:selected.phone },
                  { label:'Service', value:selected.service },
                  { label:'Address', value:selected.address },
                  { label:'Date',    value:selected.date },
                  { label:'Notes',   value:selected.notes || '—' },
                ].map((row,i) => (
                  <div key={i}>
                    <div style={{ fontSize:'0.65rem', color:C.chro, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'0.25rem' }}>{row.label}</div>
                    <div style={{ color:C.sil, fontSize:'0.875rem' }}>{row.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom:'1rem' }}>
                <div style={{ fontSize:'0.65rem', color:C.chro, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'0.75rem' }}>Update Status</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
                  {Object.entries(STATUS).map(([key, val]) => (
                    <button key={key} onClick={() => updateStatus(selected.id, key)} style={{
                      padding:'0.4rem 0.9rem', fontSize:'0.72rem', letterSpacing:'0.08em', textTransform:'uppercase',
                      background: selected.status === key ? val.bg : 'transparent',
                      color: selected.status === key ? val.color : C.chro,
                      border: `1px solid ${selected.status === key ? val.color : C.steel}`,
                      cursor:'pointer', fontWeight: selected.status === key ? 700 : 400,
                    }}>{val.label}</button>
                  ))}
                </div>
              </div>

              <a href={`tel:${selected.phone}`} style={{
                display:'block', width:'100%', background:C.gold, color:C.obs,
                textAlign:'center', padding:'0.85rem', fontWeight:700, fontSize:'0.875rem',
                letterSpacing:'0.05em', textDecoration:'none', marginTop:'1.5rem',
              }}>
                📞 Call {selected.name.split(' ')[0]}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

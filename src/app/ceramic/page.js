'use client'
import { useState } from 'react'

const C = {
  obs:'#0A0A0B', carb:'#141416', graph:'#1E1E22', steel:'#2C2C32',
  chro:'#C8C8CC', sil:'#E8E8EC', gold:'#C9A84C', goldL:'#E2C97E', amb:'#F5A623',
}

const PACKAGES = [
  {
    name: 'Essential',
    protection: '2 Year',
    layers: 1,
    includes: ['Single-stage paint correction', 'Iron decontamination', 'Clay bar treatment', '1 layer ceramic coating', 'Wheel faces coated', 'Exterior glass coated'],
    price: { sedan: 500, suv: 650, truck: 700 },
    best: false,
  },
  {
    name: 'Signature',
    protection: '5 Year',
    layers: 2,
    includes: ['Multi-stage paint correction', 'Iron & chemical decontamination', 'Clay bar treatment', '2 layers ceramic coating', 'Wheel faces + barrels coated', 'Exterior glass coated', 'Door jambs coated', 'Engine bay dress'],
    price: { sedan: 900, suv: 1100, truck: 1200 },
    best: true,
  },
  {
    name: 'Elite',
    protection: '9 Year',
    layers: 3,
    includes: ['Full paint correction (swirl-free)', 'Full decontamination wash', 'Clay bar treatment', '3 layers ceramic coating', 'Full wheel coating inside + out', 'Glass + windshield coating', 'Door jambs + trunk jambs', 'Engine bay detail', 'Exhaust tips polished', 'Interior trim coated'],
    price: { sedan: 1400, suv: 1700, truck: 1800 },
    best: false,
  },
]

const FAQS = [
  { q: 'How long does ceramic coating last?', a: 'Depending on the package, 2–9 years. Proper maintenance (pH-neutral soap, no automatic car washes) keeps it performing at its best.' },
  { q: 'Does my car need paint correction first?', a: 'Yes — ceramic coating locks in whatever condition the paint is in. We correct the paint first so the coating amplifies perfection, not imperfections.' },
  { q: 'Can you do it at my home?', a: 'Yes, fully mobile. We need a shaded area (garage preferred) and access to power. We bring everything else.' },
  { q: 'How long does it take?', a: 'Essential takes 1 day. Signature takes 1–2 days. Elite takes 2–3 days depending on paint condition.' },
  { q: 'What maintenance does ceramic coating need?', a: 'Monthly hand wash with pH-neutral soap. No automatic car washes. Annual inspection recommended. We offer maintenance wash packages.' },
  { q: 'Do you offer a warranty?', a: 'Yes — all ceramic packages come with a written warranty covering coating failure and delamination.' },
]

export default function CeramicPage() {
  const [vehicle, setVehicle] = useState('sedan')
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ name:'', phone:'', email:'', vehicle:'', notes:'' })
  const [status, setStatus] = useState('')
  const [faqOpen, setFaqOpen] = useState(null)

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async () => {
    if (!form.name || !form.phone) { setStatus('error'); return }
    setStatus('loading')
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          service: `Ceramic Coating — ${selected?.name || 'Quote Request'} (${form.vehicle})`,
          address: '',
          message: form.notes,
        })
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch { setStatus('error') }
  }

  const inputStyle = {
    width:'100%', background:C.graph, border:`1px solid ${C.steel}`,
    color:C.sil, fontSize:'0.875rem', padding:'0.75rem 1rem',
    outline:'none', boxSizing:'border-box', fontFamily:'Inter,sans-serif',
  }

  return (
    <main style={{ background:C.obs, minHeight:'100vh', fontFamily:'Inter,sans-serif', color:C.sil }}>

      {/* Nav */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:50, background:'rgba(10,10,11,0.95)', backdropFilter:'blur(12px)', borderBottom:`1px solid ${C.steel}`, padding:'1rem 1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <a href="/" style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.4rem', fontWeight:600, color:C.sil, textDecoration:'none' }}>
          BB<span style={{ color:C.gold }}>MD</span>
        </a>
        <a href="/#contact" style={{ background:C.gold, color:C.obs, fontWeight:700, fontSize:'0.8rem', padding:'0.5rem 1.2rem', textDecoration:'none', letterSpacing:'0.05em' }}>
          Book Now
        </a>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop:'8rem', paddingBottom:'5rem', textAlign:'center', padding:'8rem 1.5rem 5rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 50% 60%, rgba(201,168,76,0.07) 0%, transparent 70%)`, pointerEvents:'none' }} />
        <div style={{ position:'relative', maxWidth:'700px', margin:'0 auto' }}>
          <div style={{ display:'inline-block', border:`1px solid rgba(201,168,76,0.3)`, color:C.gold, fontSize:'0.7rem', letterSpacing:'0.3em', textTransform:'uppercase', padding:'0.4rem 1rem', marginBottom:'1.5rem' }}>
            Professional Grade · Fully Mobile · Bakersfield CA
          </div>
          <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(2.5rem, 8vw, 5rem)', fontWeight:600, lineHeight:1.05, marginBottom:'1.2rem' }}>
            <span style={{ color:C.sil }}>Ceramic Coating</span><br />
            <span style={{ color:C.gold }}>That Lasts Years.</span>
          </h1>
          <p style={{ color:C.chro, fontSize:'1rem', lineHeight:1.7, maxWidth:'500px', margin:'0 auto 2rem', fontWeight:300 }}>
            Professional nano-ceramic protection applied at your home or office. Hydrophobic. Gloss-amplifying. Backed by a written warranty.
          </p>
          <div style={{ display:'flex', gap:'2rem', justifyContent:'center', flexWrap:'wrap', marginBottom:'3rem' }}>
            {[['2–9', 'Year Protection'], ['✓', 'Written Warranty'], ['100%', 'Mobile Service'], ['★★★★★', 'Rated']].map(([n, l]) => (
              <div key={l} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.8rem', color:C.gold, fontWeight:600 }}>{n}</div>
                <div style={{ fontSize:'0.65rem', color:C.chro, letterSpacing:'0.15em', textTransform:'uppercase' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle selector */}
      <section style={{ padding:'0 1.5rem 4rem' }}>
        <div style={{ maxWidth:'900px', margin:'0 auto', textAlign:'center' }}>
          <p style={{ color:C.chro, fontSize:'0.8rem', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'1rem' }}>Select your vehicle type for pricing</p>
          <div style={{ display:'flex', gap:'1px', background:C.steel, maxWidth:'400px', margin:'0 auto 3rem' }}>
            {['sedan','suv','truck'].map(v => (
              <button key={v} onClick={() => setVehicle(v)} style={{
                flex:1, padding:'0.75rem', fontSize:'0.8rem', fontWeight:700,
                textTransform:'uppercase', letterSpacing:'0.1em', border:'none', cursor:'pointer',
                background: vehicle === v ? C.gold : C.graph,
                color: vehicle === v ? C.obs : C.chro,
              }}>{v}</button>
            ))}
          </div>

          {/* Package cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:'1px', background:C.steel }}>
            {PACKAGES.map((pkg, i) => (
              <div key={i} onClick={() => setSelected(pkg)} style={{
                background: selected?.name === pkg.name ? C.graph : pkg.best ? C.graph : C.carb,
                padding:'2rem', cursor:'pointer', position:'relative',
                outline: selected?.name === pkg.name ? `2px solid ${C.gold}` : pkg.best ? `1px solid rgba(201,168,76,0.3)` : 'none',
                transition:'all 0.2s',
              }}>
                {pkg.best && (
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:`linear-gradient(90deg, transparent, ${C.gold}, transparent)` }} />
                )}
                {pkg.best && (
                  <span style={{ color:C.gold, fontSize:'0.65rem', letterSpacing:'0.2em', textTransform:'uppercase', display:'block', marginBottom:'0.75rem' }}>Most Popular</span>
                )}
                <h3 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.8rem', color:C.sil, fontWeight:600, marginBottom:'0.25rem' }}>{pkg.name}</h3>
                <p style={{ color:C.gold, fontSize:'0.75rem', letterSpacing:'0.1em', marginBottom:'1.5rem' }}>{pkg.protection} Protection · {pkg.layers} Layer{pkg.layers > 1 ? 's' : ''}</p>
                <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'2.5rem', color:C.gold, fontWeight:600, marginBottom:'1.5rem' }}>
                  ${pkg.price[vehicle].toLocaleString()}
                </div>
                <ul style={{ listStyle:'none', padding:0, margin:'0 0 1.5rem', textAlign:'left' }}>
                  {pkg.includes.map((item, j) => (
                    <li key={j} style={{ display:'flex', gap:'0.6rem', fontSize:'0.8rem', color:'rgba(200,200,204,0.7)', marginBottom:'0.5rem' }}>
                      <span style={{ color:C.gold, flexShrink:0 }}>✦</span>{item}
                    </li>
                  ))}
                </ul>
                <div style={{
                  width:'100%', padding:'0.75rem', textAlign:'center', fontSize:'0.8rem', fontWeight:700,
                  background: selected?.name === pkg.name ? C.gold : 'transparent',
                  color: selected?.name === pkg.name ? C.obs : C.chro,
                  border: `1px solid ${selected?.name === pkg.name ? C.gold : C.steel}`,
                }}>
                  {selected?.name === pkg.name ? '✓ Selected' : 'Select Package'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section style={{ padding:'5rem 1.5rem', background:C.carb }}>
        <div style={{ maxWidth:'900px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'3rem' }}>
            <span style={{ color:C.gold, fontSize:'0.7rem', letterSpacing:'0.3em', textTransform:'uppercase' }}>How It Works</span>
            <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(2rem, 5vw, 3rem)', color:C.sil, fontWeight:600, marginTop:'0.5rem' }}>The Process</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'1px', background:C.steel }}>
            {[
              { step:'01', title:'Decontamination', desc:'Iron removal, chemical wash, clay bar. Every contaminant stripped from the paint.' },
              { step:'02', title:'Paint Correction', desc:'Machine polish removes swirls, scratches, and oxidation. Paint is perfected first.' },
              { step:'03', title:'IPA Wipedown', desc:'Isopropyl alcohol removes all polish oils. Surface is chemically clean for bonding.' },
              { step:'04', title:'Coating Application', desc:'Panel by panel ceramic application. Each layer cures before the next is applied.' },
              { step:'05', title:'Cure & Inspect', desc:'Infrared cure, full inspection under lighting. Every inch checked before we leave.' },
            ].map((s, i) => (
              <div key={i} style={{ background:C.obs, padding:'2rem 1.5rem' }}>
                <div style={{ color:'rgba(201,168,76,0.3)', fontFamily:'Cormorant Garamond,serif', fontSize:'3rem', fontWeight:700, marginBottom:'0.5rem' }}>{s.step}</div>
                <h3 style={{ color:C.sil, fontSize:'1rem', fontWeight:600, marginBottom:'0.5rem' }}>{s.title}</h3>
                <p style={{ color:'rgba(200,200,204,0.6)', fontSize:'0.8rem', lineHeight:1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding:'5rem 1.5rem', background:C.obs }}>
        <div style={{ maxWidth:'700px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'3rem' }}>
            <span style={{ color:C.gold, fontSize:'0.7rem', letterSpacing:'0.3em', textTransform:'uppercase' }}>FAQ</span>
            <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(2rem, 5vw, 3rem)', color:C.sil, fontWeight:600, marginTop:'0.5rem' }}>Common Questions</h2>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'1px' }}>
            {FAQS.map((f, i) => (
              <div key={i} style={{ background:C.graph }}>
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ width:'100%', textAlign:'left', padding:'1.2rem 1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', background:'transparent', border:'none', color:C.sil, cursor:'pointer', fontSize:'0.875rem', fontWeight:500 }}>
                  <span style={{ paddingRight:'1rem' }}>{f.q}</span>
                  <span style={{ color:C.gold, fontSize:'1.2rem', flexShrink:0 }}>{faqOpen === i ? '−' : '+'}</span>
                </button>
                {faqOpen === i && (
                  <div style={{ padding:'0 1.5rem 1.2rem', color:'rgba(200,200,204,0.7)', fontSize:'0.85rem', lineHeight:1.7, borderTop:`1px solid ${C.steel}`, paddingTop:'1rem' }}>{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking form */}
      <section style={{ padding:'5rem 1.5rem', background:C.carb }}>
        <div style={{ maxWidth:'580px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'3rem' }}>
            <span style={{ color:C.gold, fontSize:'0.7rem', letterSpacing:'0.3em', textTransform:'uppercase' }}>Get a Quote</span>
            <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(2rem, 5vw, 3rem)', color:C.sil, fontWeight:600, marginTop:'0.5rem' }}>
              {selected ? `${selected.name} Package — $${selected.price[vehicle].toLocaleString()}` : 'Request a Ceramic Quote'}
            </h2>
            {!selected && <p style={{ color:C.chro, fontSize:'0.85rem', marginTop:'0.5rem' }}>Select a package above or just send us your info for a custom quote.</p>}
          </div>

          {status === 'success' ? (
            <div style={{ border:`1px solid rgba(201,168,76,0.3)`, background:C.graph, padding:'3rem', textAlign:'center' }}>
              <div style={{ color:C.gold, fontSize:'2.5rem', marginBottom:'1rem' }}>✦</div>
              <h3 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'2rem', color:C.sil, marginBottom:'0.75rem' }}>Quote Request Received</h3>
              <p style={{ color:'rgba(200,200,204,0.7)' }}>We'll reach out within 2 hours to schedule your appointment. Thanks, {form.name}!</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                <input name="name" placeholder="Full name *" value={form.name} onChange={handle} style={inputStyle} />
                <input name="phone" placeholder="Phone number *" value={form.phone} onChange={handle} style={inputStyle} />
              </div>
              <input name="email" placeholder="Email (optional)" value={form.email} onChange={handle} style={inputStyle} />
              <input name="vehicle" placeholder="Year, make, model (e.g. 2021 Ford F-150)" value={form.vehicle} onChange={handle} style={inputStyle} />
              <textarea name="notes" placeholder="Paint condition, garage available, preferred dates..." value={form.notes} onChange={handle} rows={4} style={inputStyle} />
              {status === 'error' && <p style={{ color:C.amb, fontSize:'0.85rem' }}>Please fill in your name and phone number.</p>}
              <button onClick={submit} disabled={status === 'loading'} style={{ width:'100%', background:C.gold, color:C.obs, fontWeight:700, padding:'1rem', fontSize:'0.875rem', border:'none', cursor:'pointer', opacity: status === 'loading' ? 0.6 : 1, letterSpacing:'0.05em' }}>
                {status === 'loading' ? 'Sending...' : 'Request Ceramic Quote'}
              </button>
              <p style={{ textAlign:'center', color:'rgba(200,200,204,0.4)', fontSize:'0.75rem' }}>Or call/text directly: <span style={{ color:C.gold }}>(661) 932-0000</span></p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background:C.obs, borderTop:`1px solid ${C.steel}`, padding:'2rem 1.5rem', textAlign:'center' }}>
        <a href="/" style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.1rem', color:C.sil, textDecoration:'none' }}>
          Bakersfield's Best <span style={{ color:C.gold }}>Mobile Detailing</span>
        </a>
        <p style={{ color:'rgba(200,200,204,0.3)', fontSize:'0.75rem', marginTop:'0.5rem' }}>© {new Date().getFullYear()} · Bakersfield, CA · (661) 932-0000</p>
      </footer>

    </main>
  )
}

'use client'
import { useState, useEffect } from 'react'

const C = {
  obs:'#0A0A0B', carb:'#141416', graph:'#1E1E22', steel:'#2C2C32',
  chro:'#C8C8CC', sil:'#E8E8EC', gold:'#C9A84C', goldL:'#E2C97E', amb:'#F5A623',
}

const NAV = ['Services','Why Us','Packages','Gallery','Contact']

const SERVICES = [
  { icon:'✦', title:'Exterior Detail',  desc:'Hand wash, clay bar, tire dressing, window clean, door jambs. Your paint will beg to be looked at.', price:'From $80' },
  { icon:'◈', title:'Interior Detail',  desc:'Deep vacuum, steam clean, leather conditioning, odor elimination, dash and console restoration.', price:'From $100' },
  { icon:'⬡', title:'Full Detail',      desc:'The complete treatment — inside and out. Every surface addressed, every panel polished.', price:'From $160' },
  { icon:'◉', title:'Paint Correction', desc:'Multi-stage machine polish removes swirls, scratches, and oxidation. Reveal the paint underneath.', price:'From $250' },
  { icon:'◌', title:'Ceramic Coating',  desc:'Professional-grade nano-ceramic protection. Hydrophobic, gloss-amplifying, built to last.', price:'From $400' },
  { icon:'▣', title:'Fleet Detailing',  desc:'Keep your whole fleet sharp. Recurring schedules available for 3+ vehicles.', price:'Call for quote' },
]

const PACKAGES = [
  { name:'Express', tagline:'In and out, no fuss', price:'$80', featured:false, items:['Exterior hand wash','Window clean','Tire & rim shine','Interior vacuum','Dashboard wipe'] },
  { name:'Signature', tagline:'Our most popular', price:'$160', featured:true, items:['Everything in Express','Clay bar decontamination','Interior steam clean','Leather conditioning','Door jamb detail','Air freshener'] },
  { name:'Elite', tagline:'The full treatment', price:'$300+', featured:false, items:['Everything in Signature','Single-stage paint correction','Engine bay clean','Headlight restoration','Ceramic spray sealant','Priority scheduling'] },
]

const FAQS = [
  { q:'Do you come to me?', a:'Yes — 100% mobile. We bring everything: water, power, products. Just tell us where.' },
  { q:'How long does it take?', a:'Express runs 1–1.5 hrs. Full detail 3–4 hrs. Paint correction or ceramic coating can take a full day.' },
  { q:'What do I need to provide?', a:'Nothing. We are completely self-contained. A flat surface is ideal but not required.' },
  { q:'Do you service the entire Bakersfield area?', a:'Yes — we cover Bakersfield and surrounding areas including Oildale, Rosedale, and Lamont.' },
  { q:'How do I pay?', a:'Cash, Venmo, Zelle, or card. Payment collected after the job is done to your satisfaction.' },
]

function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])
  const go = (id) => { setOpen(false); document.getElementById(id.toLowerCase().replace(' ','-'))?.scrollIntoView({behavior:'smooth'}) }

  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:50,
      background: scrolled ? 'rgba(10,10,11,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? `1px solid ${C.steel}` : 'none',
      transition:'all 0.3s',
    }}>
      <div style={{maxWidth:'1100px', margin:'0 auto', padding:'1rem 1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div style={{fontFamily:'Cormorant Garamond,serif', fontSize:'1.4rem', fontWeight:600, color:C.sil}}>
          BB<span style={{color:C.gold}}>MD</span>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:'2rem'}} className="desktop-nav">
          {NAV.map(l => (
            <button key={l} onClick={() => go(l)} style={{background:'none', border:'none', color:C.chro, fontSize:'0.85rem', fontWeight:500, cursor:'pointer', fontFamily:'Inter,sans-serif'}}>{l}</button>
          ))}
          <button onClick={() => go('Contact')} style={{background:C.gold, color:C.obs, border:'none', fontSize:'0.85rem', fontWeight:700, padding:'0.6rem 1.4rem', cursor:'pointer', fontFamily:'Inter,sans-serif'}}>Book Now</button>
        </div>
        <button onClick={() => setOpen(!open)} style={{background:'none', border:'none', color:C.chro, display:'none'}} className="mobile-burger">☰</button>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-burger { display: block !important; }
        }
      `}</style>
      {open && (
        <div style={{background:C.carb, borderTop:`1px solid ${C.steel}`, padding:'1rem 1.5rem', display:'flex', flexDirection:'column', gap:'1rem'}}>
          {NAV.map(l => (
            <button key={l} onClick={() => go(l)} style={{background:'none', border:'none', color:C.chro, fontSize:'0.9rem', textAlign:'left', padding:'0.5rem 0', cursor:'pointer'}}>{l}</button>
          ))}
          <button onClick={() => go('Contact')} style={{background:C.gold, color:C.obs, border:'none', fontWeight:700, padding:'0.8rem', cursor:'pointer'}}>Book Now</button>
        </div>
      )}
    </nav>
  )
}

function Hero() {
  const go = (id) => document.getElementById(id)?.scrollIntoView({behavior:'smooth'})
  return (
    <section style={{minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative', background:C.obs, padding:'6rem 1.5rem 2rem'}}>
      <div style={{textAlign:'center', maxWidth:'800px'}}>
        <div style={{display:'inline-block', border:`1px solid rgba(201,168,76,0.3)`, color:C.gold, fontSize:'0.7rem', letterSpacing:'0.3em', textTransform:'uppercase', padding:'0.4rem 1rem', marginBottom:'2rem'}}>
          Bakersfield, CA · Mobile Service
        </div>
        <h1 style={{fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(2.8rem, 9vw, 6rem)', fontWeight:600, lineHeight:1.05, marginBottom:'1.5rem'}}>
          <span style={{display:'block', color:C.sil}}>Your car.</span>
          <span style={{display:'block', color:C.gold}}>Showroom clean.</span>
        </h1>
        <p style={{color:C.chro, fontSize:'1.1rem', maxWidth:'480px', margin:'0 auto 2.5rem', lineHeight:1.6, fontWeight:300}}>
          Bakersfield's best mobile detailing — we come to your home, office, or anywhere in between.
        </p>
        <div style={{display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap'}}>
          <button onClick={() => go('contact')} style={{background:C.gold, color:C.obs, fontWeight:700, fontSize:'0.85rem', padding:'0.9rem 2rem', border:'none', cursor:'pointer', letterSpacing:'0.03em'}}>Book Your Detail</button>
          <button onClick={() => go('packages')} style={{background:'transparent', color:C.chro, fontSize:'0.85rem', padding:'0.9rem 2rem', border:`1px solid rgba(200,200,204,0.3)`, cursor:'pointer'}}>See Packages</button>
        </div>
        <div style={{marginTop:'4rem', display:'flex', justifyContent:'center', gap:'1.5rem', flexWrap:'wrap', color:'rgba(200,200,204,0.5)', fontSize:'0.7rem', letterSpacing:'0.15em', textTransform:'uppercase'}}>
          {['5★ Rated','Fully Insured','Eco Products','Self-Contained'].map(t => (
            <span key={t} style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
              <span style={{width:'4px', height:'4px', borderRadius:'50%', background:C.gold, display:'inline-block'}}></span>{t}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function SectionHeader({ label, title, sub }) {
  return (
    <div style={{textAlign:'center', marginBottom:'4rem'}}>
      <span style={{color:C.gold, fontSize:'0.7rem', letterSpacing:'0.3em', textTransform:'uppercase'}}>{label}</span>
      <h2 style={{fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(2.2rem, 5vw, 3.2rem)', fontWeight:600, color:C.sil, marginTop:'0.6rem'}}>{title}</h2>
      {sub && <p style={{color:'rgba(200,200,204,0.6)', marginTop:'0.8rem', maxWidth:'420px', marginLeft:'auto', marginRight:'auto'}}>{sub}</p>}
    </div>
  )
}

function Services() {
  return (
    <section id="services" style={{padding:'6rem 1.5rem', background:C.carb}}>
      <div style={{maxWidth:'1100px', margin:'0 auto'}}>
        <SectionHeader label="What We Do" title="Services" />
        <div style={{height:'1px', background:`linear-gradient(90deg, transparent, ${C.gold}, transparent)`, marginBottom:'3rem'}}></div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'1px', background:C.steel}}>
          {SERVICES.map((s,i) => (
            <div key={i} style={{background:C.carb, padding:'2rem'}}>
              <div style={{color:C.gold, fontSize:'1.5rem', marginBottom:'1rem'}}>{s.icon}</div>
              <h3 style={{fontFamily:'Cormorant Garamond,serif', fontSize:'1.5rem', fontWeight:600, color:C.sil, marginBottom:'0.75rem'}}>{s.title}</h3>
              <p style={{color:'rgba(200,200,204,0.7)', fontSize:'0.875rem', lineHeight:1.6, marginBottom:'1rem'}}>{s.desc}</p>
              <span style={{color:C.gold, fontSize:'0.85rem', fontWeight:500}}>{s.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhyUs() {
  const stats = [
    { n:'500+', label:'Cars detailed' },
    { n:'5★', label:'Average rating' },
    { n:'3 yrs', label:'Serving Bakersfield' },
    { n:'100%', label:'Mobile — we come to you' },
  ]
  return (
    <section id="why-us" style={{padding:'6rem 1.5rem', background:C.obs}}>
      <div style={{maxWidth:'1100px', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'3rem', alignItems:'center'}}>
        <div>
          <span style={{color:C.gold, fontSize:'0.7rem', letterSpacing:'0.3em', textTransform:'uppercase'}}>Why Choose Us</span>
          <h2 style={{fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(2.2rem, 5vw, 3.2rem)', fontWeight:600, color:C.sil, marginTop:'0.6rem', marginBottom:'1.2rem', lineHeight:1.15}}>
            Detail obsessed.<br/>Bakersfield proud.
          </h2>
          <p style={{color:'rgba(200,200,204,0.7)', lineHeight:1.7, marginBottom:'1rem'}}>
            We're not a franchise — we're local. Every detail is done by hand, with professional-grade products, by someone who takes pride in the result.
          </p>
          <p style={{color:'rgba(200,200,204,0.7)', lineHeight:1.7}}>
            No garage needed. No appointment hassle. Just text us your address and we show up with everything.
          </p>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1px', background:C.steel}}>
          {stats.map((s,i) => (
            <div key={i} style={{background:C.graph, padding:'2rem', textAlign:'center'}}>
              <div style={{fontFamily:'Cormorant Garamond,serif', fontSize:'2.2rem', color:C.gold, fontWeight:600, marginBottom:'0.4rem'}}>{s.n}</div>
              <div style={{color:'rgba(200,200,204,0.6)', fontSize:'0.7rem', letterSpacing:'0.1em', textTransform:'uppercase'}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Packages() {
  const go = () => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})
  return (
    <section id="packages" style={{padding:'6rem 1.5rem', background:C.carb}}>
      <div style={{maxWidth:'1100px', margin:'0 auto'}}>
        <SectionHeader label="Pricing" title="Packages" sub="Flat rates. No surprises. Trucks and SUVs add $20–$40." />
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'1px', background:C.steel}}>
          {PACKAGES.map((p,i) => (
            <div key={i} style={{
              background: p.featured ? C.graph : C.carb,
              padding:'2.5rem', display:'flex', flexDirection:'column',
              outline: p.featured ? `1px solid rgba(201,168,76,0.4)` : 'none',
            }}>
              {p.featured && <span style={{color:C.gold, fontSize:'0.7rem', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'1rem'}}>Most Popular</span>}
              <h3 style={{fontFamily:'Cormorant Garamond,serif', fontSize:'1.8rem', color:C.sil, fontWeight:600}}>{p.name}</h3>
              <p style={{color:'rgba(200,200,204,0.5)', fontSize:'0.7rem', letterSpacing:'0.1em', textTransform:'uppercase', margin:'0.3rem 0 1.5rem'}}>{p.tagline}</p>
              <div style={{fontFamily:'Cormorant Garamond,serif', fontSize:'2.8rem', color:C.gold, fontWeight:600, marginBottom:'2rem'}}>{p.price}</div>
              <ul style={{listStyle:'none', padding:0, margin:'0 0 2rem', flex:1}}>
                {p.items.map((item,j) => (
                  <li key={j} style={{display:'flex', alignItems:'flex-start', gap:'0.6rem', fontSize:'0.875rem', color:'rgba(200,200,204,0.7)', marginBottom:'0.7rem'}}>
                    <span style={{color:C.gold, fontSize:'0.7rem', marginTop:'0.2rem'}}>✦</span>{item}
                  </li>
                ))}
              </ul>
              <button onClick={go} style={{
                width:'100%', padding:'0.85rem', fontSize:'0.85rem', fontWeight:700, cursor:'pointer', letterSpacing:'0.03em',
                background: p.featured ? C.gold : 'transparent',
                color: p.featured ? C.obs : C.chro,
                border: p.featured ? 'none' : `1px solid rgba(200,200,204,0.2)`,
              }}>Book {p.name}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Gallery() {
  return (
    <section id="gallery" style={{padding:'6rem 1.5rem', background:C.obs}}>
      <div style={{maxWidth:'1100px', margin:'0 auto'}}>
        <SectionHeader label="The Work" title="Gallery" />
        <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'2px'}}>
          {Array.from({length:6}).map((_,i) => (
            <div key={i} style={{aspectRatio:'1', background:C.graph, border:`1px solid ${C.steel}`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'rgba(200,200,204,0.2)', fontSize:'0.65rem', letterSpacing:'0.1em', textTransform:'uppercase'}}>
              <span style={{color:'rgba(201,168,76,0.2)', fontSize:'1.5rem', marginBottom:'0.5rem'}}>◈</span>Add Photo
            </div>
          ))}
        </div>
        <p style={{textAlign:'center', color:'rgba(200,200,204,0.4)', fontSize:'0.8rem', marginTop:'2rem'}}>
          Drop before/after photos into <code style={{color:'rgba(201,168,76,0.6)'}}>/public/gallery/</code>
        </p>
      </div>
    </section>
  )
}

function FAQ() {
  const [open, setOpen] = useState(null)
  return (
    <section style={{padding:'6rem 1.5rem', background:C.carb}}>
      <div style={{maxWidth:'700px', margin:'0 auto'}}>
        <SectionHeader label="FAQ" title="Common Questions" />
        <div style={{display:'flex', flexDirection:'column', gap:'1px'}}>
          {FAQS.map((f,i) => (
            <div key={i} style={{background:C.graph}}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{width:'100%', textAlign:'left', padding:'1.2rem 1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', background:'transparent', border:'none', color:C.sil, cursor:'pointer', fontSize:'0.9rem', fontWeight:500}}>
                <span style={{paddingRight:'1rem'}}>{f.q}</span>
                <span style={{color:C.gold, fontSize:'1.2rem', flexShrink:0}}>{open === i ? '−' : '+'}</span>
              </button>
              {open === i && (
                <div style={{padding:'0 1.5rem 1.2rem', color:'rgba(200,200,204,0.7)', fontSize:'0.875rem', lineHeight:1.6, borderTop:`1px solid ${C.steel}`, paddingTop:'1rem'}}>{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [form, setForm] = useState({ name:'', phone:'', email:'', service:'', address:'', message:'' })
  const [status, setStatus] = useState('')
  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async () => {
    if (!form.name || !form.phone || !form.service) { setStatus('error'); return }
    setStatus('loading')
    try {
      const res = await fetch('/api/booking', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
      setStatus(res.ok ? 'success' : 'error')
    } catch { setStatus('error') }
  }

  const inputStyle = { width:'100%', background:C.graph, border:`1px solid ${C.steel}`, color:C.sil, fontSize:'0.875rem', padding:'0.75rem 1rem', outline:'none', boxSizing:'border-box', fontFamily:'Inter,sans-serif' }

  return (
    <section id="contact" style={{padding:'6rem 1.5rem', background:C.obs}}>
      <div style={{maxWidth:'600px', margin:'0 auto'}}>
        <SectionHeader label="Get Started" title="Book Your Detail" sub="We'll confirm within 2 hours. Same-day slots often available." />
        {status === 'success' ? (
          <div style={{border:`1px solid rgba(201,168,76,0.3)`, background:C.graph, padding:'2.5rem', textAlign:'center'}}>
            <div style={{color:C.gold, fontSize:'2rem', marginBottom:'1rem'}}>✦</div>
            <h3 style={{fontFamily:'Cormorant Garamond,serif', fontSize:'1.8rem', color:C.sil, marginBottom:'0.75rem'}}>Booking Received</h3>
            <p style={{color:'rgba(200,200,204,0.7)'}}>We'll reach out to confirm shortly. Thanks, {form.name}!</p>
          </div>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:'0.75rem'}}>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem'}}>
              <input name="name" placeholder="Full name *" value={form.name} onChange={handle} style={inputStyle} />
              <input name="phone" placeholder="Phone number *" value={form.phone} onChange={handle} style={inputStyle} />
            </div>
            <input name="email" placeholder="Email (optional)" value={form.email} onChange={handle} style={inputStyle} />
            <select name="service" value={form.service} onChange={handle} style={{...inputStyle, color: form.service ? C.sil : 'rgba(200,200,204,0.4)'}}>
              <option value="" disabled>Select a service *</option>
              <option style={{color:'#000'}}>Express Detail — $80</option>
              <option style={{color:'#000'}}>Signature Detail — $160</option>
              <option style={{color:'#000'}}>Elite Detail — $300+</option>
              <option style={{color:'#000'}}>Paint Correction</option>
              <option style={{color:'#000'}}>Ceramic Coating</option>
              <option style={{color:'#000'}}>Fleet Detailing</option>
              <option style={{color:'#000'}}>Other / Not sure</option>
            </select>
            <input name="address" placeholder="Your location / address" value={form.address} onChange={handle} style={inputStyle} />
            <textarea name="message" placeholder="Vehicle type, year, any special requests..." value={form.message} onChange={handle} rows={4} style={inputStyle} />
            {status === 'error' && <p style={{color:C.amb, fontSize:'0.85rem'}}>Please fill in your name, phone, and service selection.</p>}
            <button onClick={submit} disabled={status === 'loading'} style={{width:'100%', background:C.gold, color:C.obs, fontWeight:700, padding:'1rem', fontSize:'0.875rem', border:'none', cursor:'pointer', opacity: status === 'loading' ? 0.6 : 1}}>
              {status === 'loading' ? 'Sending...' : 'Request Booking'}
            </button>
          </div>
        )}
        <div style={{marginTop:'2.5rem', display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'1rem', textAlign:'center', color:'rgba(200,200,204,0.5)', fontSize:'0.75rem'}}>
          <div><div style={{color:C.gold, marginBottom:'0.3rem'}}>📞</div>Call or Text<br/><span style={{color:'rgba(200,200,204,0.7)'}}>(661) 555-0000</span></div>
          <div><div style={{color:C.gold, marginBottom:'0.3rem'}}>📍</div>Serving<br/><span style={{color:'rgba(200,200,204,0.7)'}}>All of Bakersfield</span></div>
          <div><div style={{color:C.gold, marginBottom:'0.3rem'}}>🕐</div>Hours<br/><span style={{color:'rgba(200,200,204,0.7)'}}>Mon–Sat 7am–6pm</span></div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{background:C.carb, borderTop:`1px solid ${C.steel}`, padding:'2.5rem 1.5rem'}}>
      <div style={{maxWidth:'1100px', margin:'0 auto', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:'1rem'}}>
        <div style={{fontFamily:'Cormorant Garamond,serif', fontSize:'1.1rem', color:C.sil}}>Bakersfield's Best <span style={{color:C.gold}}>Mobile Detailing</span></div>
        <p style={{color:'rgba(200,200,204,0.4)', fontSize:'0.75rem'}}>© {new Date().getFullYear()} Bakersfield's Best Mobile Detailing · Bakersfield, CA</p>
        <div style={{display:'flex', gap:'1rem', fontSize:'0.75rem'}}>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{color:'rgba(200,200,204,0.4)', textDecoration:'none'}}>Instagram</a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{color:'rgba(200,200,204,0.4)', textDecoration:'none'}}>Facebook</a>
        </div>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <main>
      <NavBar />
      <Hero />
      <Services />
      <WhyUs />
      <Packages />
      <Gallery />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  )
}

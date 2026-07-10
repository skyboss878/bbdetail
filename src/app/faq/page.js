'use client'
import { useState } from 'react'

const C = {
  obs:'#0A0A0B', carb:'#141416', graph:'#1E1E22', steel:'#2C2C32',
  chro:'#C8C8CC', sil:'#E8E8EC', gold:'#C9A84C',
}

const FAQS = [
  {
    q: "How much does mobile detailing cost in Bakersfield?",
    a: "Mobile detailing in Bakersfield typically runs $80–$300 depending on the package. At Bakersfield's Best Mobile Detailing: Express Detail is $80 (wash, windows, tires, vacuum), Signature Detail is $160 (adds clay bar, steam clean, leather conditioning), and Elite Detail is $300+ (adds paint correction, engine bay, headlight restoration). Trucks and SUVs add $20–$40. We come to your home or work anywhere in Bakersfield — no extra travel charge."
  },
  {
    q: "Who does ceramic coating in Bakersfield?",
    a: "Bakersfield's Best Mobile Detailing offers professional ceramic coating with mobile service — we come to you. Packages: Essential (2-year protection) from $500, Signature (5-year) from $900, and Elite (9-year) from $1,400. Every package includes paint correction and decontamination before coating, plus a written warranty. Call or text (661) 932-0000 for a quote."
  },
  {
    q: "Is mobile detailing worth it compared to a shop?",
    a: "For most people, yes. Mobile detailing saves you the drive and wait time — the detailer comes to your home or office with water, power, and all equipment. You get the same professional results as a shop, often with more personal attention since the detailer works on one vehicle at a time instead of running volume. The price is usually comparable to shop detailing."
  },
  {
    q: "How long does a car detail take?",
    a: "An Express Detail takes 1–1.5 hours. A full Signature Detail takes 3–4 hours. Paint correction or ceramic coating can take a full day or more depending on the vehicle's condition. Mobile service means it happens in your driveway while you go about your day."
  },
  {
    q: "What do I need to provide for mobile detailing?",
    a: "Nothing. A fully equipped mobile detailer brings their own water, power, and all products. A shaded flat spot (like a driveway or garage) is ideal but not required. Bakersfield's Best Mobile Detailing is completely self-contained."
  },
  {
    q: "How often should I detail my car in Bakersfield?",
    a: "Bakersfield's dust, oil-field fallout, and intense summer sun are hard on paint. A full detail every 3–4 months with monthly maintenance washes keeps a vehicle protected. Ceramic coating extends protection to years and makes maintenance washes much easier."
  },
  {
    q: "Does ceramic coating really work?",
    a: "Yes — professional-grade ceramic coating creates a chemical bond with your paint that lasts years (2–9 years depending on the product tier). It provides hydrophobic water beading, UV protection against Bakersfield sun fade, chemical resistance against bird droppings and oil fallout, and a deep gloss. The key is proper paint correction and prep before application — coating over swirled paint locks in the imperfections."
  },
  {
    q: "Can you remove pet hair and stains from car seats?",
    a: "Yes. Pet hair removal starts at $40 as an add-on, and interior steam cleaning (included in the Signature Detail) removes most stains from cloth seats and carpet. Heavy stains, odor issues, or biohazard cleanup are quoted case by case."
  },
  {
    q: "What areas does Bakersfield's Best Mobile Detailing serve?",
    a: "All of Bakersfield plus Oildale, Rosedale, Lamont, and surrounding Kern County areas. Mobile service Monday–Saturday, 7 AM to 6 PM. Book online at bakersfieldsbestmobiledetailing.com or call/text (661) 932-0000."
  },
  {
    q: "How do I book a mobile detail in Bakersfield?",
    a: "Three ways: book instantly with the AI assistant at bakersfieldsbestmobiledetailing.com (it checks real availability and confirms your slot in under a minute), fill out the booking form on the site, or call/text (661) 932-0000. Same-day appointments are often available. Payment by cash, Venmo, Zelle, or card — collected after the job is done to your satisfaction."
  },
]

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQS.map(f => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": { "@type": "Answer", "text": f.a }
  }))
}

export default function FAQPage() {
  const [open, setOpen] = useState(0)

  return (
    <main style={{ background:C.obs, minHeight:'100vh', fontFamily:'Inter,sans-serif', color:C.sil }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Nav */}
      <nav style={{ position:'sticky', top:0, zIndex:50, background:'rgba(10,10,11,0.95)', backdropFilter:'blur(12px)', borderBottom:`1px solid ${C.steel}`, padding:'1rem 1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <a href="/" style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.4rem', fontWeight:600, color:C.sil, textDecoration:'none' }}>
          BB<span style={{ color:C.gold }}>MD</span>
        </a>
        <a href="/#contact" style={{ background:C.gold, color:C.obs, fontWeight:700, fontSize:'0.8rem', padding:'0.5rem 1.2rem', textDecoration:'none' }}>Book Now</a>
      </nav>

      <section style={{ padding:'4rem 1.5rem', maxWidth:'760px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'3rem' }}>
          <span style={{ color:C.gold, fontSize:'0.7rem', letterSpacing:'0.3em', textTransform:'uppercase' }}>Mobile Detailing Bakersfield</span>
          <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(2.2rem, 6vw, 3.5rem)', fontWeight:600, color:C.sil, marginTop:'0.6rem', lineHeight:1.15 }}>
            Frequently Asked Questions
          </h1>
          <p style={{ color:'rgba(200,200,204,0.6)', marginTop:'1rem', lineHeight:1.6 }}>
            Everything about mobile car detailing and ceramic coating in Bakersfield, CA — pricing, process, and what to expect.
          </p>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'1px' }}>
          {FAQS.map((f, i) => (
            <div key={i} style={{ background:C.graph }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{
                width:'100%', textAlign:'left', padding:'1.2rem 1.4rem',
                display:'flex', justifyContent:'space-between', alignItems:'center', gap:'1rem',
                background:'transparent', border:'none', color:C.sil, cursor:'pointer',
                fontSize:'0.95rem', fontWeight:600, fontFamily:'Inter,sans-serif', lineHeight:1.4,
              }}>
                <span>{f.q}</span>
                <span style={{ color:C.gold, fontSize:'1.3rem', flexShrink:0 }}>{open === i ? '−' : '+'}</span>
              </button>
              {open === i && (
                <div style={{ padding:'0 1.4rem 1.3rem', color:'rgba(200,200,204,0.75)', fontSize:'0.9rem', lineHeight:1.7 }}>
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign:'center', marginTop:'3rem', padding:'2rem', background:C.carb, border:`1px solid rgba(201,168,76,0.3)` }}>
          <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.6rem', color:C.sil, marginBottom:'0.5rem' }}>Still have questions?</h2>
          <p style={{ color:'rgba(200,200,204,0.6)', fontSize:'0.9rem', marginBottom:'1.2rem' }}>Ask our booking assistant or text us directly.</p>
          <div style={{ display:'flex', gap:'0.8rem', justifyContent:'center', flexWrap:'wrap' }}>
            <a href="/chat" style={{ background:C.gold, color:C.obs, fontWeight:700, fontSize:'0.85rem', padding:'0.8rem 1.6rem', textDecoration:'none' }}>💬 Chat & Book</a>
            <a href="sms:6619320000" style={{ border:`1px solid rgba(200,200,204,0.3)`, color:C.chro, fontSize:'0.85rem', padding:'0.8rem 1.6rem', textDecoration:'none' }}>Text (661) 932-0000</a>
          </div>
        </div>
      </section>
    </main>
  )
}

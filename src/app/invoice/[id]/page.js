'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const C = { bg:'#0A0A0B', card:'#141416', line:'#2C2C32', text:'#E8E8EC', dim:'#8b8b93', gold:'#F5A623', green:'#4ade80' };

export default function PublicInvoice() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    fetch(`/api/invoices/${id}`).then(r => r.ok ? r.json() : Promise.reject()).then(setData).catch(() => setErr(true));
  }, [id]);

  const center = { minHeight:'100vh', background:C.bg, color:C.dim, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'system-ui,sans-serif', padding:16 };
  if (err) return <div style={center}>Invoice not found.</div>;
  if (!data) return <div style={center}>Loading…</div>;

  const f = data.invoice.fields;
  const amt = Number(f.Amount || 0).toFixed(2);
  const { cashapp, venmo, zelle } = data.pay;
  const paid = f.Status === 'Paid';
  const row = { display:'flex', justifyContent:'space-between', fontSize:14, padding:'9px 0', borderBottom:`1px solid ${C.line}` };
  const payBtn = (bg, color) => ({ display:'block', textAlign:'center', background:bg, color, fontWeight:700, padding:'13px 0', borderRadius:12, textDecoration:'none', marginBottom:8 });

  return (
    <div style={center}>
      <div style={{ width:'100%', maxWidth:420, background:C.card, border:`1px solid ${C.line}`, borderRadius:16, overflow:'hidden', color:C.text }}>
        <div style={{ background:C.gold, color:'#0A0A0B', padding:'18px 22px' }}>
          <div style={{ fontWeight:800, fontSize:17 }}>Bakersfield's Best Mobile Detailing</div>
          <div style={{ fontWeight:700, fontSize:13, marginTop:2 }}>{f['Invoice Number']}</div>
        </div>
        <div style={{ padding:20 }}>
          <div style={row}><span style={{ color:C.dim }}>Billed to</span><span>{f['Customer Name']}</span></div>
          <div style={row}><span style={{ color:C.dim }}>Service</span><span style={{ textAlign:'right' }}>{f.Service || '—'}</span></div>
          {f['Due Date'] && <div style={row}><span style={{ color:C.dim }}>Due</span><span>{f['Due Date']}</span></div>}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0' }}>
            <span style={{ fontWeight:700, fontSize:17 }}>Total</span>
            <span style={{ fontWeight:800, fontSize:26, color:C.gold }}>${amt}</span>
          </div>
          {paid ? (
            <div style={{ background:'rgba(74,222,128,.1)', border:'1px solid rgba(74,222,128,.4)', color:C.green, fontWeight:700, textAlign:'center', padding:'13px 0', borderRadius:12 }}>✓ PAID — Thank you!</div>
          ) : (
            <div>
              {cashapp && <a href={`https://cash.app/$${cashapp}/${amt}`} style={payBtn('#00d632', '#000')}>Pay with Cash App</a>}
              {venmo && <a href={`https://account.venmo.com/pay?txn=pay&recipients=${venmo}&amount=${amt}&note=${f['Invoice Number']}`} style={payBtn('#3d95ce', '#fff')}>Pay with Venmo</a>}
              {zelle && <div style={{ background:'#1E1E22', borderRadius:12, padding:12, textAlign:'center', fontSize:14 }}><span style={{ color:C.dim }}>Zelle: </span><span style={{ fontWeight:700, color:'#c9b3f5' }}>{zelle}</span></div>}
              <div style={{ color:C.dim, fontSize:11, textAlign:'center', paddingTop:10 }}>Include {f['Invoice Number']} in the payment note.</div>
            </div>
          )}
          {f.Notes && <div style={{ color:C.dim, fontSize:12, marginTop:16, borderTop:`1px solid ${C.line}`, paddingTop:12 }}>{f.Notes}</div>}
        </div>
      </div>
    </div>
  );
}

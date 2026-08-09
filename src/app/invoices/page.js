'use client';
import { useState, useEffect } from 'react';

const C = { bg:'#0A0A0B', card:'#141416', line:'#2C2C32', text:'#E8E8EC', dim:'#8b8b93', gold:'#F5A623', green:'#4ade80', dark:'#0A0A0B' };
const S = {
  page:{ minHeight:'100vh', background:C.bg, color:C.text, padding:'16px', fontFamily:'system-ui,sans-serif' },
  wrap:{ maxWidth:760, margin:'0 auto' },
  card:{ background:C.card, border:`1px solid ${C.line}`, borderRadius:14, padding:16, marginBottom:10 },
  inp:{ width:'100%', boxSizing:'border-box', background:'#1E1E22', border:`1px solid ${C.line}`, borderRadius:10, padding:'11px 12px', fontSize:14, color:C.text, marginBottom:8, outline:'none' },
  btnGold:{ background:C.gold, color:C.dark, fontWeight:700, border:'none', borderRadius:10, padding:'11px 16px', fontSize:14, cursor:'pointer' },
  btnGhost:{ flex:1, textAlign:'center', background:'#1E1E22', border:`1px solid ${C.line}`, color:'#c8c8cc', fontWeight:700, fontSize:12, padding:'10px 0', borderRadius:10, textDecoration:'none', cursor:'pointer' },
  badge:(s)=>({ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99, background:s==='Paid'?'rgba(74,222,128,.15)':s==='Sent'?'rgba(245,166,35,.15)':'rgba(140,140,150,.15)', color:s==='Paid'?C.green:s==='Sent'?C.gold:'#a0a0a8' }),
};

export default function Invoices() {
  const [auth, setAuth] = useState(false);
  const [pin, setPin] = useState('');
  const [inv, setInv] = useState([]);
  const [busy, setBusy] = useState('');
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', phone:'', service:'', amount:'', dueDate:'', notes:'' });

  const load = () => fetch('/api/invoices').then(r => r.json()).then(d => setInv(Array.isArray(d) ? d : []));
  useEffect(() => { if (auth) load(); }, [auth]);

  const money = n => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
  const month = new Date().toISOString().slice(0, 7);
  const paidInv = inv.filter(i => i.fields.Status === 'Paid');
  const totalPaid = paidInv.reduce((s, i) => s + (i.fields.Amount || 0), 0);
  const outstanding = inv.filter(i => i.fields.Status !== 'Paid').reduce((s, i) => s + (i.fields.Amount || 0), 0);
  const thisMonth = paidInv.filter(i => (i.fields['Paid Date'] || '').startsWith(month)).reduce((s, i) => s + (i.fields.Amount || 0), 0);

  const create = async () => {
    if (!form.name || !form.email || !form.amount) return alert('Name, email, and amount required');
    setBusy('create');
    const r = await fetch('/api/invoices', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(form) });
    setBusy('');
    if (!r.ok) return alert('Error creating invoice');
    setForm({ name:'', email:'', phone:'', service:'', amount:'', dueDate:'', notes:'' });
    setShow(false); load();
  };

  const send = async id => {
    setBusy(id);
    const r = await fetch('/api/invoices/send', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ id }) });
    setBusy('');
    if (!r.ok) { const e = await r.json().catch(() => ({})); return alert(e.error?.message || e.error || 'Email failed'); }
    load();
  };

  const markPaid = async id => {
    const method = prompt('Paid by? (Cash / Check / Venmo / Credit Card / Zelle / Cash App)') || '';
    setBusy(id);
    await fetch(`/api/invoices/${id}`, { method:'PATCH', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ status:'Paid', method: method.trim() }) });
    setBusy(''); load();
  };

  if (!auth) return (
    <div style={{ ...S.page, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ ...S.card, width:'100%', maxWidth:300, textAlign:'center', padding:28 }}>
        <h1 style={{ color:C.gold, fontSize:20, margin:'0 0 16px' }}>BBMD Invoices</h1>
        <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="PIN" style={{ ...S.inp, textAlign:'center' }} />
        <button onClick={() => pin === '1234' ? setAuth(true) : alert('Wrong PIN')} style={{ ...S.btnGold, width:'100%' }}>Enter</button>
      </div>
    </div>
  );

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <h1 style={{ color:C.gold, fontSize:20, margin:0 }}>Sales &amp; Invoices</h1>
          <button onClick={() => setShow(!show)} style={S.btnGold}>{show ? 'Close' : '+ New Invoice'}</button>
        </div>

        <div style={{ display:'flex', gap:8, marginBottom:8 }}>
          {[['Collected', totalPaid, C.green], ['Outstanding', outstanding, C.gold], ['This Month', thisMonth, C.text]].map(([l, v, col]) => (
            <div key={l} style={{ ...S.card, flex:1, marginBottom:0, padding:12 }}>
              <div style={{ color:C.dim, fontSize:11 }}>{l}</div>
              <div style={{ color:col, fontWeight:700, fontSize:16 }}>{money(v)}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', gap:8, margin:'8px 0 16px' }}>
          <a href="/api/invoices/report?range=month" style={S.btnGhost}>This Month CSV</a>
          <a href="/api/invoices/report?range=all" style={S.btnGhost}>All Time CSV</a>
        </div>

        {show && (
          <div style={S.card}>
            <input style={S.inp} placeholder="Customer name *" value={form.name} onChange={e => setForm({ ...form, name:e.target.value })} />
            <input style={S.inp} placeholder="Email *" value={form.email} onChange={e => setForm({ ...form, email:e.target.value })} />
            <input style={S.inp} placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone:e.target.value })} />
            <input style={S.inp} placeholder="Service" value={form.service} onChange={e => setForm({ ...form, service:e.target.value })} />
            <div style={{ display:'flex', gap:8 }}>
              <input style={S.inp} type="number" placeholder="Amount *" value={form.amount} onChange={e => setForm({ ...form, amount:e.target.value })} />
              <input style={S.inp} type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate:e.target.value })} />
            </div>
            <textarea style={{ ...S.inp, resize:'vertical' }} rows={2} placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes:e.target.value })} />
            <button onClick={create} disabled={busy === 'create'} style={{ ...S.btnGold, width:'100%', opacity: busy === 'create' ? .5 : 1 }}>{busy === 'create' ? 'Creating…' : 'Create Invoice'}</button>
          </div>
        )}

        {inv.map(i => (
          <div key={i.id} style={S.card}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <div style={{ fontWeight:700 }}>{i.fields['Customer Name']}</div>
                <div style={{ color:C.dim, fontSize:12, marginTop:2 }}>
                  {i.fields['Invoice Number']} · {i.fields.Service || '—'}{i.fields['Payment Method'] ? ' · ' + i.fields['Payment Method'] : ''}
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ color:C.gold, fontWeight:700 }}>{money(i.fields.Amount)}</div>
                <span style={S.badge(i.fields.Status)}>{i.fields.Status}</span>
              </div>
            </div>
            <div style={{ display:'flex', gap:8, marginTop:12 }}>
              {i.fields.Status !== 'Paid' && (
                <>
                  <button onClick={() => send(i.id)} disabled={busy === i.id} style={{ ...S.btnGhost, color:C.gold, borderColor:'rgba(245,166,35,.4)' }}>{busy === i.id ? '…' : i.fields.Status === 'Sent' ? 'Resend Email' : 'Send Email'}</button>
                  <button onClick={() => markPaid(i.id)} disabled={busy === i.id} style={{ ...S.btnGhost, color:C.green, borderColor:'rgba(74,222,128,.4)' }}>Mark Paid</button>
                </>
              )}
              <a href={`/invoice/${i.id}`} target="_blank" style={S.btnGhost}>View</a>
            </div>
          </div>
        ))}
        {inv.length === 0 && <div style={{ color:C.dim, textAlign:'center', padding:'40px 0', fontSize:14 }}>No invoices yet.</div>}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';

const API = '/api';

const SERVICES = [
  { name: 'Basic Wash', price: 45 },
  { name: 'Full Detail', price: 249 },
  { name: 'Interior Detail', price: 149 },
  { name: 'Exterior Detail', price: 129 },
  { name: 'Engine Bay Clean', price: 75 },
  { name: 'Ceramic Coating', price: 299 },
  { name: 'Headlight Restoration', price: 65 },
  { name: 'Odor Elimination', price: 50 },
  { name: 'Paint Decontamination', price: 80 },
  { name: 'Leather Conditioner', price: 45 },
  { name: 'Carpet Shampoo', price: 60 },
  { name: 'Tire Shine', price: 20 },
  { name: 'Wax & Sealant', price: 55 },
  { name: 'Air Freshener', price: 10 },
  { name: 'Vent & Dashboard Detail', price: 35 },
];

const UPSELL_RULES = {
  'Basic Wash': [
    { name: 'Interior Vacuum', price: 35, reason: '90% of customers add this' },
    { name: 'Tire Shine', price: 20, reason: 'Only $20 more, takes 10 min' },
    { name: 'Air Freshener', price: 10, reason: 'Impulse add-on, almost never refused' }
  ],
  'Full Detail': [
    { name: 'Ceramic Coating', price: 299, reason: 'Protects their investment 2 years' },
    { name: 'Engine Bay Clean', price: 75, reason: 'High margin, 30 min job' },
    { name: 'Odor Elimination', price: 50, reason: 'Pet/smoke owners always need this' }
  ],
  'Interior Detail': [
    { name: 'Leather Conditioner', price: 45, reason: 'Show them cracked leather — sells itself' },
    { name: 'Carpet Shampoo', price: 60, reason: 'They already paid for interior' },
    { name: 'Vent & Dashboard Detail', price: 35, reason: 'Quick add, high perceived value' }
  ],
  'Exterior Detail': [
    { name: 'Paint Decontamination', price: 80, reason: 'Demo with spray — invisible to them' },
    { name: 'Headlight Restoration', price: 65, reason: 'Safety + looks — easy emotional sell' },
    { name: 'Wax & Sealant', price: 55, reason: 'They want it to last — this locks it in' }
  ]
};

function getUpsells(services) {
  const seen = new Set();
  const result = [];
  services.forEach(svc => {
    (UPSELL_RULES[svc.name] || []).forEach(u => {
      if (!seen.has(u.name) && !services.find(s => s.name === u.name)) {
        seen.add(u.name); result.push(u);
      }
    });
  });
  return result.slice(0, 4);
}

const css = `
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
body { background: #0d0d1a; color: #f0f0f0; font-family: 'DM Sans', sans-serif; min-height: 100vh; }
:root { --red:#e94560; --dark:#1a1a2e; --mid:#16213e; --gold:#f5a623; --green:#00d084; --muted:#8892a4; }
.app { max-width:430px; margin:0 auto; min-height:100vh; background:#0d0d1a; }
.header { background:var(--dark); padding:16px 20px 12px; position:sticky; top:0; z-index:100; border-bottom:2px solid var(--red); }
.header-brand { font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--red); letter-spacing:2px; }
.header-sub { font-size:10px; color:var(--muted); letter-spacing:3px; text-transform:uppercase; }
.nav { display:flex; background:var(--dark); border-top:1px solid #222; position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:430px; z-index:100; }
.nav-btn { flex:1; padding:12px 4px 10px; background:none; border:none; color:var(--muted); font-family:'DM Sans',sans-serif; font-size:9px; font-weight:600; letter-spacing:1px; text-transform:uppercase; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:4px; transition:color 0.2s; }
.nav-btn.active { color:var(--red); }
.nav-icon { font-size:20px; line-height:1; }
.page { padding:16px 16px 90px; }
.stats-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px; }
.stat-card { background:var(--dark); border-radius:12px; padding:14px; border:1px solid #222; }
.stat-card.highlight { border-color:var(--red); background:linear-gradient(135deg,#1a1a2e,#2d0a14); }
.stat-label { font-size:10px; color:var(--muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:4px; }
.stat-value { font-family:'Bebas Neue',sans-serif; font-size:28px; line-height:1; }
.invoice-card { background:var(--dark); border-radius:12px; padding:14px; margin-bottom:10px; border:1px solid #222; cursor:pointer; }
.invoice-card:active { border-color:var(--red); }
.inv-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; }
.inv-id { font-family:'Bebas Neue',sans-serif; font-size:18px; color:var(--red); letter-spacing:1px; }
.inv-status { font-size:10px; font-weight:700; padding:3px 8px; border-radius:20px; letter-spacing:1px; text-transform:uppercase; }
.status-pending { background:rgba(245,166,35,0.15); color:var(--gold); }
.status-paid { background:rgba(0,208,132,0.15); color:var(--green); }
.inv-name { font-weight:600; font-size:15px; margin-bottom:2px; }
.inv-services { font-size:12px; color:var(--muted); margin-bottom:8px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.inv-footer { display:flex; justify-content:space-between; align-items:center; }
.inv-total { font-family:'Bebas Neue',sans-serif; font-size:22px; }
.inv-date { font-size:11px; color:var(--muted); }
.badge-row { display:flex; gap:4px; margin-top:4px; }
.badge { font-size:9px; padding:2px 6px; border-radius:10px; font-weight:600; }
.badge-sms { background:rgba(233,69,96,0.15); color:var(--red); }
.badge-email { background:rgba(15,52,96,0.4); color:#6cb4e4; }
.section-title { font-family:'Bebas Neue',sans-serif; font-size:20px; color:var(--red); letter-spacing:2px; margin-bottom:12px; }
.input { width:100%; background:var(--dark); border:1px solid #333; border-radius:8px; padding:11px 14px; color:#f0f0f0; font-family:'DM Sans',sans-serif; font-size:15px; outline:none; transition:border-color 0.2s; margin-bottom:10px; }
.input:focus { border-color:var(--red); }
.input::placeholder { color:#444; }
.services-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:16px; }
.svc-btn { background:var(--dark); border:1px solid #333; border-radius:10px; padding:10px 8px; cursor:pointer; text-align:left; transition:all 0.2s; }
.svc-btn.selected { border-color:var(--red); background:rgba(233,69,96,0.1); }
.svc-name { font-size:12px; font-weight:600; margin-bottom:2px; }
.svc-price { font-family:'Bebas Neue',sans-serif; font-size:18px; color:var(--gold); }
.custom-row { display:flex; gap:8px; margin-bottom:12px; align-items:center; }
.custom-row .input { margin-bottom:0; }
.upsell-panel { background:linear-gradient(135deg,#1a1a2e,#16213e); border:1px solid var(--gold); border-radius:12px; padding:14px; margin-bottom:16px; }
.upsell-title { font-family:'Bebas Neue',sans-serif; font-size:16px; color:var(--gold); letter-spacing:2px; margin-bottom:10px; }
.upsell-item { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #2a2a4a; }
.upsell-item:last-child { border-bottom:none; }
.upsell-left { flex:1; }
.upsell-name { font-size:13px; font-weight:600; }
.upsell-reason { font-size:11px; color:var(--muted); margin-top:1px; }
.upsell-price { font-family:'Bebas Neue',sans-serif; font-size:18px; color:var(--gold); margin-right:8px; }
.add-btn { background:var(--gold); color:#1a1a2e; border:none; border-radius:6px; width:28px; height:28px; font-size:18px; font-weight:700; cursor:pointer; }
.totals-box { background:var(--dark); border-radius:12px; padding:14px; margin-bottom:16px; border:1px solid #333; }
.total-row { display:flex; justify-content:space-between; padding:5px 0; font-size:14px; }
.total-row.grand { font-family:'Bebas Neue',sans-serif; font-size:24px; color:var(--red); border-top:1px solid #333; margin-top:5px; padding-top:10px; }
.btn { width:100%; padding:14px; border-radius:10px; border:none; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:700; cursor:pointer; transition:all 0.2s; margin-bottom:10px; }
.btn-primary { background:var(--red); color:#fff; }
.btn-secondary { background:var(--dark); color:#f0f0f0; border:1px solid #333; }
.btn-green { background:var(--green); color:#0d0d1a; }
.btn-gold { background:var(--gold); color:#0d0d1a; }
.btn-sm { width:auto; padding:9px 16px; font-size:13px; margin-bottom:0; }
.detail-header { background:var(--dark); border-radius:12px; padding:16px; margin-bottom:12px; border:1px solid #333; }
.action-row { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px; }
.service-list-item { display:flex; justify-content:space-between; padding:9px 0; border-bottom:1px solid #1e1e30; font-size:14px; }
.service-list-item:last-child { border-bottom:none; }
.empty { text-align:center; padding:60px 20px; }
.empty-icon { font-size:60px; margin-bottom:16px; }
.empty-text { color:var(--muted); font-size:15px; }
.toast { position:fixed; top:20px; left:50%; transform:translateX(-50%); background:var(--green); color:#0d0d1a; padding:12px 24px; border-radius:20px; font-weight:700; font-size:14px; z-index:9999; white-space:nowrap; }
.toast.error { background:var(--red); color:#fff; }
.divider { height:1px; background:#1e1e30; margin:16px 0; }
.notes-input { min-height:70px; resize:none; }
`;

export default function App() {
  const [tab, setTab] = useState('home');
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [toast, setToast] = useState(null);
  const [customer, setCustomer] = useState({ name:'', phone:'', email:'', address:'' });
  const [selectedServices, setSelectedServices] = useState([]);
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const upsells = getUpsells(selectedServices);

  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = useCallback(async () => {
    try {
      const [inv, st] = await Promise.all([
        fetch(`${API}/invoices`).then(r => r.json()),
        fetch(`${API}/stats`).then(r => r.json())
      ]);
      setInvoices(Array.isArray(inv) ? inv : []);
      setStats(st);
    } catch {}
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const toggleService = (svc) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.name === svc.name);
      return exists ? prev.filter(s => s.name !== svc.name) : [...prev, svc];
    });
  };

  const addUpsell = (u) => {
    setSelectedServices(prev => [...prev, { name: u.name, price: u.price }]);
    showToast(`+$${u.price} — ${u.name} added!`);
  };

  const addCustom = () => {
    if (!customName || !customPrice) return;
    setSelectedServices(prev => [...prev, { name: customName, price: parseFloat(customPrice) }]);
    setCustomName(''); setCustomPrice('');
  };

  const subtotal = selectedServices.reduce((s, sv) => s + parseFloat(sv.price), 0);
  const tax = subtotal * 0.0725;
  const total = subtotal + tax;
  const calcTotal = (inv) => (inv.services.reduce((s, sv) => s + parseFloat(sv.price), 0) * 1.0725).toFixed(2);
  const formatDate = (iso) => new Date(iso).toLocaleDateString('en-US', { month:'short', day:'numeric' });

  // Build SMS message and open native Messages app
  const sendSMS = (inv) => {
    const t = calcTotal(inv);
    const serviceList = inv.services.map(s => `  • ${s.name}: $${parseFloat(s.price).toFixed(2)}`).join('\n');
    const msg = `Hey ${inv.customer.name}! 👋\n\nHere's your invoice from Bakersfield's Best Mobile Detailing:\n\nInvoice #${inv.id}\n\n${serviceList}\n\nTotal: $${t}\n\nThank you for your business! 🚗✨\nQuestions? Call/text us anytime.`;
    window.location.href = `sms:${inv.customer.phone}?body=${encodeURIComponent(msg)}`;
    // Mark as sent
    fetch(`${API}/invoices/${inv.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ smsSent: true })
    }).then(() => { loadData(); showToast('Messages app opened! 📱'); });
  };

  // Build email and open native mail app
  const sendEmail = (inv) => {
    if (!inv.customer.email) { showToast('No email on file', 'error'); return; }
    const t = calcTotal(inv);
    const serviceList = inv.services.map(s => `${s.name}: $${parseFloat(s.price).toFixed(2)}`).join('%0A');
    const subject = encodeURIComponent(`Invoice #${inv.id} — $${t} — Bakersfield's Best Mobile Detailing`);
    const body = encodeURIComponent(`Hi ${inv.customer.name},\n\nThank you for choosing Bakersfield's Best Mobile Detailing!\n\nInvoice #${inv.id}\n\nServices:\n${inv.services.map(s=>`  • ${s.name}: $${parseFloat(s.price).toFixed(2)}`).join('\n')}\n\nTotal: $${t}\n\n${inv.notes ? `Notes: ${inv.notes}\n\n` : ''}We appreciate your business! If you have any questions, just reply to this email.\n\nBakersfield's Best Mobile Detailing`);
    window.location.href = `mailto:${inv.customer.email}?subject=${subject}&body=${body}`;
    fetch(`${API}/invoices/${inv.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailSent: true })
    }).then(() => { loadData(); showToast('Mail app opened! 📧'); });
  };

  const createInvoice = async () => {
    if (!customer.name || !customer.phone || selectedServices.length === 0) {
      showToast('Add customer info and at least one service', 'error'); return;
    }
    setLoading(true);
    try {
      await fetch(`${API}/invoices`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ customer, services: selectedServices, notes })
      });
      setCustomer({ name:'', phone:'', email:'', address:'' });
      setSelectedServices([]); setNotes('');
      showToast('Invoice created! 🚗');
      await loadData();
      setTab('invoices');
    } catch { showToast('Error creating invoice', 'error'); }
    setLoading(false);
  };

  const markPaid = async (id) => {
    await fetch(`${API}/invoices/${id}`, {
      method:'PATCH', headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ status:'paid' })
    });
    showToast('Marked as paid! 💰');
    setSelectedInvoice(p => ({ ...p, status:'paid' }));
    loadData();
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {toast && <div className={`toast${toast.type==='error'?' error':''}`}>{toast.msg}</div>}

        <div className="header">
          <div className="header-brand">Bakersfield's Best</div>
          <div className="header-sub">Mobile Detailing · Invoice Pro</div>
        </div>

        {tab === 'home' && (
          <div className="page">
            <div style={{ marginBottom:16 }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28, letterSpacing:2 }}>Dashboard</div>
              <div style={{ color:'var(--muted)', fontSize:13 }}>{new Date().toLocaleDateString('en-US',{ weekday:'long', month:'long', day:'numeric' })}</div>
            </div>
            <div className="stats-grid">
              <div className="stat-card highlight">
                <div className="stat-label">Month Revenue</div>
                <div className="stat-value" style={{ color:'var(--red)' }}>${stats.monthRevenue||'0.00'}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Month Jobs</div>
                <div className="stat-value">{stats.monthCount||0}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Pending</div>
                <div className="stat-value" style={{ color:'var(--gold)' }}>{stats.pendingInvoices||0}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Revenue</div>
                <div className="stat-value" style={{ color:'var(--green)', fontSize:22 }}>${stats.totalRevenue||'0.00'}</div>
              </div>
            </div>
            <div className="section-title">Recent Jobs</div>
            {invoices.slice(0,3).map(inv => (
              <div key={inv.id} className="invoice-card" onClick={() => { setSelectedInvoice(inv); setTab('detail'); }}>
                <div className="inv-header">
                  <div className="inv-id">#{inv.id}</div>
                  <span className={`inv-status status-${inv.status}`}>{inv.status}</span>
                </div>
                <div className="inv-name">{inv.customer.name}</div>
                <div className="inv-footer">
                  <div className="inv-total">${calcTotal(inv)}</div>
                  <div className="inv-date">{formatDate(inv.createdAt)}</div>
                </div>
              </div>
            ))}
            <button className="btn btn-primary" style={{ marginTop:8 }} onClick={() => setTab('build')}>+ New Invoice</button>
          </div>
        )}

        {tab === 'build' && (
          <div className="page">
            <div className="section-title">New Invoice</div>
            <input className="input" placeholder="Customer name *" value={customer.name} onChange={e => setCustomer(p=>({...p,name:e.target.value}))} />
            <input className="input" placeholder="Phone number *" type="tel" value={customer.phone} onChange={e => setCustomer(p=>({...p,phone:e.target.value}))} />
            <input className="input" placeholder="Email (optional)" type="email" value={customer.email} onChange={e => setCustomer(p=>({...p,email:e.target.value}))} />
            <input className="input" placeholder="Vehicle / address (optional)" value={customer.address} onChange={e => setCustomer(p=>({...p,address:e.target.value}))} />
            <div className="divider" />
            <div className="section-title" style={{ fontSize:16 }}>Services</div>
            <div className="services-grid">
              {SERVICES.map(svc => (
                <div key={svc.name} className={`svc-btn${selectedServices.find(s=>s.name===svc.name)?' selected':''}`} onClick={() => toggleService(svc)}>
                  <div className="svc-name">{svc.name}</div>
                  <div className="svc-price">${svc.price}</div>
                </div>
              ))}
            </div>
            <div className="custom-row">
              <input className="input" style={{ flex:1 }} placeholder="Custom service" value={customName} onChange={e => setCustomName(e.target.value)} />
              <input className="input" style={{ width:80 }} placeholder="$" type="number" value={customPrice} onChange={e => setCustomPrice(e.target.value)} />
              <button className="btn btn-gold btn-sm" onClick={addCustom}>+Add</button>
            </div>
            {upsells.length > 0 && (
              <div className="upsell-panel">
                <div className="upsell-title">💰 Upsell Opportunities</div>
                {upsells.map(u => (
                  <div key={u.name} className="upsell-item">
                    <div className="upsell-left">
                      <div className="upsell-name">{u.name}</div>
                      <div className="upsell-reason">💡 {u.reason}</div>
                    </div>
                    <span className="upsell-price">${u.price}</span>
                    <button className="add-btn" onClick={() => addUpsell(u)}>+</button>
                  </div>
                ))}
              </div>
            )}
            {selectedServices.length > 0 && (
              <div className="totals-box">
                {selectedServices.map(sv => (
                  <div key={sv.name} className="total-row">
                    <span>{sv.name}</span><span>${parseFloat(sv.price).toFixed(2)}</span>
                  </div>
                ))}
                <div className="total-row" style={{ color:'var(--muted)', fontSize:12 }}>
                  <span>Tax 7.25%</span><span>${tax.toFixed(2)}</span>
                </div>
                <div className="total-row grand"><span>TOTAL</span><span>${total.toFixed(2)}</span></div>
              </div>
            )}
            <textarea className="input notes-input" placeholder="Notes — vehicle details, special requests..." value={notes} onChange={e => setNotes(e.target.value)} />
            <button className="btn btn-primary" onClick={createInvoice} disabled={loading}>
              {loading ? 'Creating...' : `Create Invoice — $${total.toFixed(2)}`}
            </button>
          </div>
        )}

        {tab === 'invoices' && (
          <div className="page">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <div className="section-title" style={{ margin:0 }}>All Jobs</div>
              <button className="btn btn-primary btn-sm" onClick={() => setTab('build')}>+ New</button>
            </div>
            {invoices.length === 0 ? (
              <div className="empty"><div className="empty-icon">🧾</div><div className="empty-text">No invoices yet.</div></div>
            ) : invoices.map(inv => (
              <div key={inv.id} className="invoice-card" onClick={() => { setSelectedInvoice(inv); setTab('detail'); }}>
                <div className="inv-header">
                  <div className="inv-id">#{inv.id}</div>
                  <span className={`inv-status status-${inv.status}`}>{inv.status}</span>
                </div>
                <div className="inv-name">{inv.customer.name}</div>
                <div className="inv-services">{inv.services.map(s=>s.name).join(', ')}</div>
                <div className="inv-footer">
                  <div>
                    <div className="inv-total">${calcTotal(inv)}</div>
                    <div className="badge-row">
                      {inv.smsSent && <span className="badge badge-sms">SMS ✓</span>}
                      {inv.emailSent && <span className="badge badge-email">Email ✓</span>}
                    </div>
                  </div>
                  <div className="inv-date">{formatDate(inv.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'detail' && selectedInvoice && (
          <div className="page">
            <button className="btn btn-secondary btn-sm" onClick={() => setTab('invoices')} style={{ marginBottom:16 }}>← Back</button>
            <div className="detail-header">
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <div className="inv-id" style={{ fontSize:24 }}>#{selectedInvoice.id}</div>
                <span className={`inv-status status-${selectedInvoice.status}`}>{selectedInvoice.status}</span>
              </div>
              <div style={{ fontWeight:700, fontSize:17, marginBottom:4 }}>{selectedInvoice.customer.name}</div>
              <div style={{ color:'var(--muted)', fontSize:13 }}>{selectedInvoice.customer.phone}</div>
              {selectedInvoice.customer.email && <div style={{ color:'var(--muted)', fontSize:13 }}>{selectedInvoice.customer.email}</div>}
              {selectedInvoice.customer.address && <div style={{ color:'var(--muted)', fontSize:13 }}>{selectedInvoice.customer.address}</div>}
              <div style={{ color:'var(--muted)', fontSize:12, marginTop:6 }}>{formatDate(selectedInvoice.createdAt)}</div>
            </div>
            <div style={{ background:'var(--dark)', borderRadius:12, padding:'4px 14px', marginBottom:12, border:'1px solid #333' }}>
              {selectedInvoice.services.map(sv => (
                <div key={sv.name} className="service-list-item">
                  <span>{sv.name}</span>
                  <span style={{ color:'var(--gold)', fontFamily:"'Bebas Neue',sans-serif", fontSize:18 }}>${parseFloat(sv.price).toFixed(2)}</span>
                </div>
              ))}
              <div className="service-list-item" style={{ color:'var(--muted)', fontSize:12 }}>
                <span>Tax 7.25%</span>
                <span>${(selectedInvoice.services.reduce((s,sv)=>s+parseFloat(sv.price),0)*0.0725).toFixed(2)}</span>
              </div>
              <div className="service-list-item" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, color:'var(--red)', borderBottom:'none' }}>
                <span>TOTAL</span><span>${calcTotal(selectedInvoice)}</span>
              </div>
            </div>
            {selectedInvoice.notes && (
              <div style={{ background:'var(--dark)', borderRadius:10, padding:12, marginBottom:12, border:'1px solid #333', fontSize:13, color:'var(--muted)' }}>
                📝 {selectedInvoice.notes}
              </div>
            )}
            <div className="section-title" style={{ fontSize:14 }}>Send Invoice</div>
            <div className="action-row">
              <button className="btn btn-primary btn-sm" onClick={() => sendSMS(selectedInvoice)}>
                📱 {selectedInvoice.smsSent ? 'Resend SMS' : 'Send SMS'}
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => sendEmail(selectedInvoice)}>
                📧 {selectedInvoice.emailSent ? 'Resend Email' : 'Send Email'}
              </button>
            </div>
            {selectedInvoice.status !== 'paid' && (
              <button className="btn btn-green" onClick={() => markPaid(selectedInvoice.id)}>✓ Mark as Paid</button>
            )}
            <div className="divider" />
            <a href={`${API}/invoices/${selectedInvoice.id}/pdf`} target="_blank" rel="noreferrer">
              <button className="btn btn-secondary" style={{ width:'100%' }}>📄 Download PDF</button>
            </a>
          </div>
        )}

        <nav className="nav">
          {[{ id:'home', icon:'🏠', label:'Home' },{ id:'build', icon:'➕', label:'Invoice' },{ id:'invoices', icon:'📋', label:'Jobs' }].map(n => (
            <button key={n.id} className={`nav-btn${tab===n.id||(tab==='detail'&&n.id==='invoices')?' active':''}`} onClick={() => setTab(n.id)}>
              <span className="nav-icon">{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}

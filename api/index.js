const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

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
    { name: 'Leather Conditioner', price: 45, reason: 'Show them cracked leather' },
    { name: 'Carpet Shampoo', price: 60, reason: 'They already paid for interior' },
    { name: 'Vent & Dashboard Detail', price: 35, reason: 'Quick add, high perceived value' }
  ],
  'Exterior Detail': [
    { name: 'Paint Decontamination', price: 80, reason: 'Demo with spray' },
    { name: 'Headlight Restoration', price: 65, reason: 'Safety + looks — easy sell' },
    { name: 'Wax & Sealant', price: 55, reason: 'They want it to last' }
  ]
};

function getUpsells(services) {
  const seen = new Set();
  const result = [];
  services.forEach(svc => {
    (UPSELL_RULES[svc.name] || []).forEach(u => {
      if (!seen.has(u.name)) { seen.add(u.name); result.push(u); }
    });
  });
  return result.slice(0, 4);
}

app.post('/api/upsells', (req, res) => res.json({ upsells: getUpsells(req.body.services || []) }));

app.get('/api/invoices', async (req, res) => {
  const { data, error } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/api/invoices/:id', async (req, res) => {
  const { data, error } = await supabase.from('invoices').select('*').eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

app.post('/api/invoices', async (req, res) => {
  const id = Math.random().toString(36).slice(2,8).toUpperCase();
  const inv = { id, ...req.body, status: 'pending', created_at: new Date().toISOString() };
  const { data, error } = await supabase.from('invoices').insert(inv).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.patch('/api/invoices/:id', async (req, res) => {
  const { data, error } = await supabase.from('invoices').update(req.body).eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete('/api/invoices/:id', async (req, res) => {
  const { error } = await supabase.from('invoices').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

app.get('/api/stats', async (req, res) => {
  const { data, error } = await supabase.from('invoices').select('*');
  if (error) return res.status(500).json({ error: error.message });
  const now = new Date();
  const thisMonth = data.filter(i => {
    const d = new Date(i.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const total = (arr) => arr.reduce((s,i) => s + (i.services||[]).reduce((ss,sv) => ss + parseFloat(sv.price||0), 0), 0);
  res.json({
    totalInvoices: data.length,
    pendingInvoices: data.filter(i => i.status === 'pending').length,
    paidInvoices: data.filter(i => i.status === 'paid').length,
    totalRevenue: total(data).toFixed(2),
    monthRevenue: total(thisMonth).toFixed(2),
    monthCount: thisMonth.length
  });
});

app.get('/api/invoices/:id/pdf', async (req, res) => {
  const { data: inv } = await supabase.from('invoices').select('*').eq('id', req.params.id).single();
  if (!inv) return res.status(404).json({ error: 'Not found' });
  const PDFDocument = require('pdfkit');
  const doc = new PDFDocument({ margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice-${inv.id}.pdf`);
  doc.pipe(res);
  doc.fontSize(24).font('Helvetica-Bold').fillColor('#1a1a2e').text("Bakersfield's Best Mobile Detailing", { align: 'center' });
  doc.fontSize(11).font('Helvetica').fillColor('#666').text('(661) 932-0000 | nate@bakersfieldsbestmobiledetailing.com', { align: 'center' });
  doc.moveDown();
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#e94560').lineWidth(2).stroke();
  doc.moveDown(0.5);
  doc.fontSize(13).font('Helvetica-Bold').fillColor('#1a1a2e').text('INVOICE');
  doc.font('Helvetica').fontSize(11).fillColor('#444').text(`Invoice #: ${inv.id}`).text(`Date: ${new Date(inv.created_at).toLocaleDateString()}`).text(`Status: ${inv.status.toUpperCase()}`);
  doc.moveDown();
  doc.font('Helvetica-Bold').fillColor('#1a1a2e').text('BILL TO:');
  doc.font('Helvetica').fillColor('#444').text(inv.customer.name).text(inv.customer.phone);
  if (inv.customer.email) doc.text(inv.customer.email);
  if (inv.customer.address) doc.text(inv.customer.address);
  doc.moveDown();
  inv.services.forEach(svc => {
    doc.font('Helvetica').fillColor('#333').text(svc.name, 50, doc.y, { width: 350, continued: true });
    doc.font('Helvetica-Bold').fillColor('#e94560').text(`$${parseFloat(svc.price).toFixed(2)}`, { align: 'right' });
  });
  const subtotal = inv.services.reduce((s, sv) => s + parseFloat(sv.price), 0);
  const tax = subtotal * 0.0725;
  const total = subtotal + tax;
  doc.moveDown(0.5);
  doc.font('Helvetica').fillColor('#333').text('Subtotal:', 350, doc.y, { continued: true }).text(`$${subtotal.toFixed(2)}`, { align: 'right' });
  doc.text('Tax (7.25%):', 350, doc.y, { continued: true }).text(`$${tax.toFixed(2)}`, { align: 'right' });
  doc.font('Helvetica-Bold').fontSize(14).fillColor('#e94560').text('TOTAL:', 350, doc.y, { continued: true }).text(`$${total.toFixed(2)}`, { align: 'right' });
  if (inv.notes) { doc.moveDown(); doc.font('Helvetica-Bold').fontSize(11).fillColor('#1a1a2e').text('Notes:'); doc.font('Helvetica').fillColor('#555').text(inv.notes); }
  doc.moveDown(2);
  doc.fontSize(10).fillColor('#999').text("Thank you for choosing Bakersfield's Best Mobile Detailing!", { align: 'center' });
  doc.end();
});

module.exports = app;

app.get('/api/test', async (req, res) => {
  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (!url || !key) return res.json({ error: 'Missing env vars', url: !!url, key: !!key });
    const { data, error } = await supabase.from('invoices').select('count');
    if (error) return res.json({ error: error.message });
    res.json({ ok: true, data });
  } catch(e) {
    res.json({ crash: e.message });
  }
});

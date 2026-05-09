require('dotenv').config();
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

let invoices = [];

function getTwilio() {
  return require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

function getMailer() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
}

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
      if (!seen.has(u.name)) { seen.add(u.name); result.push(u); }
    });
  });
  return result.slice(0, 4);
}

app.post('/api/upsells', (req, res) => res.json({ upsells: getUpsells(req.body.services || []) }));
app.get('/api/invoices', (req, res) => res.json(invoices.sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt))));
app.get('/api/invoices/:id', (req, res) => { const inv = invoices.find(i=>i.id===req.params.id); inv ? res.json(inv) : res.status(404).json({error:'Not found'}); });
app.post('/api/invoices', (req, res) => { const inv = {id:uuidv4().slice(0,8).toUpperCase(),...req.body,status:'pending',createdAt:new Date().toISOString()}; invoices.unshift(inv); res.json(inv); });
app.patch('/api/invoices/:id', (req, res) => { const idx=invoices.findIndex(i=>i.id===req.params.id); if(idx===-1) return res.status(404).json({error:'Not found'}); invoices[idx]={...invoices[idx],...req.body}; res.json(invoices[idx]); });
app.delete('/api/invoices/:id', (req, res) => { invoices=invoices.filter(i=>i.id!==req.params.id); res.json({success:true}); });

app.get('/api/invoices/:id/pdf', (req, res) => {
  const inv = invoices.find(i=>i.id===req.params.id);
  if (!inv) return res.status(404).json({error:'Not found'});
  const doc = new PDFDocument({margin:50});
  res.setHeader('Content-Type','application/pdf');
  res.setHeader('Content-Disposition',`attachment; filename=invoice-${inv.id}.pdf`);
  doc.pipe(res);
  doc.fontSize(24).font('Helvetica-Bold').fillColor('#1a1a2e').text("Bakersfield's Best Mobile Detailing",{align:'center'});
  doc.fontSize(11).font('Helvetica').fillColor('#666').text(`${process.env.BUSINESS_PHONE||''} | ${process.env.BUSINESS_EMAIL||''}`,{align:'center'});
  doc.moveDown();
  doc.moveTo(50,doc.y).lineTo(545,doc.y).strokeColor('#e94560').lineWidth(2).stroke();
  doc.moveDown(0.5);
  doc.fontSize(13).font('Helvetica-Bold').fillColor('#1a1a2e').text('INVOICE');
  doc.font('Helvetica').fontSize(11).fillColor('#444').text(`Invoice #: ${inv.id}`).text(`Date: ${new Date(inv.createdAt).toLocaleDateString()}`).text(`Status: ${inv.status.toUpperCase()}`);
  doc.moveDown();
  doc.font('Helvetica-Bold').fillColor('#1a1a2e').text('BILL TO:');
  doc.font('Helvetica').fillColor('#444').text(inv.customer.name).text(inv.customer.phone);
  if(inv.customer.email) doc.text(inv.customer.email);
  if(inv.customer.address) doc.text(inv.customer.address);
  doc.moveDown();
  doc.font('Helvetica-Bold').fillColor('#1a1a2e').text('SERVICES');
  doc.moveTo(50,doc.y+5).lineTo(545,doc.y+5).strokeColor('#ccc').lineWidth(1).stroke();
  doc.moveDown(0.5);
  inv.services.forEach(svc => {
    doc.font('Helvetica').fillColor('#333').text(svc.name,50,doc.y,{width:350,continued:true});
    doc.font('Helvetica-Bold').fillColor('#e94560').text(`$${parseFloat(svc.price).toFixed(2)}`,{align:'right'});
  });
  const subtotal = inv.services.reduce((s,sv)=>s+parseFloat(sv.price),0);
  const tax = subtotal*0.0725;
  const total = subtotal+tax;
  doc.moveDown(0.5);
  doc.moveTo(50,doc.y).lineTo(545,doc.y).strokeColor('#ccc').lineWidth(1).stroke();
  doc.moveDown(0.5);
  doc.font('Helvetica').fillColor('#333').text('Subtotal:',350,doc.y,{continued:true}).text(`$${subtotal.toFixed(2)}`,{align:'right'});
  doc.text('Tax (7.25%):',350,doc.y,{continued:true}).text(`$${tax.toFixed(2)}`,{align:'right'});
  doc.font('Helvetica-Bold').fontSize(14).fillColor('#e94560').text('TOTAL:',350,doc.y,{continued:true}).text(`$${total.toFixed(2)}`,{align:'right'});
  if(inv.notes){doc.moveDown();doc.font('Helvetica-Bold').fontSize(11).fillColor('#1a1a2e').text('Notes:');doc.font('Helvetica').fillColor('#555').text(inv.notes);}
  doc.moveDown(2);
  doc.fontSize(10).fillColor('#999').text("Thank you for choosing Bakersfield's Best Mobile Detailing!",{align:'center'});
  doc.end();
});

app.post('/api/invoices/:id/send-sms', async (req, res) => {
  const inv = invoices.find(i=>i.id===req.params.id);
  if (!inv) return res.status(404).json({error:'Not found'});
  const total = (inv.services.reduce((s,sv)=>s+parseFloat(sv.price),0)*1.0725).toFixed(2);
  try {
    await getTwilio().messages.create({
      body:`Hey ${inv.customer.name}! Invoice #${inv.id} from Bakersfield's Best Mobile Detailing.\nTotal: $${total}\nThank you! 🚗✨`,
      from: process.env.TWILIO_PHONE,
      to: inv.customer.phone
    });
    invoices.find(i=>i.id===inv.id).smsSent = true;
    res.json({success:true});
  } catch(err) { res.status(500).json({error:err.message}); }
});

app.post('/api/invoices/:id/send-email', async (req, res) => {
  const inv = invoices.find(i=>i.id===req.params.id);
  if (!inv) return res.status(404).json({error:'Not found'});
  if (!inv.customer.email) return res.status(400).json({error:'No email on file'});
  const subtotal = inv.services.reduce((s,sv)=>s+parseFloat(sv.price),0);
  const total = subtotal*1.0725;
  const rows = inv.services.map(s=>`<tr><td style="padding:8px;border-bottom:1px solid #eee">${s.name}</td><td style="padding:8px;text-align:right;color:#e94560"><strong>$${parseFloat(s.price).toFixed(2)}</strong></td></tr>`).join('');
  const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><div style="background:#1a1a2e;padding:30px;text-align:center"><h1 style="color:#e94560;margin:0">Bakersfield's Best</h1><p style="color:#aaa">Mobile Detailing</p></div><div style="padding:30px"><h2>Invoice #${inv.id}</h2><p><strong>Customer:</strong> ${inv.customer.name}</p><table style="width:100%;border-collapse:collapse"><thead><tr style="background:#1a1a2e;color:#fff"><th style="padding:10px;text-align:left">Service</th><th style="padding:10px;text-align:right">Price</th></tr></thead><tbody>${rows}</tbody><tfoot><tr><td style="padding:8px;text-align:right">Tax 7.25%:</td><td style="padding:8px;text-align:right">$${(subtotal*0.0725).toFixed(2)}</td></tr><tr style="background:#e94560;color:#fff"><td style="padding:12px;text-align:right;font-size:18px"><strong>TOTAL:</strong></td><td style="padding:12px;text-align:right;font-size:18px"><strong>$${total.toFixed(2)}</strong></td></tr></tfoot></table>${inv.notes?`<p><strong>Notes:</strong> ${inv.notes}</p>`:''}<div style="margin-top:30px;padding:20px;background:#f9f9f9;text-align:center"><p><strong>Thank you! 🚗✨</strong></p><p style="color:#999;font-size:12px">${process.env.BUSINESS_PHONE||''}</p></div></div></div>`;
  try {
    await getMailer().sendMail({from:process.env.EMAIL_FROM,to:inv.customer.email,subject:`Invoice #${inv.id} — $${total.toFixed(2)} — Bakersfield's Best`,html});
    invoices.find(i=>i.id===inv.id).emailSent = true;
    res.json({success:true});
  } catch(err) { res.status(500).json({error:err.message}); }
});

app.get('/api/stats', (req, res) => {
  const now = new Date();
  const thisMonth = invoices.filter(i=>{const d=new Date(i.createdAt);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();});
  const totalRevenue = invoices.reduce((s,i)=>s+i.services.reduce((ss,sv)=>ss+parseFloat(sv.price),0),0);
  const monthRevenue = thisMonth.reduce((s,i)=>s+i.services.reduce((ss,sv)=>ss+parseFloat(sv.price),0),0);
  res.json({totalInvoices:invoices.length,pendingInvoices:invoices.filter(i=>i.status==='pending').length,paidInvoices:invoices.filter(i=>i.status==='paid').length,totalRevenue:totalRevenue.toFixed(2),monthRevenue:monthRevenue.toFixed(2),monthCount:thisMonth.length});
});

module.exports = app;

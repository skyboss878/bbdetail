const BASE = process.env.AIRTABLE_BASE_ID || 'appNp2qvT32FiDGlC';
const AT = `https://api.airtable.com/v0/${BASE}/Invoices`;
const hdrs = () => ({ Authorization: `Bearer ${(process.env.AIRTABLE_TOKEN || process.env.AIRTABLE_API_KEY)}`, 'Content-Type': 'application/json' });

export async function POST(req) {
  const { id } = await req.json();
  const r = await fetch(`${AT}/${id}`, { headers: hdrs(), cache: 'no-store' });
  const rec = await r.json();
  if (rec.error) return Response.json({ error: 'Invoice not found' }, { status: 404 });
  const f = rec.fields;
  if (!f.Email) return Response.json({ error: 'No email on this invoice' }, { status: 400 });
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://bakersfieldsbestmobiledetailing.com';
  const link = `${site}/invoice/${id}`;
  const amt = Number(f.Amount || 0).toFixed(2);
  const cash = process.env.CASHAPP_TAG, venmo = process.env.VENMO_USERNAME, zelle = process.env.ZELLE_INFO;

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#0f172a;color:#f1f5f9;border-radius:12px;overflow:hidden">
    <div style="background:#f59e0b;color:#0f172a;padding:20px 28px">
      <h2 style="margin:0">Bakersfield's Best Mobile Detailing</h2>
      <p style="margin:4px 0 0;font-weight:bold">Invoice ${f['Invoice Number']}</p>
    </div>
    <div style="padding:28px">
      <p>Hi ${f['Customer Name']},</p>
      <p>Thanks for choosing BBMD! Here's your invoice:</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:8px 0;color:#94a3b8">Service</td><td style="text-align:right">${f.Service || ''}</td></tr>
        ${f['Due Date'] ? `<tr><td style="padding:8px 0;color:#94a3b8">Due</td><td style="text-align:right">${f['Due Date']}</td></tr>` : ''}
        <tr><td style="padding:12px 0;font-size:20px;font-weight:bold;border-top:1px solid #334155">Total</td><td style="padding:12px 0;text-align:right;font-size:20px;font-weight:bold;color:#f59e0b;border-top:1px solid #334155">$${amt}</td></tr>
      </table>
      <a href="${link}" style="display:block;text-align:center;background:#f59e0b;color:#0f172a;font-weight:bold;padding:14px;border-radius:8px;text-decoration:none;margin:8px 0 20px">View Invoice & Pay</a>
      <p style="color:#94a3b8;font-size:14px;margin-bottom:6px">Pay directly:</p>
      ${cash ? `<p style="margin:4px 0"><a href="https://cash.app/$${cash}/${amt}" style="color:#f59e0b">Cash App: $${cash}</a></p>` : ''}
      ${venmo ? `<p style="margin:4px 0"><a href="https://account.venmo.com/pay?txn=pay&recipients=${venmo}&amount=${amt}&note=${f['Invoice Number']}" style="color:#f59e0b">Venmo: @${venmo}</a></p>` : ''}
      ${zelle ? `<p style="margin:4px 0;color:#f1f5f9">Zelle: ${zelle}</p>` : ''}
      <p style="color:#64748b;font-size:12px;margin-top:24px">Please include ${f['Invoice Number']} in the payment note.</p>
    </div>
  </div>`;

  const send = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `BBMD Invoices <${process.env.INVOICE_FROM_EMAIL || 'onboarding@resend.dev'}>`,
      to: [f.Email],
      subject: `Invoice ${f['Invoice Number']} from Bakersfield's Best Mobile Detailing — $${amt}`,
      html,
    }),
  });
  const result = await send.json();
  if (!send.ok) return Response.json({ error: result }, { status: 500 });

  await fetch(`${AT}/${id}`, { method: 'PATCH', headers: hdrs(), body: JSON.stringify({ fields: { Status: 'Sent' } }) });
  return Response.json({ ok: true, emailId: result.id });
}

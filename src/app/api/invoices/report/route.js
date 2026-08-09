const BASE = process.env.AIRTABLE_BASE_ID || 'appNp2qvT32FiDGlC';
const AT = `https://api.airtable.com/v0/${BASE}/Invoices`;

async function fetchAll() {
  let records = [], offset = '';
  do {
    const r = await fetch(`${AT}?sort%5B0%5D%5Bfield%5D=Created&sort%5B0%5D%5Bdirection%5D=asc${offset ? '&offset=' + offset : ''}`, {
      headers: { Authorization: `Bearer ${(process.env.AIRTABLE_TOKEN || process.env.AIRTABLE_API_KEY)}` }, cache: 'no-store',
    });
    const data = await r.json();
    records = records.concat(data.records || []);
    offset = data.offset || '';
  } while (offset);
  return records;
}

export async function GET(req) {
  const range = new URL(req.url).searchParams.get('range') || 'month';
  const month = new Date().toISOString().slice(0, 7);
  let recs = await fetchAll();
  if (range === 'month') recs = recs.filter(x => (x.fields.Created || '').startsWith(month));

  const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = [['Invoice #','Customer','Email','Phone','Service','Amount','Status','Paid By','Created','Due Date','Paid Date','Notes']];
  let total = 0, paid = 0, out = 0;
  const byMethod = {};
  for (const x of recs) {
    const f = x.fields, amt = Number(f.Amount || 0);
    const method = f['Payment Method'] || '';
    total += amt;
    if (f.Status === 'Paid') {
      paid += amt;
      if (method) {
        byMethod[method] = byMethod[method] || { n: 0, amt: 0 };
        byMethod[method].n++; byMethod[method].amt += amt;
      }
    } else out += amt;
    rows.push([f['Invoice Number'], f['Customer Name'], f.Email, f.Phone, f.Service, amt.toFixed(2), f.Status, method, f.Created, f['Due Date'], f['Paid Date'], f.Notes]);
  }

  rows.push([], ['SUMMARY'], ['Total Jobs', recs.length], ['Gross Total','','','','', total.toFixed(2)], ['Collected (Paid)','','','','', paid.toFixed(2)], ['Outstanding','','','','', out.toFixed(2)], ['Average Ticket (paid)','','','','', (() => { const pj = recs.filter(x => x.fields.Status === 'Paid').length; return pj ? (paid / pj).toFixed(2) : '0.00'; })()]);
  rows.push([], ['PAYMENT METHOD','Jobs','Volume','Share %']);
  for (const [m, v] of Object.entries(byMethod).sort((a, b) => b[1].amt - a[1].amt)) {
    rows.push([m, v.n, v.amt.toFixed(2), paid ? ((v.amt / paid) * 100).toFixed(1) : '0.0']);
  }

  const csv = rows.map(row => row.map(esc).join(',')).join('\n');
  const fname = range === 'month' ? `bbmd-invoices-${month}.csv` : 'bbmd-invoices-all.csv';
  return new Response(csv, {
    headers: { 'Content-Type': 'text/csv', 'Content-Disposition': `attachment; filename="${fname}"` },
  });
}

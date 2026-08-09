const BASE = process.env.AIRTABLE_BASE_ID || 'appNp2qvT32FiDGlC';
const AT = `https://api.airtable.com/v0/${BASE}/Invoices`;
const hdrs = () => ({ Authorization: `Bearer ${(process.env.AIRTABLE_TOKEN || process.env.AIRTABLE_API_KEY)}`, 'Content-Type': 'application/json' });

export async function GET() {
  const r = await fetch(`${AT}?sort%5B0%5D%5Bfield%5D=Created&sort%5B0%5D%5Bdirection%5D=desc`, { headers: hdrs(), cache: 'no-store' });
  const data = await r.json();
  return Response.json(data.records || []);
}

export async function POST(req) {
  const b = await req.json();
  const fields = {
    'Invoice Number': 'BBMD-' + Date.now().toString().slice(-6),
    'Customer Name': b.name,
    'Email': b.email,
    'Phone': b.phone || '',
    'Service': b.service,
    'Amount': Number(b.amount),
    'Status': 'Draft',
    'Notes': b.notes || '',
    'Created': new Date().toISOString().slice(0, 10),
  };
  if (b.dueDate) fields['Due Date'] = b.dueDate;
  const r = await fetch(AT, { method: 'POST', headers: hdrs(), body: JSON.stringify({ fields }) });
  const data = await r.json();
  if (data.error) return Response.json({ error: data.error }, { status: 500 });
  return Response.json(data);
}

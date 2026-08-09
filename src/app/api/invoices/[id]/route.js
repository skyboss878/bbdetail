const BASE = process.env.AIRTABLE_BASE_ID || 'appNp2qvT32FiDGlC';
const AT = `https://api.airtable.com/v0/${BASE}/Invoices`;
const hdrs = () => ({ Authorization: `Bearer ${(process.env.AIRTABLE_TOKEN || process.env.AIRTABLE_API_KEY)}`, 'Content-Type': 'application/json' });

export async function GET(req, { params }) {
  const { id } = await Promise.resolve(params);
  const r = await fetch(`${AT}/${id}`, { headers: hdrs(), cache: 'no-store' });
  const data = await r.json();
  if (data.error) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({
    invoice: data,
    pay: {
      cashapp: process.env.CASHAPP_TAG || '',
      venmo: process.env.VENMO_USERNAME || '',
      zelle: process.env.ZELLE_INFO || '',
    },
  });
}

export async function PATCH(req, { params }) {
  const { id } = await Promise.resolve(params);
  const b = await req.json();
  const fields = { Status: b.status };
  if (b.status === 'Paid') {
    fields['Paid Date'] = new Date().toISOString().slice(0, 10);
    if (b.method) fields['Payment Method'] = b.method;
  }
  const r = await fetch(`${AT}/${id}`, { method: 'PATCH', headers: hdrs(), body: JSON.stringify({ fields }) });
  const data = await r.json();
  if (data.error) return Response.json({ error: data.error }, { status: 500 });
  return Response.json(data);
}

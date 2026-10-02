import { NextRequest, NextResponse } from "next/server";

const AIRTABLE_BASE = "appNp2qvT32FiDGlC";
const AIRTABLE_TABLE = "tbl8kRYk4437tP50v"; // Invoices

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, service, amount } = body;

    if (!name || !phone || !email || !amount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const invoiceNumber = `DEP-${Date.now().toString(36).toUpperCase()}`;

    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            "Invoice Number": invoiceNumber,
            "Customer Name": name,
            Phone: phone,
            Email: email,
            Service: service ? `Deposit - ${service}` : "Deposit",
            Amount: parseFloat(amount),
            Status: "Sent",
            "Payment Method": "Venmo",
            Notes: "Deposit — awaiting confirmation. Customer claims sent via Venmo.",
            Created: new Date().toISOString().split("T")[0],
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("Airtable error:", err);
      return NextResponse.json({ error: "Airtable write failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, invoiceNumber });
  } catch (e) {
    console.error("Deposit route error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

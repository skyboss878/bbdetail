"use client";
import { useState } from "react";

export default function DepositPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "", amount: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <Shell>
        <h1 style={{ color: "#E8E8EC", fontFamily: "Cormorant Garamond, serif", fontSize: "1.75rem" }}>
          Thanks, {form.name.split(" ")[0]}!
        </h1>
        <p style={{ color: "#C8C8CC", marginTop: "1rem", lineHeight: 1.6 }}>
          We've got your deposit claim of <strong>${form.amount}</strong> on file. Once we confirm it on Venmo,
          you'll get a receipt by email at <strong>{form.email}</strong>.
        </p>
      </Shell>
    );
  }

  return (
    <Shell>
      <h1 style={{ color: "#E8E8EC", fontFamily: "Cormorant Garamond, serif", fontSize: "1.75rem", marginBottom: "0.25rem" }}>
        Pay Your Deposit
      </h1>
      <p style={{ color: "#C8C8CC", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
        1. Send your deposit via Venmo below. 2. Fill out this form so we can match it and send your receipt.
      </p>

      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <img src="/venmo-qr.png" alt="Venmo QR code" style={{ width: 180, height: 180, margin: "0 auto", borderRadius: 8 }} />
        <a
          href="https://venmo.com/launchlocal"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#C9A84C", fontSize: "0.85rem", display: "inline-block", marginTop: "0.5rem" }}
        >
          @launchlocal on Venmo →
        </a>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <input required placeholder="Full Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
        <input required type="tel" placeholder="Phone" value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
        <input required type="email" placeholder="Email (for your receipt)" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
        <input placeholder="Service (e.g. Ceramic Coating)" value={form.service}
          onChange={(e) => setForm({ ...form, service: e.target.value })} style={inputStyle} />
        <input required type="number" step="0.01" placeholder="Amount Sent ($)" value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })} style={inputStyle} />
        <button type="submit" disabled={status === "loading"} style={buttonStyle}>
          {status === "loading" ? "Submitting..." : "I've Sent My Deposit"}
        </button>
        {status === "error" && (
          <p style={{ color: "#E88", fontSize: "0.85rem" }}>Something went wrong — try again or text us at (661) 932-0000.</p>
        )}
      </form>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0B", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", padding: "1rem" }}>
      <div style={{ background: "#141416", border: "1px solid #2C2C32", padding: "2.5rem", width: "100%", maxWidth: 420 }}>
        {children}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#1E1E22", border: "1px solid #2C2C32", color: "#E8E8EC",
  padding: "0.75rem", fontSize: "1rem", outline: "none", boxSizing: "border-box",
};

const buttonStyle: React.CSSProperties = {
  width: "100%", background: "#C9A84C", color: "#0A0A0B", border: "none",
  padding: "0.85rem", fontWeight: 700, cursor: "pointer", fontSize: "1rem", marginTop: "0.25rem",
};

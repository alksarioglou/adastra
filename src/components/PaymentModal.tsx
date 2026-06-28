"use client";

import { useState } from "react";
import type { PaymentResult } from "@/lib/types";

// Mock payment — no real charge. Fake card form -> spinner -> success.
export function PaymentModal({
  amount,
  onPay,
  onClose,
}: {
  amount: string;
  onPay: () => Promise<PaymentResult>;
  onClose: () => void;
}) {
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [exp, setExp] = useState("12 / 28");
  const [cvc, setCvc] = useState("123");
  const [status, setStatus] = useState<"form" | "processing" | "done">("form");

  async function submit() {
    setStatus("processing");
    try {
      await onPay();
      setStatus("done");
      setTimeout(onClose, 1200);
    } catch {
      setStatus("form");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={status === "form" ? onClose : undefined}
    >
      <div
        className="w-full max-w-sm animate-fade-in-up rounded-2xl border border-border bg-panel p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {status === "done" ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-2/15 text-2xl text-accent-2">
              ✓
            </div>
            <p className="text-lg font-semibold">Payment successful</p>
            <p className="text-sm text-muted">Drones cleared for launch.</p>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-baseline justify-between">
              <h3 className="text-lg font-semibold">Launch campaign</h3>
              <span className="text-lg font-semibold text-accent-2">{amount}</span>
            </div>

            <div className="space-y-3">
              <CardField label="Card number" value={card} onChange={setCard} />
              <div className="flex gap-3">
                <CardField label="Expiry" value={exp} onChange={setExp} />
                <CardField label="CVC" value={cvc} onChange={setCvc} />
              </div>
            </div>

            <button
              onClick={submit}
              disabled={status === "processing"}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 font-medium text-white transition hover:brightness-110 disabled:opacity-60"
            >
              {status === "processing" ? (
                <>
                  <Spinner /> Processing…
                </>
              ) : (
                `Pay ${amount}`
              )}
            </button>
            <p className="mt-3 text-center text-xs text-muted/70">
              Demo mode — no real charge.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function CardField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block flex-1">
      <span className="mb-1 block text-xs uppercase tracking-widest text-muted">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-accent"
      />
    </label>
  );
}

function Spinner() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
  );
}

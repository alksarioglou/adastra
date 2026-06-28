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
      setTimeout(onClose, 1400);
    } catch {
      setStatus("form");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
      onClick={status === "form" ? onClose : undefined}
    >
      <div
        className="w-full max-w-sm animate-fade-in-up border border-ink bg-panel p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {status === "done" ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="eye-pulse h-4 w-4 rounded-full bg-orange" />
            <p className="display mt-1 text-xl">Payment successful</p>
            <p className="text-sm text-muted">Drones cleared for launch.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-baseline justify-between">
              <p className="label text-muted">Launch campaign</p>
              <span className="display text-xl text-orange">{amount}</span>
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
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-sm bg-orange px-6 py-3.5 text-[13px] font-medium uppercase tracking-[0.16em] text-paper-pure transition hover:bg-orange-bright disabled:opacity-60"
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
      <span className="label mb-1.5 block text-muted">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-sm border border-line bg-paper-pure px-3 py-2.5 font-mono text-sm outline-none focus:border-orange"
      />
    </label>
  );
}

function Spinner() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-paper-pure/40 border-t-paper-pure" />
  );
}

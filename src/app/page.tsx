"use client";

import { useState } from "react";
import { ProgressConsole } from "@/components/ProgressConsole";
import { PaymentModal } from "@/components/PaymentModal";
import type {
  LeadsResult,
  PaymentResult,
  Premise,
  PreviewResult,
} from "@/lib/types";

type Phase =
  | "idle"
  | "analyzing"
  | "premise"
  | "finding"
  | "plan"
  | "generating"
  | "preview";

const ANALYZE_LINES = [
  "Opening product URL…",
  "Reading landing page & meta…",
  "Extracting product name and core value prop…",
  "Inferring target market signals…",
  "Composing Ideal Customer Profile…",
];

const LEADS_LINES = [
  "Querying Fiber AI for companies matching the ICP…",
  "Pulling matching profiles from Orange Slice (1.15B LinkedIn records)…",
  "Geo-locating prospects…",
  "Detecting the densest lead cluster…",
  "Choosing the optimal time & place to fly…",
];

const PREVIEW_LINES = [
  "Building the 3D city scene…",
  "Placing the drone swarm formation…",
  "Rendering the QR code in the skyline…",
  "Compositing the campaign preview…",
];

export default function Home() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [url, setUrl] = useState("");
  const [premise, setPremise] = useState<Premise | null>(null);
  const [leads, setLeads] = useState<LeadsResult | null>(null);
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [payment, setPayment] = useState<PaymentResult | null>(null);
  const [showPay, setShowPay] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const urlValid = /^https?:\/\/.+\..+/.test(url.trim());

  async function post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? "Request failed");
    return res.json();
  }

  async function runAnalyze() {
    setError(null);
    setPhase("analyzing");
    try {
      const result = await post<Premise>("/api/analyze", { url: url.trim() });
      setPremise(result);
      setPhase("premise");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
      setPhase("idle");
    }
  }

  async function runLeads() {
    setError(null);
    setPhase("finding");
    try {
      const result = await post<LeadsResult>("/api/leads", { premise });
      setLeads(result);
      setPhase("plan");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lead search failed");
      setPhase("premise");
    }
  }

  async function runPreview() {
    setError(null);
    setPhase("generating");
    try {
      const result = await post<PreviewResult>("/api/preview", {
        premise,
        leads,
      });
      setPreview(result);
      setPhase("preview");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Preview generation failed");
      setPhase("plan");
    }
  }

  async function runPayment() {
    const result = await post<PaymentResult>("/api/pay", { premise, leads });
    setPayment(result);
    return result;
  }

  function reset() {
    setPhase("idle");
    setUrl("");
    setPremise(null);
    setLeads(null);
    setPreview(null);
    setPayment(null);
    setShowPay(false);
    setError(null);
  }

  return (
    <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 py-10">
      <header className="mb-10 flex items-center justify-between">
        <button onClick={reset} className="flex items-center gap-2">
          <span className="text-lg">✦</span>
          <span className="text-lg font-semibold tracking-tight">Ad Astra</span>
        </button>
        <span className="text-xs uppercase tracking-widest text-muted">
          Drone Geo-Targeting
        </span>
      </header>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* STEP 0 — Landing */}
      {phase === "idle" && (
        <section className="flex flex-1 flex-col justify-center">
          <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            A new frontier in <span className="gradient-text">Geo targeting</span>
          </h1>
          <p className="mt-4 max-w-xl text-muted">
            Drop in your product URL. We&apos;ll build your ICP, find where your
            leads cluster, pick the perfect moment, and fly a drone swarm that
            paints a QR code in the sky — just for them.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && urlValid && runAnalyze()}
              placeholder="https://yourproduct.com"
              className="flex-1 rounded-xl border border-border bg-panel px-4 py-3 text-foreground outline-none transition focus:border-accent"
            />
            <button
              onClick={runAnalyze}
              disabled={!urlValid}
              className="rounded-xl bg-accent px-6 py-3 font-medium text-white transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Analyze product
            </button>
          </div>
        </section>
      )}

      {/* STEP 1 — Analyzing */}
      {phase === "analyzing" && (
        <ProgressConsole title="Analyzing product" lines={ANALYZE_LINES} done={false} />
      )}

      {/* STEP 2 — Premise (editable) */}
      {phase === "premise" && premise && (
        <PremiseCard
          premise={premise}
          onChange={setPremise}
          onConfirm={runLeads}
        />
      )}

      {/* STEP 3 — Finding leads */}
      {phase === "finding" && (
        <ProgressConsole title="Finding leads" lines={LEADS_LINES} done={false} />
      )}

      {/* STEP 4 — Campaign plan */}
      {phase === "plan" && leads && (
        <PlanCard leads={leads} onPreview={runPreview} />
      )}

      {/* STEP 5 — Generating preview */}
      {phase === "generating" && (
        <ProgressConsole
          title="Generating campaign preview"
          lines={PREVIEW_LINES}
          done={false}
        />
      )}

      {/* STEP 6 — Preview + pay */}
      {phase === "preview" && preview && (
        <PreviewCard preview={preview} onPay={() => setShowPay(true)} />
      )}

      {showPay && (
        <PaymentModal
          amount="$2,400.00"
          onPay={runPayment}
          onClose={() => setShowPay(false)}
        />
      )}

      {payment?.success && (
        <div className="mt-6 rounded-xl border border-accent-2/30 bg-accent-2/10 px-4 py-3 text-sm text-accent-2">
          Payment confirmed · {payment.txId} · {payment.amount}. Your drones are
          cleared for launch. ✦
        </div>
      )}
    </div>
  );
}

/* ---------- Premise (editable ICP) ---------- */

function PremiseCard({
  premise,
  onChange,
  onConfirm,
}: {
  premise: Premise;
  onChange: (p: Premise) => void;
  onConfirm: () => void;
}) {
  return (
    <section className="animate-fade-in-up">
      <h2 className="text-2xl font-semibold">Here&apos;s what we found</h2>
      <p className="mt-1 text-sm text-muted">
        Review and edit anything before we hunt for leads.
      </p>

      <div className="mt-6 space-y-5 rounded-2xl border border-border bg-panel/80 p-6 backdrop-blur">
        <Field label="Product name">
          <input
            value={premise.productName}
            onChange={(e) => onChange({ ...premise, productName: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
          />
        </Field>

        <Field label="Key feature">
          <textarea
            value={premise.keyFeature}
            onChange={(e) => onChange({ ...premise, keyFeature: e.target.value })}
            rows={2}
            className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
          />
        </Field>

        <Field label={`Ideal Customer Profile (${premise.icp.length} traits) — one per line`}>
          <textarea
            value={premise.icp.join("\n")}
            onChange={(e) =>
              onChange({
                ...premise,
                icp: e.target.value.split("\n").filter((l) => l.trim() !== ""),
              })
            }
            rows={12}
            className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm leading-relaxed outline-none focus:border-accent"
          />
        </Field>
      </div>

      <button
        onClick={onConfirm}
        className="mt-6 w-full rounded-xl bg-accent px-6 py-3 font-medium text-white transition hover:brightness-110"
      >
        Find leads →
      </button>
    </section>
  );
}

/* ---------- Campaign plan ---------- */

function PlanCard({
  leads,
  onPreview,
}: {
  leads: LeadsResult;
  onPreview: () => void;
}) {
  return (
    <section className="animate-fade-in-up">
      <h2 className="text-2xl font-semibold">Campaign plan</h2>
      <p className="mt-1 text-sm text-muted">
        Where your leads cluster — and the perfect moment to reach them.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <InfoTile label="Lead cluster" accent>
          <p className="text-lg font-semibold">{leads.geo.city}</p>
          <p className="text-sm text-foreground/80">{leads.geo.cluster}</p>
          <p className="mt-2 text-sm text-muted">{leads.geo.why}</p>
        </InfoTile>

        <InfoTile label="Best time & place">
          <p className="text-sm font-semibold">{leads.timing.when}</p>
          <p className="text-sm text-foreground/80">{leads.timing.where}</p>
          <p className="mt-2 text-sm text-muted">{leads.timing.why}</p>
        </InfoTile>
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-panel/80 p-5 backdrop-blur">
        <p className="mb-3 text-xs uppercase tracking-widest text-muted">
          Sample leads in cluster
        </p>
        <ul className="space-y-2">
          {leads.leads.map((l, i) => (
            <li
              key={i}
              className="flex items-center justify-between border-b border-border/60 pb-2 text-sm last:border-0 last:pb-0"
            >
              {l.linkedinUrl ? (
                <a
                  href={l.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-accent-2 hover:underline"
                >
                  {l.name} ↗
                </a>
              ) : (
                <span className="font-medium">{l.name}</span>
              )}
              <span className="text-right text-muted">
                {l.title} · {l.company}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onPreview}
        className="mt-6 w-full rounded-xl bg-accent px-6 py-3 font-medium text-white transition hover:brightness-110"
      >
        Campaign Preview →
      </button>
    </section>
  );
}

/* ---------- Preview ---------- */

function PreviewCard({
  preview,
  onPay,
}: {
  preview: PreviewResult;
  onPay: () => void;
}) {
  return (
    <section className="animate-fade-in-up">
      <h2 className="text-2xl font-semibold">Campaign preview</h2>
      <p className="mt-1 text-sm text-muted">{preview.caption}</p>

      <div className="mt-6 aspect-video w-full overflow-hidden rounded-2xl border border-border bg-panel">
        {preview.assetUrl ? (
          preview.assetUrl.match(/\.(mp4|webm)$/) ? (
            <video
              src={preview.assetUrl}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview.assetUrl}
              alt="Campaign preview"
              className="h-full w-full object-cover"
            />
          )
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <div className="grid grid-cols-5 gap-1.5 opacity-80">
              {Array.from({ length: 25 }).map((_, i) => (
                <span
                  key={i}
                  className="h-3 w-3 rounded-sm"
                  style={{
                    background:
                      (i * 7) % 3 === 0 ? "var(--accent-2)" : "transparent",
                    border: "1px solid var(--border)",
                  }}
                />
              ))}
            </div>
            <p className="text-sm text-muted">
              3D drone simulation renders here
            </p>
            <p className="text-xs text-muted/60">
              (partner asset drops into this frame)
            </p>
          </div>
        )}
      </div>

      <button
        onClick={onPay}
        className="mt-6 w-full rounded-xl bg-gradient-to-r from-accent-2 to-accent px-6 py-3 font-semibold text-white transition hover:brightness-110"
      >
        Launch campaign · $2,400
      </button>
    </section>
  );
}

/* ---------- small helpers ---------- */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

function InfoTile({
  label,
  accent,
  children,
}: {
  label: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border bg-panel/80 p-5 backdrop-blur ${
        accent ? "border-accent/40" : "border-border"
      }`}
    >
      <p className="mb-2 text-xs uppercase tracking-widest text-muted">{label}</p>
      {children}
    </div>
  );
}

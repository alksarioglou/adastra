"use client";

import { useState } from "react";
import { ProgressConsole } from "@/components/ProgressConsole";
import { PaymentModal } from "@/components/PaymentModal";
import { CorridorBackdrop } from "@/components/CorridorBackdrop";
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
  "Pulling decision-makers from Orange Slice (LinkedIn database)…",
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

const BTN =
  "inline-flex items-center justify-center gap-2 rounded-sm bg-orange px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.16em] text-paper-pure transition hover:bg-orange-bright disabled:cursor-not-allowed disabled:bg-line disabled:text-muted";

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
    <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 py-8">
      <header className="mb-10 flex items-center justify-between border-b border-line pb-5">
        <button onClick={reset} className="flex items-center gap-2.5">
          <span className="h-3 w-3 bg-orange" />
          <span className="label text-ink">Ad Astra</span>
        </button>
        <span className="label text-muted">Drone Geo-Targeting</span>
      </header>

      {error && (
        <div className="mb-6 rounded-sm border border-orange/40 bg-orange/10 px-4 py-3 text-sm text-ink">
          {error}
        </div>
      )}

      {/* STEP 0 — Landing */}
      {phase === "idle" && (
        <section className="relative flex flex-1 flex-col justify-center">
          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 opacity-[0.08]">
            <CorridorBackdrop className="h-full w-full" />
          </div>

          <p className="label mb-6 text-orange">Mission · 001</p>
          <h1 className="display text-balance text-4xl leading-[1.05] sm:text-6xl">
            A new frontier in
            <br />
            <span className="text-orange">Geo targeting</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Drop in your product URL. We build your ICP, find where your leads
            cluster, pick the perfect moment, and fly a drone swarm that paints a
            QR code in the sky — just for them.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && urlValid && runAnalyze()}
              placeholder="https://yourproduct.com"
              className="flex-1 rounded-sm border border-line bg-panel px-4 py-3.5 text-ink outline-none transition placeholder:text-muted/60 focus:border-orange"
            />
            <button onClick={runAnalyze} disabled={!urlValid} className={BTN}>
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
        <PremiseCard premise={premise} onChange={setPremise} onConfirm={runLeads} />
      )}

      {/* STEP 3 — Finding leads */}
      {phase === "finding" && (
        <ProgressConsole title="Finding leads" lines={LEADS_LINES} done={false} />
      )}

      {/* STEP 4 — Campaign plan */}
      {phase === "plan" && leads && <PlanCard leads={leads} onPreview={runPreview} />}

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
        <div className="mt-6 rounded-sm border border-ink bg-ink px-4 py-3 text-sm text-paper">
          <span className="text-orange">●</span> Payment confirmed ·{" "}
          {payment.txId} · {payment.amount}. Your drones are cleared for launch.
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
      <p className="label mb-3 text-orange">Mission · 002 · Target profile</p>
      <h2 className="display text-3xl">Here&apos;s what we found</h2>
      <p className="mt-2 text-muted">
        Review and edit anything before we hunt for leads.
      </p>

      <div className="mt-8 space-y-6 border border-line bg-panel p-7">
        <Field label="Product name">
          <input
            value={premise.productName}
            onChange={(e) => onChange({ ...premise, productName: e.target.value })}
            className="w-full rounded-sm border border-line bg-paper-pure px-3 py-2.5 outline-none focus:border-orange"
          />
        </Field>

        <Field label="Key feature">
          <textarea
            value={premise.keyFeature}
            onChange={(e) => onChange({ ...premise, keyFeature: e.target.value })}
            rows={2}
            className="w-full resize-none rounded-sm border border-line bg-paper-pure px-3 py-2.5 outline-none focus:border-orange"
          />
        </Field>

        <Field label={`Ideal Customer Profile · ${premise.icp.length} traits · one per line`}>
          <textarea
            value={premise.icp.join("\n")}
            onChange={(e) =>
              onChange({
                ...premise,
                icp: e.target.value.split("\n").filter((l) => l.trim() !== ""),
              })
            }
            rows={12}
            className="w-full resize-y rounded-sm border border-line bg-paper-pure px-3 py-2.5 font-mono text-sm leading-relaxed outline-none focus:border-orange"
          />
        </Field>
      </div>

      <button onClick={onConfirm} className={`${BTN} mt-8 w-full`}>
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
      <p className="label mb-3 text-orange">Mission · 003 · Campaign plan</p>
      <h2 className="display text-3xl">Where & when to strike</h2>
      <p className="mt-2 text-muted">
        The densest cluster of your leads — and the perfect moment to reach them.
      </p>

      <div className="mt-8 grid gap-px border border-ink bg-ink sm:grid-cols-2">
        {/* Lead cluster — black monolith */}
        <div className="bg-ink p-7 text-paper">
          <p className="label mb-3 text-paper/50">Lead cluster</p>
          <p className="display text-2xl text-orange">{leads.geo.city}</p>
          <p className="mt-1 text-paper/90">{leads.geo.cluster}</p>
          <p className="mt-3 text-sm leading-relaxed text-paper/60">
            {leads.geo.why}
          </p>
        </div>

        {/* Timing — white panel */}
        <div className="bg-panel p-7">
          <p className="label mb-3 text-muted">Best time &amp; place</p>
          <p className="font-medium">{leads.timing.when}</p>
          <p className="text-ink/80">{leads.timing.where}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {leads.timing.why}
          </p>
        </div>
      </div>

      <div className="mt-px border border-ink border-t-0 bg-panel p-7">
        <p className="label mb-4 text-muted">Sample leads in cluster</p>
        <ul className="space-y-2.5">
          {leads.leads.map((l, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-4 border-b border-line pb-2.5 text-sm last:border-0 last:pb-0"
            >
              {l.linkedinUrl ? (
                <a
                  href={l.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-orange hover:underline"
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

      <button onClick={onPreview} className={`${BTN} mt-8 w-full`}>
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
      <p className="label mb-3 text-orange">Mission · 004 · Campaign preview</p>
      <h2 className="display text-3xl">The launch</h2>
      <p className="mt-2 text-muted">{preview.caption}</p>

      <div className="relative mt-8 aspect-video w-full overflow-hidden border border-ink bg-ink">
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
          <>
            <div className="pointer-events-none absolute inset-0 opacity-30">
              <CorridorBackdrop className="h-full w-full" />
            </div>
            <div className="relative flex h-full flex-col items-center justify-center gap-4 text-center text-paper">
              <div className="grid grid-cols-5 gap-1.5">
                {Array.from({ length: 25 }).map((_, i) => (
                  <span
                    key={i}
                    className="h-3.5 w-3.5"
                    style={{
                      background:
                        (i * 7) % 3 === 0 ? "var(--orange)" : "transparent",
                      border: "1px solid rgba(255,255,255,0.25)",
                    }}
                  />
                ))}
              </div>
              <p className="label text-paper/70">3D drone simulation</p>
              <p className="text-xs text-paper/40">
                partner asset drops into this frame
              </p>
            </div>
          </>
        )}
      </div>

      <button onClick={onPay} className={`${BTN} mt-8 w-full`}>
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
      <span className="label mb-2 block text-muted">{label}</span>
      {children}
    </label>
  );
}

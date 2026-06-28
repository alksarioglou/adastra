"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LopusAttribution } from "@/components/campaign/LopusAttribution";
import { BTN } from "@/components/flow/constants";
import { FlowShell } from "@/components/flow/FlowShell";
import {
  clearCampaignSession,
  getCampaignLeads,
  getCampaignPayment,
  getCampaignPremise,
} from "@/lib/campaignSession";
import { FUNNEL_STEPS, OVERVIEW_STATS } from "@/lib/campaignAnalyticsMetrics";

const LOPUS_URL = "https://lopus.ai/";

function useAnimatedValue(target: number, durationMs = 3200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value;
}

function formatStatValue(
  value: number,
  format: "number" | "currency",
  animated: number,
) {
  if (format === "currency") {
    return `$${animated.toFixed(2)}`;
  }
  return animated.toLocaleString();
}

export function AnalyticsOverviewDashboard() {
  const router = useRouter();
  const [city, setCity] = useState("your cluster");
  const [productName, setProductName] = useState("Campaign");
  const [txId, setTxId] = useState("");
  const [amount, setAmount] = useState("");

  const animatedScans = useAnimatedValue(
    OVERVIEW_STATS[0].value as number,
    3600,
  );
  const animatedViewers = useAnimatedValue(
    OVERVIEW_STATS[1].value as number,
    3800,
  );

  useEffect(() => {
    const leads = getCampaignLeads();
    const premise = getCampaignPremise();
    const payment = getCampaignPayment();
    if (leads?.geo.city) setCity(leads.geo.city);
    if (premise?.productName) setProductName(premise.productName);
    if (payment?.txId) setTxId(payment.txId);
    if (payment?.amount) setAmount(payment.amount);
  }, []);

  const animatedStats = [
    { ...OVERVIEW_STATS[0], animated: animatedScans },
    { ...OVERVIEW_STATS[1], animated: animatedViewers },
    {
      ...OVERVIEW_STATS[2],
      animated: OVERVIEW_STATS[2].value as number,
    },
  ];

  return (
    <FlowShell>
      <section className="animate-fade-in-up">
        <div className="mb-8 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label mb-3 text-orange">Mission · 005 · Full analytics</p>
            <h1 className="display text-3xl sm:text-4xl">Campaign overview</h1>
            <p className="mt-2 max-w-2xl text-muted">
              {productName} over {city} — attribution from impression through pipeline,
              connected across your CRM, product, and billing stack.
            </p>
          </div>
          <LopusAttribution variant="light" />
        </div>

        {(txId || amount) && (
          <div className="mb-6 rounded-sm border border-ink bg-ink px-4 py-3 text-sm text-paper">
            <span className="text-orange">●</span> Payment confirmed
            {txId ? ` · ${txId}` : ""}
            {amount ? ` · ${amount}` : ""}. Drones cleared for launch.
          </div>
        )}

        <div className="grid gap-px border border-ink bg-ink sm:grid-cols-3">
          {animatedStats.map((stat) => (
            <div key={stat.label} className="bg-panel p-6">
              <p className="label text-muted">{stat.label}</p>
              <p className="display mt-2 text-xl tabular-nums text-ink sm:text-2xl">
                {formatStatValue(stat.value, stat.format, stat.animated)}
              </p>
              <p className="mt-1 text-xs text-orange">{stat.delta}</p>
            </div>
          ))}
        </div>

        <div className="mt-px border border-ink border-t-0 bg-panel p-7">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="label text-muted">Conversion attribution funnel</p>
            <LopusAttribution variant="light" />
          </div>
          <ul>
            {FUNNEL_STEPS.map((step, i) => (
              <li
                key={i}
                className="flex items-center justify-between border-b border-line py-3 last:border-0 last:pb-0"
              >
                <span className={step.accent ? "display text-lg text-orange" : "text-ink/80"}>
                  {step.label}
                </span>
                <span className="flex items-baseline gap-3">
                  {step.note && <span className="label text-muted">{step.note}</span>}
                  <span
                    className={
                      step.accent ? "display text-xl text-orange" : "font-mono text-sm"
                    }
                  >
                    {step.value}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <a
            href={LOPUS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${BTN} w-full`}
          >
            Open in Lopus →
          </a>
          <button
            type="button"
            onClick={() => {
              clearCampaignSession();
              router.push("/");
            }}
            className="inline-flex w-full items-center justify-center rounded-sm border border-line px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.16em] text-muted transition hover:border-ink hover:text-ink"
          >
            Start new campaign
          </button>
        </div>
      </section>
    </FlowShell>
  );
}
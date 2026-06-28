"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LandingHeroCanvas } from "./LandingHeroCanvas";
import { generateQRMatrix } from "@/lib/preview/qrMatrix";

const GLASS_CARD =
  "rounded-2xl border border-white/[0.08] bg-[#14161c]/90 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl";

function FlowLines() {
  return (
    <svg
      className="pointer-events-none absolute left-[8%] top-[18%] z-0 h-[42%] w-[38%] opacity-70"
      viewBox="0 0 420 280"
      fill="none"
      aria-hidden
    >
      <path
        d="M 60 140 C 120 80, 180 80, 240 120"
        stroke="#22d3ee"
        strokeWidth="1.5"
        strokeDasharray="4 6"
        className="landing-flow-path"
      />
      <path
        d="M 240 120 C 300 160, 340 100, 380 60"
        stroke="#22d3ee"
        strokeWidth="1.5"
        className="landing-flow-path landing-flow-path-delay"
      />
      <circle cx="60" cy="140" r="4" fill="#22d3ee" className="landing-flow-dot" />
      <circle cx="240" cy="120" r="4" fill="#22d3ee" className="landing-flow-dot landing-flow-dot-delay" />
      <circle cx="380" cy="60" r="4" fill="#22d3ee" className="landing-flow-dot" />
    </svg>
  );
}

function ScanTicker() {
  const [scans, setScans] = useState(12847);

  useEffect(() => {
    const id = setInterval(() => {
      setScans((n) => n + Math.floor(Math.random() * 7) + 1);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="tabular-nums text-cyan-300">
      {scans.toLocaleString()}
    </span>
  );
}

export default function LandingPage() {
  const [qrMatrix, setQrMatrix] = useState<boolean[][]>([]);

  useEffect(() => {
    let cancelled = false;
    generateQRMatrix("https://adastra.com").then((matrix) => {
      if (!cancelled) setQrMatrix(matrix);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="landing-grain relative h-screen w-screen overflow-hidden bg-[#08090d] text-white selection:bg-cyan-400/30">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(34,211,238,0.07),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_85%_70%,rgba(34,211,238,0.04),transparent_50%)]" />

      {/* Top ribbon */}
      <div className="relative z-20 flex h-8 items-center justify-end border-b border-white/[0.06] px-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/35">
          The sky is the new billboard ·{" "}
          <Link href="/preview" className="text-white/55 transition hover:text-cyan-300">
            Launch a takeover →
          </Link>
        </p>
      </div>

      {/* Nav */}
      <header className="relative z-20 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-[0_0_24px_rgba(34,211,238,0.35)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 2L4 8v8l8 6 8-6V8l-8-6z"
                stroke="black"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-[15px] font-semibold tracking-tight">Ad Astra</span>
        </div>

        <nav className="hidden items-center gap-7 text-[13px] text-white/45 md:flex">
          {["Product", "Pricing", "Our Team", "Blog", "Contact"].map((item) => (
            <button
              key={item}
              type="button"
              className="transition hover:text-white/80"
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[13px] text-white/70 transition hover:bg-white/[0.08] sm:inline-flex"
          >
            Sign In
          </button>
          <Link
            href="/preview"
            className="rounded-full bg-white px-4 py-2 text-[13px] font-medium text-black transition hover:bg-white/90"
          >
            Book Takeover
          </Link>
        </div>
      </header>

      <main className="relative z-10 h-[calc(100vh-5.5rem)] px-4 pb-4 md:px-6">
        <FlowLines />

        {/* Upper workflow cards */}
        <div className="absolute left-4 top-2 z-10 flex w-[min(92vw,520px)] flex-col gap-3 md:left-6 md:top-4">
          <div className={`${GLASS_CARD} landing-float p-4 md:p-5`}>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
              Book brand airspace
            </p>
            <div className="flex flex-wrap gap-2">
              <div className="min-w-[140px] flex-1 rounded-xl border border-white/[0.06] bg-black/30 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-cyan-500/20 text-[10px] font-bold text-cyan-300">
                    B
                  </span>
                  <span className="text-xs font-medium text-white/80">Brand</span>
                </div>
                <ul className="space-y-1 text-[11px] text-white/45">
                  <li>Campaign · Summer Drop</li>
                  <li>Destination · adastra.com/drop</li>
                  <li>Market · Downtown core</li>
                </ul>
              </div>
              <div className="min-w-[120px] flex-1 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] p-3">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-cyan-400 text-[10px] font-bold text-black">
                    ✦
                  </span>
                  <span className="text-xs font-medium text-cyan-200">Swarm</span>
                </div>
                <ul className="space-y-1 text-[11px] text-white/55">
                  <li>324 drones · 180m</li>
                  <li>29×29 QR grid</li>
                  <li>Launch · Golden hour</li>
                </ul>
              </div>
            </div>
          </div>

          <div className={`${GLASS_CARD} landing-float-slow hidden p-4 sm:block md:max-w-[280px] md:p-5`}>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
              Live scan stream
            </p>
            <div className="rounded-xl border border-white/[0.06] bg-black/35 p-3">
              <p className="text-[11px] text-white/50">
                <span className="text-cyan-400">@AdAstraBot</span> in gtm-alerts
              </p>
              <p className="mt-1 text-xs leading-relaxed text-white/75">
                <ScanTicker /> scans logged · QR visible from 2.1km
              </p>
            </div>
          </div>
        </div>

        {/* 3D hero panel */}
        <div className="absolute right-4 top-2 z-10 w-[min(46vw,520px)] md:right-6 md:top-4">
          <div className={`${GLASS_CARD} landing-float-reverse overflow-hidden`}>
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                Photorealistic preview
              </p>
              <span className="rounded-full bg-cyan-400/15 px-2 py-0.5 text-[10px] font-medium text-cyan-300">
                LIVE 3D
              </span>
            </div>
            <div className="relative aspect-[4/3] w-full bg-[#0c0e14]">
              <LandingHeroCanvas qrMatrix={qrMatrix} />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#14161c] via-transparent to-transparent opacity-60" />
            </div>
          </div>

          <div className={`${GLASS_CARD} landing-float mt-3 hidden p-4 lg:block`}>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
              Campaign timeline
            </p>
            <div className="space-y-3 border-l border-white/10 pl-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/30">T‑0 Launch</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded-full bg-cyan-400/20 px-2 py-0.5 text-[10px] font-medium text-cyan-300">
                    High reach
                  </span>
                  <p className="text-xs text-white/65">QR breaks skyline · press picks up</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/30">Hour 6</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/55">
                    Peak scans
                  </span>
                  <p className="text-xs text-white/65">Foot traffic converts to tracked clicks</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero copy */}
        <div className="absolute bottom-[4.5rem] left-4 z-10 max-w-xl md:left-6 md:bottom-20">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-[#f26522] text-[10px] font-bold text-white">
              Y
            </span>
            <span className="text-xs font-medium text-white/45">Built for GTM teams who think bigger</span>
          </div>

          <h1 className="text-[clamp(2rem,5vw,3.35rem)] font-semibold leading-[1.08] tracking-tight">
            Send your brand
            <br />
            to the{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-transparent">
              sky
            </span>
            .
          </h1>

          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/45">
            Book a drone swarm to paint a scannable QR over any skyline. Preview
            on photorealistic 3D cities, launch like a billboard, measure every
            scan like performance media.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/preview"
              className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Book Takeover
            </Link>
            <Link
              href="/preview"
              className="rounded-full border border-white/15 bg-white/[0.04] px-6 py-2.5 text-sm font-medium text-white/75 transition hover:bg-white/[0.08]"
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* Floating guide card */}
        <div className="absolute bottom-24 right-6 z-10 hidden w-52 md:block lg:bottom-28">
          <div className={`${GLASS_CARD} landing-float-slow p-4`}>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
              Playbook
            </p>
            <p className="mt-2 text-sm font-medium leading-snug text-white/85">
              Sky QR playbook for GTM launches
            </p>
            <Link
              href="/preview"
              className="mt-3 inline-flex text-xs font-medium text-cyan-300 transition hover:text-cyan-200"
            >
              Read guide →
            </Link>
          </div>
        </div>

        {/* Bottom prompt bar */}
        <div className="absolute bottom-4 left-1/2 z-20 w-[min(92vw,640px)] -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-full border border-white/[0.08] bg-[#12141a]/95 px-4 py-2.5 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-400/15 text-cyan-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7v1h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h1v-1a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 12 2z" />
              </svg>
            </span>
            <p className="flex-1 truncate text-[13px] text-white/40">
              Plan your takeover: How many drones for a 40m readable QR over SoMa?
            </p>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/50">
              ↑
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
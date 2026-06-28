/** Shared campaign analytics — 10M scans with proportional funnel metrics. */
export const TARGET_SCANS = 10_000_000;

const BASE_SCANS = 1_860;
const SCALE = TARGET_SCANS / BASE_SCANS;

export const CAMPAIGN_ANALYTICS = {
  scans: TARGET_SCANS,
  uniqueViewers: Math.round(1_214 * SCALE),
  droneImpressions: Math.round(12_400 * SCALE),
  landingVisits: Math.round(1_490 * SCALE),
  signups: Math.round(312 * SCALE),
  pipeline: Math.round(148_000 * SCALE),
  scanThroughPct: 6.2,
  scanRatePct: 65,
  costPerSignup: 7.69,
} as const;

export const LIVE_PANEL_UNIQUE = Math.round(TARGET_SCANS * (214 / 348));

export const SCAN_SERIES = [0, 3, 11, 28, 52, 89, 134, 178, 224, 268, 312, 348].map((v) =>
  Math.round((v / 348) * TARGET_SCANS),
);

export const FUNNEL_STEPS = [
  {
    label: "Drone impressions",
    value: CAMPAIGN_ANALYTICS.droneImpressions.toLocaleString(),
  },
  {
    label: "QR scans",
    value: CAMPAIGN_ANALYTICS.scans.toLocaleString(),
    note: "15.0%",
  },
  {
    label: "Landing visits",
    value: CAMPAIGN_ANALYTICS.landingVisits.toLocaleString(),
    note: "80.1%",
  },
  {
    label: "Signups",
    value: CAMPAIGN_ANALYTICS.signups.toLocaleString(),
    note: "20.9%",
  },
  {
    label: "Qualified pipeline",
    value: `$${CAMPAIGN_ANALYTICS.pipeline.toLocaleString()}`,
    accent: true as const,
  },
];

export const OVERVIEW_STATS = [
  {
    label: "Total scans",
    value: CAMPAIGN_ANALYTICS.scans,
    delta: "+18% vs. forecast",
    format: "number" as const,
  },
  {
    label: "Unique viewers",
    value: CAMPAIGN_ANALYTICS.uniqueViewers,
    delta: `${CAMPAIGN_ANALYTICS.scanRatePct}% scan rate`,
    format: "number" as const,
  },
  {
    label: "Cost per signup",
    value: CAMPAIGN_ANALYTICS.costPerSignup,
    delta: "2.4× below paid social",
    format: "currency" as const,
  },
];
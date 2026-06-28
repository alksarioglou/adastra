"use client";

const GLASS_PANEL =
  "border-l border-white/15 bg-white/[0.08] shadow-[-16px_0_48px_rgba(0,0,0,0.35)] backdrop-blur-2xl";

const BRAND_COLORS = [
  { label: "White", value: "#ffffff" },
  { label: "Cyan", value: "#22d3ee" },
  { label: "Violet", value: "#a78bfa" },
  { label: "Gold", value: "#fbbf24" },
  { label: "Rose", value: "#fb7185" },
];

export function CampaignDrawer({
  open,
  onClose,
  hour,
  onHourChange,
  hourLabel,
  destinationUrl,
  onDestinationUrlChange,
  message,
  onMessageChange,
  brandColor,
  onBrandColorChange,
}: {
  open: boolean;
  onClose: () => void;
  hour: number;
  onHourChange: (h: number) => void;
  hourLabel: string;
  destinationUrl: string;
  onDestinationUrlChange: (url: string) => void;
  message: string;
  onMessageChange: (msg: string) => void;
  brandColor: string;
  onBrandColorChange: (color: string) => void;
}) {
  return (
    <>
      <div
        className={`pointer-events-auto fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={`pointer-events-auto fixed right-0 top-0 z-40 flex h-full w-full max-w-sm flex-col transition-transform duration-300 ease-out ${GLASS_PANEL} ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
              Campaign
            </p>
            <h2 className="text-lg font-semibold text-white">Customize</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <label className="mb-5 block">
            <span className="mb-2 flex justify-between text-xs text-white/50">
              <span>Takeover Time</span>
              <span className="font-medium text-white/80">{hourLabel}</span>
            </span>
            <input
              type="range"
              min={0}
              max={23}
              value={hour}
              onChange={(e) => onHourChange(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <div className="mt-1 flex justify-between text-[10px] text-white/30">
              <span>Midnight</span>
              <span>Noon</span>
            </div>
          </label>

          <label className="mb-5 block">
            <span className="mb-2 block text-xs text-white/50">
              Destination URL
            </span>
            <input
              type="url"
              value={destinationUrl}
              onChange={(e) => onDestinationUrlChange(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:bg-white/10"
              placeholder="https://yourcompany.com"
            />
          </label>

          <label className="mb-5 block">
            <span className="mb-2 block text-xs text-white/50">Sky Message</span>
            <input
              type="text"
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              maxLength={24}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:bg-white/10"
              placeholder="Ad Astra"
            />
          </label>

          <div>
            <span className="mb-3 block text-xs text-white/50">Drone Color</span>
            <div className="flex gap-3">
              {BRAND_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => onBrandColorChange(c.value)}
                  className={`relative h-10 w-10 rounded-full border-2 transition ${
                    brandColor === c.value
                      ? "border-white scale-110 shadow-[0_0_16px_rgba(255,255,255,0.4)]"
                      : "border-white/20 hover:border-white/50"
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
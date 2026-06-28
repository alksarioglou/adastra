"use client";

import Link from "next/link";
import { AdAstraLogo } from "@/components/AdAstraLogo";
import { AuthControls } from "@/components/AuthControls";
import { clearCampaignSession } from "@/lib/campaignSession";

export function FlowShell({
  children,
  immersive = false,
  align = "center",
  className = "",
}: {
  children: React.ReactNode;
  immersive?: boolean;
  align?: "center" | "left";
  className?: string;
}) {
  const contentWidth =
    align === "left"
      ? "ml-5 w-full max-w-3xl px-5 sm:ml-8 lg:ml-12"
      : "mx-auto w-full max-w-3xl px-5";

  return (
    <div
      className={`relative z-10 flex min-h-screen w-full flex-col ${
        immersive ? "" : "pb-8"
      } ${className}`}
    >
      {!immersive && (
        <header className="pointer-events-auto mb-10 w-full border-b border-line/80 bg-paper/95 backdrop-blur-sm">
          <div
            className={`flex w-full items-center justify-between gap-6 py-4 ${
              align === "left"
                ? "px-5 sm:px-8 lg:px-12"
                : "mx-auto max-w-3xl px-5"
            }`}
          >
            <Link
              href="/"
              onClick={clearCampaignSession}
              className="flex shrink-0 items-center"
            >
              <AdAstraLogo showWordmark />
            </Link>
            <div className="ml-auto flex shrink-0 items-center gap-4">
              <span className="label hidden text-right text-ink/65 sm:inline">
                Take your brand to the sky
              </span>
              <AuthControls />
            </div>
          </div>
        </header>
      )}
      <div className={`${immersive ? "w-full" : `${contentWidth} flex flex-1 flex-col`}`}>
        {children}
      </div>
    </div>
  );
}

export function FlowError({ message }: { message: string }) {
  return (
    <div className="mb-6 rounded-sm border border-orange/40 bg-orange/10 px-4 py-3 text-sm text-ink">
      {message}
    </div>
  );
}
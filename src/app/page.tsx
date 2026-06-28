import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#020818] text-white">
      <header className="flex items-center justify-between px-8 py-6">
        <span className="text-lg font-semibold tracking-tight">StellarQR</span>
        <Link
          href="/preview"
          className="rounded-full bg-white/10 px-4 py-2 text-sm transition hover:bg-white/20"
        >
          Open Preview
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-8 pb-24 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-cyan-400/80">
          Drone Takeover · Bookable GTM
        </p>
        <h1 className="max-w-2xl text-5xl font-semibold leading-tight tracking-tight md:text-6xl">
          Put your brand in the sky.
          <span className="block text-white/50">Measure every scan.</span>
        </h1>
        <p className="mt-6 max-w-lg text-lg text-white/50">
          Book a swarm of drones to form a scannable QR code over any city
          skyline — preview it on photorealistic 3D cities, then track every
          scan like a digital ad channel.
        </p>
        <Link
          href="/preview"
          className="mt-10 rounded-full bg-cyan-400 px-8 py-3.5 text-sm font-medium text-black transition hover:bg-cyan-300"
        >
          Preview Your Takeover
        </Link>
      </main>
    </div>
  );
}
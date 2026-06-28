# YC Hackathon

Next.js app with [Convex](https://convex.dev) as the real-time backend.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind CSS)
- **Convex** (database, queries, real-time sync)

## Getting Started

Install dependencies:

```bash
npm install
```

Start the dev servers (Next.js + Convex run in parallel):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

On first setup, Convex creates a `.env.local` with your deployment URL. To seed sample tasks:

```bash
npx convex import --table tasks sampleData.jsonl
```

## Project Structure

```
convex/           # Convex backend (schema, queries, mutations)
src/app/          # Next.js App Router pages
src/components/   # React components (ConvexClientProvider)
```

## Convex

- Backend functions live in `convex/`
- Run `npx convex dev` to sync functions and generate types
- Run `npx convex dashboard` to open the Convex dashboard

For production, link a Convex cloud project with `npx convex login` and deploy with `npx convex deploy`.

## Deploy

Deploy the Next.js frontend to [Vercel](https://vercel.com). Set `NEXT_PUBLIC_CONVEX_URL` in your Vercel environment variables to your Convex deployment URL.
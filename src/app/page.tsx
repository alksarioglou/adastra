"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const tasks = useQuery(api.tasks.get);

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <main className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-zinc-500">
          YC Hackathon
        </p>
        <h1 className="mb-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
          Next.js + Convex
        </h1>
        <p className="mb-8 text-zinc-600 dark:text-zinc-400">
          Real-time data from your Convex backend.
        </p>

        {tasks === undefined ? (
          <p className="text-zinc-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-zinc-500">
            No tasks yet. Run{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-900">
              npx convex import --table tasks sampleData.jsonl
            </code>{" "}
            to seed sample data.
          </p>
        ) : (
          <ul className="space-y-3">
            {tasks.map(({ _id, text, isCompleted }) => (
              <li
                key={_id}
                className="flex items-center gap-3 rounded-lg border border-zinc-200 px-4 py-3 dark:border-zinc-800"
              >
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                    isCompleted ? "bg-emerald-500" : "bg-amber-400"
                  }`}
                />
                <span
                  className={
                    isCompleted
                      ? "text-zinc-500 line-through"
                      : "text-zinc-900 dark:text-zinc-100"
                  }
                >
                  {text}
                </span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
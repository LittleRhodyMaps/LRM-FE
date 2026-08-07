"use client";

import { useState } from "react";

const MAPS = [
  {
    id: 3,
    issue: 3,
    date: "Aug 7, 2026",
    title: "The Burnside Grid",
    region: "Portland, OR",
    description: "Street-level look at the irregular blocks east of the Burnside Bridge.",
  },
  {
    id: 2,
    issue: 2,
    date: "Aug 4, 2026",
    title: "Old Town Triangle",
    region: "Portland, OR",
    description: "How the rail lines carved a wedge through the original platted grid.",
  },
  {
    id: 1,
    issue: 1,
    date: "Aug 1, 2026",
    title: "First Issue",
    region: "Portland, OR",
    description: "The launch map — downtown core arterials.",
  },
];

export default function Home() {
  const [index, setIndex] = useState(0);
  const map = MAPS[index];
  const hasPrev = index < MAPS.length - 1;
  const hasNext = index > 0;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-2xl px-6 pt-8 pb-4 text-center">
        <h1 className="text-sm font-bold tracking-[0.2em] uppercase text-zinc-900">
          Little Rhody Maps
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          No.&nbsp;{map.issue}&nbsp;·&nbsp;{map.date}
        </p>
      </header>

      <div className="w-full max-w-2xl px-6">
        <hr className="border-zinc-200" />
      </div>

      {/* Map area */}
      <main className="w-full max-w-2xl px-6 mt-6 flex flex-col gap-5">
        <div className="w-full aspect-[4/3] bg-zinc-100 rounded-sm border border-zinc-200 flex items-center justify-center text-zinc-400 text-sm">
          {/* Interactive map will mount here */}
          interactive map — {map.title}
        </div>

        {/* Map meta */}
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">{map.title}</h2>
          <p className="text-sm text-zinc-500 mt-0.5">{map.region}</p>
          <p className="text-sm text-zinc-600 mt-2 leading-relaxed">
            {map.description}
          </p>
        </div>

        {/* Prev / Next */}
        <div className="flex justify-between items-center py-4 border-t border-zinc-100">
          <button
            onClick={() => setIndex((i) => i + 1)}
            disabled={!hasPrev}
            className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
          >
            <span>←</span>
            <span>Previous</span>
          </button>

          <span className="text-xs text-zinc-400">
            {MAPS.length - index} / {MAPS.length}
          </span>

          <button
            onClick={() => setIndex((i) => i - 1)}
            disabled={!hasNext}
            className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <span>→</span>
          </button>
        </div>
      </main>
    </div>
  );
}

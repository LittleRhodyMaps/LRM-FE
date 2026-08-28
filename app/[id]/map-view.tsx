"use client";

import Link from "next/link";
import { MAP_REGISTRY } from "@/components/maps/registry";
import type MAPS from "@/content/maps.json";

type MapEntry = (typeof MAPS)[number];

export default function MapView({
  map,
  index,
  total,
  prevMap,
  nextMap,
}: {
  map: MapEntry;
  index: number;
  total: number;
  prevMap: MapEntry | null;
  nextMap: MapEntry | null;
}) {
  const MapComponent = MAP_REGISTRY[map.component];

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
        <div className="w-full aspect-[4/3] bg-zinc-100 rounded-sm border border-zinc-200 overflow-hidden">
          {MapComponent ? (
            <MapComponent key={map.id} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">
              interactive map — {map.title}
            </div>
          )}
        </div>

        {/* Map meta */}
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">{map.title}</h2>
          <p className="text-sm text-zinc-600 mt-2 leading-relaxed">
            {map.description}
          </p>
          {map.sources && map.sources.length > 0 && (
            <ul className="mt-3 space-y-1">
              {map.sources.map((source, i) => (
                <li key={i} className="text-xs text-zinc-400 leading-relaxed">
                  {source}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Prev / Next */}
        <div className="flex justify-between items-center py-4 border-t border-zinc-100">
          {prevMap ? (
            <Link
              href={`/${prevMap.route}`}
              className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <span>←</span>
              <span>Previous</span>
            </Link>
          ) : (
            <span className="flex items-center gap-1.5 text-sm text-zinc-500 opacity-25 cursor-not-allowed">
              <span>←</span>
              <span>Previous</span>
            </span>
          )}

          <span className="text-xs text-zinc-400">
            {index + 1} / {total}
          </span>

          {nextMap ? (
            <Link
              href={`/${nextMap.route}`}
              className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <span>Next</span>
              <span>→</span>
            </Link>
          ) : (
            <span className="flex items-center gap-1.5 text-sm text-zinc-500 opacity-25 cursor-not-allowed">
              <span>Next</span>
              <span>→</span>
            </span>
          )}
        </div>
      </main>
    </div>
  );
}

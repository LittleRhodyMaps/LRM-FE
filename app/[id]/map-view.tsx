"use client";

import Link from "next/link";
import { MAP_REGISTRY } from "@/components/maps/registry";
import type MAPS from "@/content/maps.json";

type MapEntry = (typeof MAPS)[number];

export default function MapView({
  map,
  descriptionHtml,
  index,
  total,
  prevMap,
  nextMap,
}: {
  map: MapEntry;
  descriptionHtml: string;
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
        {/* Prev / Next */}
        <div className="flex justify-between items-center">
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
        {descriptionHtml && (
          <div
            className="prose prose-sm prose-zinc max-w-none leading-relaxed"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        )}
      </main>
    </div>
  );
}

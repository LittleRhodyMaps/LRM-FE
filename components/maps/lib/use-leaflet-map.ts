"use client";

import { useEffect, useRef, type RefObject } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet's default marker icon URLs assume a classic asset pipeline that
// doesn't exist under Next.js. Point them at harmless placeholders once,
// module-wide, rather than re-patching the prototype on every mount.
let iconFixApplied = false;
function ensureDefaultIconFix() {
  if (iconFixApplied) return;
  iconFixApplied = true;
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com",
    iconUrl: "https://unpkg.com",
    shadowUrl: "https://unpkg.com",
  });
}

// Zoom levels in the map configs are tuned by eye against a container this
// wide. Narrower containers (phones, sidebars) get a proportionally lower
// zoom so the same geographic extent stays visible instead of being cropped.
const REFERENCE_WIDTH_PX = 800;

export interface UseLeafletMapOptions {
  center: L.LatLngExpression;
  zoom: number;
  mapOptions?: L.MapOptions;
  /**
   * Called once the map instance is created. Add layers/controls here.
   * `isCancelled` reports whether the map has since been torn down (e.g.
   * React Strict Mode's double-effect) — check it before applying the
   * result of any async work (like a GeoJSON fetch).
   * May return a cleanup function, run before the map itself is removed.
   */
  onReady: (map: L.Map, isCancelled: () => boolean) => void | (() => void);
}

export function useLeafletMap({
  center,
  zoom,
  mapOptions,
  onReady,
}: UseLeafletMapOptions): RefObject<HTMLDivElement | null> {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapInstanceRef.current) return;

    ensureDefaultIconFix();

    const containerWidth = containerRef.current.clientWidth || REFERENCE_WIDTH_PX;
    const responsiveZoom = zoom + Math.log2(containerWidth / REFERENCE_WIDTH_PX);

    const map = L.map(containerRef.current, { zoomSnap: 0.25, ...mapOptions }).setView(center, responsiveZoom);
    mapInstanceRef.current = map;
    L.control.scale().addTo(map);

    let cancelled = false;
    const onReadyCleanup = onReady(map, () => cancelled);

    return () => {
      cancelled = true;
      onReadyCleanup?.();
      if (mapInstanceRef.current === map) {
        map.remove();
        mapInstanceRef.current = null;
      }
    };
    // Intentionally run once per mount — center/zoom/onReady are treated as
    // the map's initial configuration, matching how L.map() itself works.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return containerRef;
}

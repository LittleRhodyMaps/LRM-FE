import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// Leaflet needs `window`, so every map component is loaded client-only.
// Register each new map component here, keyed by its `component` value in
// content/maps.json.
export const MAP_REGISTRY: Record<string, ComponentType> = {
  RITownPopulation2024: dynamic(() => import("./ri-town-population-map"), {
    ssr: false,
    loading: () => <p style={{ padding: 20 }}>Loading map assets...</p>,
  }),
  RIBackground: dynamic(() => import("./ri-background-map"), {
    ssr: false,
    loading: () => <p style={{ padding: 20 }}>Loading map assets...</p>,
  }),
};

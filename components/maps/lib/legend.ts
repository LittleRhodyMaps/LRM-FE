import type L from "leaflet";
import { LeafletLegend } from "leaflet-d3-color-legend";

export interface LegendOptions {
  label: string;
  position?: "topleft" | "topright" | "bottomleft" | "bottomright";
  nTicks?: number;
  width?: number;
  height?: number;
}

/**
 * A d3-driven color-scale legend, with a bold label prepended above it (done
 * as our own DOM element rather than the library's built-in `label` option,
 * so it can be styled with plain CSS instead of fighting the legend's baked-in
 * SVG layout).
 */
export function createLegend(
  scale: (value: number) => string,
  { label, position = "bottomright", nTicks = 2, width = 200, height = 25 }: LegendOptions
) {
  const legend = new LeafletLegend(scale as any, { position, nTicks, width, height });

  const container = legend.getContainer();
  if (container) {
    const labelEl = document.createElement("div");
    labelEl.textContent = label;
    labelEl.style.fontWeight = "bold";
    labelEl.style.fontSize = "10px";
    labelEl.style.paddingLeft = "8px";
    container.prepend(labelEl);

    // The library's svg is sized too tightly for its own tick number labels,
    // so they spill past the bottom edge of the svg (and the legend's white
    // background) instead of sitting on top of it. Pad the container so the
    // background extends far enough to cover them.
    container.style.paddingBottom = "8px";
  }

  return legend;
}

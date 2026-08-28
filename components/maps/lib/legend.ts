import type L from "leaflet";
import { LeafletLegend } from "leaflet-d3-color-legend";

export interface LegendOptions {
  label: string;
  position?: "topleft" | "topright" | "bottomleft" | "bottomright";
  nTicks?: number;
  width?: number;
  height?: number;
}

// Minimum horizontal gap (px) required between adjacent tick labels before
// one is hidden as overlapping.
const MIN_TICK_LABEL_GAP = 4;

/**
 * The library always renders a label at both domain endpoints in addition to
 * whatever "nice" round-number ticks it picks, so a domain like [0, 700000]
 * ends up with ticks at 0, 500000, and 700000 - the last two sit close
 * enough together to overlap. Walk the rendered tick labels left to right,
 * keeping the first and last (the domain's min/max) and dropping any
 * in-between label whose box overlaps its neighbor.
 */
function hideOverlappingTicks(container: HTMLElement) {
  const texts = Array.from(container.querySelectorAll("svg text:not(.label)")) as SVGTextElement[];
  if (texts.length < 2) return;

  let lastKept = texts[0];
  for (let i = 1; i < texts.length; i++) {
    const text = texts[i];
    const isLast = i === texts.length - 1;
    const overlaps = text.getBBox().x < lastKept.getBBox().x + lastKept.getBBox().width + MIN_TICK_LABEL_GAP;

    if (!overlaps) {
      lastKept = text;
    } else if (isLast) {
      lastKept.style.display = "none";
      lastKept = text;
    } else {
      text.style.display = "none";
    }
  }
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

  // `getContainer()` only returns something once `onAdd` has run, which
  // happens inside `addTo(map)` - called by the caller *after* this
  // function returns. Wrapping `onAdd` (rather than reading the container
  // here) guarantees our tweaks run every time the control is actually
  // added to the map.
  const originalOnAdd = legend.onAdd.bind(legend);
  legend.onAdd = (map: L.Map) => {
    const container: HTMLElement = originalOnAdd(map);

    const labelEl = document.createElement("div");
    labelEl.textContent = label;
    labelEl.style.fontWeight = "bold";
    labelEl.style.fontSize = "10px";
    labelEl.style.paddingLeft = "8px";
    container.prepend(labelEl);

    // The library's svg is sized too tightly for its own tick number labels,
    // so they spill past the bottom edge of the svg (and the legend's blue
    // background) instead of sitting on top of it. Pad the container so the
    // background extends far enough to cover them.
    container.style.paddingBottom = "10px";

    // Tick label widths are only known once laid out in the DOM, which
    // happens right after `onAdd` returns.
    requestAnimationFrame(() => hideOverlappingTicks(container));

    return container;
  };

  return legend;
}

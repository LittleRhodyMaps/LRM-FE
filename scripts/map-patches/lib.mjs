// Shared helpers for per-map patch files in scripts/map-patches/.
// Each patch operates on the raw Folium/Leaflet export HTML for one map.

export function setLegendPosition(html, position) {
  return html.replace(
    /(color_map_\w+\.legend = L\.control\(\{position: ')\w+('\}\);)/g,
    `$1${position}$2`
  );
}

export function setLegendWidth(html, width) {
  html = html.replace(
    /(color_map_\w+\.x = d3\.scale\.linear\(\)\s*\.domain\(\[[^\]]*\]\)\s*\.range\(\[0, )\d+( - 50\]\);)/g,
    `$1${width}$2`
  );
  html = html.replace(
    /(color_map_\w+\.svg = d3\.select\(".legend.leaflet-control"\)\.append\("svg"\)\s*\.attr\("id", 'legend'\)\s*\.attr\("width", )\d+(\))/g,
    `$1${width}$2`
  );
  return html;
}

export function setWhiteBackground(html) {
  const styleBlock = "<style>.leaflet-container { background: #ffffff; }</style>";
  if (html.includes(styleBlock)) return html;
  return html.replace("</head>", `${styleBlock}\n</head>`);
}

// The export sets a fixed zoom + center, then immediately overrides it with
// fitBounds(), which recomputes zoom from the container's size at that
// instant. Stripping it leaves the map at the fixed zoom it was configured
// with (see app/api/map-proxy/route.ts for the original runtime version).
export function stripFitBounds(html) {
  return html.replace(/\w+\.fitBounds\(\s*\[\[[\s\S]*?\]\]\s*,\s*\{\}\s*\)\s*;/, "");
}

// fitBounds() runs synchronously at script-load time, before the iframe's
// container has settled into its final size, so it computes zoom off a
// wrong/zero size. Deferring it to the window "load" event (and forcing a
// resize check first) keeps fitBounds' dynamic behavior but with a size
// that's actually correct.
export function deferFitBounds(html) {
  return html.replace(
    /(\w+)\.fitBounds\(\s*\[\[[\s\S]*?\]\]\s*,\s*\{\}\s*\)\s*;/,
    (statement, mapVar) =>
      `window.addEventListener("load", function () {\n` +
      `            ${mapVar}.invalidateSize();\n` +
      `            ${statement}\n` +
      `        });`
  );
}

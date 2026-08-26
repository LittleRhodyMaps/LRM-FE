"use client";

import { scaleSequential } from "d3-scale";
import { interpolateGnBu } from "d3-scale-chromatic";
import { useLeafletMap } from "./lib/use-leaflet-map";
import { createInfoControl } from "./lib/info-control";
import { addChoroplethLayer } from "./lib/choropleth-layer";
import { createLegend } from "./lib/legend";
import { CONFIG } from "./utils";

interface TownProperties {
  NAMELSAD: string;
  "Total Population Estimate": number;
}

const GEOJSON_URL = "/data/RIPopulationEstimate-county-subdivision-2024-acs5.geojson";
const VALUE_FIELD: keyof TownProperties = "Total Population Estimate";
const SCALE = scaleSequential<string>().domain([0, 200000]).interpolator(interpolateGnBu).clamp(true);

function renderTownInfo(props?: TownProperties) {
  const heading = "<h4>2024 Population Estimate</h4>";
  if (!props) return heading + "Hover over a town";
  const townName = props.NAMELSAD.substring(0, props.NAMELSAD.lastIndexOf(" "));
  return heading + `<b>${townName}</b><br />${props["Total Population Estimate"]} people`;
}

export default function RITownPopulationMap() {
  const containerRef = useLeafletMap({
    center: CONFIG.RI_COORDS,
    zoom: CONFIG.RI_ZOOM,
    onReady(map, isCancelled) {
      const info = createInfoControl<TownProperties>({ render: renderTownInfo });
      info.addTo(map);

      addChoroplethLayer<TownProperties>(
        map,
        GEOJSON_URL,
        {
          valueField: VALUE_FIELD,
          scale: SCALE,
          onFeatureHover: (props) => info.update(props),
          onFeatureReset: () => info.update(),
        },
        isCancelled
      ).catch((error) => console.error("Error loading the GeoJSON file:", error));

      createLegend(map, SCALE, { label: "Population Estimate 2024" });
    },
  });

  return <div ref={containerRef} style={{ height: "100%", width: "100%" }} />;
}

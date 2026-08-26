"use client";
import { useLeafletMap } from "./lib/use-leaflet-map";
import L from "leaflet"
import { CONFIG } from "./utils";
import { addChoroplethLayer } from "./lib/choropleth-layer";
import { createLegend } from "./lib/legend";
import { scaleSequential } from "d3-scale";
import { interpolateGnBu } from "d3-scale-chromatic";

interface TownProperties {
    NAMELSAD: string;
    "Total Population Estimate": number;
  }

const GEOJSON_URL = "/data/RIPopulationEstimate-county-subdivision-2024-acs5.geojson";
const VALUE_FIELD: keyof TownProperties = "Total Population Estimate";
const SCALE = scaleSequential<string>().domain([0, 200000]).interpolator(interpolateGnBu).clamp(true);

export default function RIBackground() {
  const containerRef = useLeafletMap({
    center: CONFIG.RI_COORDS,
    zoom: CONFIG.RI_ZOOM,
    onReady(map, isCancelled) {
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        addChoroplethLayer<TownProperties>(
            map,
            GEOJSON_URL,
            {
              valueField: VALUE_FIELD,
              scale: SCALE,
            },
            isCancelled
          ).catch((error) => console.error("Error loading the GeoJSON file:", error));

        createLegend(map, SCALE, { label: "Population Estimate 2024" });
    },
  });

  return <div ref={containerRef} style={{ height: "100%", width: "100%" }} />;
}

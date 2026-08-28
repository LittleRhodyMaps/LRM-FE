"use client";

import { scaleSequential } from "d3-scale";
import { interpolateGnBu } from "d3-scale-chromatic";
import { useLeafletMap } from "./lib/use-leaflet-map";
import { createInfoControl } from "./lib/info-control";
import { addChoroplethLayer } from "./lib/choropleth-layer";
import { createLegend } from "./lib/legend";
import { CONFIG } from "./utils";
import L from "leaflet";

interface GeoProperties {
    NAMELSAD: string;
    "Total Population Estimate": number;
    GEOID: string;
}

const VALUE_FIELD: keyof GeoProperties = "Total Population Estimate";
const GEOS = [
    {
        geoName: 'state',
        geoJsonPath: '/data/RIPopulationEstimate-state-2024-acs5.geojson',
        scaleMax: 1200000
    },
    {
        geoName: 'county',
        geoJsonPath: '/data/RIPopulationEstimate-county-2024-acs5.geojson',
        scaleMax: 700000
    },
    {
        geoName: 'town',
        geoJsonPath: '/data/RIPopulationEstimate-county-subdivision-2024-acs5.geojson',
        scaleMax: 200000
    },
    {
        geoName: 'tract',
        geoJsonPath: '/data/RIPopulationEstimate-tract-2024-acs5.geojson',
        scaleMax: 10000
    },
    {
        geoName: 'block group',
        geoJsonPath: '/data/RIPopulationEstimate-block-group-2024-acs5.geojson',
        scaleMax: 4000
    },
]

const DEFAULT_BASE_LAYER = "town";


function renderGeoInfo(props?: GeoProperties) {
    const heading = "<h4>2024 Population Estimate</h4>";
    if (!props) return heading + "Hover over a location";
    var name;
    if (props.GEOID.length === 2) {
        name = "Rhode Island";
    }
    else if (props.GEOID.length === 5) {
        name = props.NAMELSAD;
    }
    else if (props.GEOID.length === 10) {
        name = props.NAMELSAD.substring(0, props.NAMELSAD.lastIndexOf(" "));
    }
    else if (props.GEOID.length === 11) {
        name = "Tract " + props.GEOID;
    }
    else if (props.GEOID.length === 12) {
        name = "Block Group " + props.GEOID;
    }

    return heading + `<b>${name}</b><br />${props["Total Population Estimate"].toLocaleString()} people`;
}


export default function RIAllGeosPopulationMap() {
    const containerRef = useLeafletMap({
        center: CONFIG.RI_COORDS,
        zoom: CONFIG.RI_ZOOM,
        onReady(map, isCancelled) {
            var layerGroups: Record<string, L.LayerGroup> = {}
            var controlGroups: Record<string, Array<L.Control>>= {}
            for (const geo of GEOS) {
                var geoGroup = L.layerGroup()
                const info = createInfoControl<GeoProperties>({ render: renderGeoInfo });
                const scale = scaleSequential<string>().domain([0, geo.scaleMax]).interpolator(interpolateGnBu).clamp(true)
                var geoLayer = addChoroplethLayer<GeoProperties>(
                    map,
                    geo.geoJsonPath,
                    {
                        valueField: VALUE_FIELD,
                        scale: scale,
                        onFeatureHover: (props) => info.update(props),
                        onFeatureReset: () => info.update(),
                    },
                    isCancelled,
                    geoGroup
                ).catch((error) => console.error("Error loading the GeoJSON file:", error));

                var legend = createLegend(scale, { label: "Population Estimate 2024" });
                layerGroups[geo.geoName] = geoGroup
                controlGroups[geo.geoName] = [legend, info]
            }
            L.control.layers(layerGroups).addTo(map);
            layerGroups[DEFAULT_BASE_LAYER].addTo(map);
            for (const control of controlGroups[DEFAULT_BASE_LAYER]) {
                control.addTo(map);
            }
            map.on('baselayerchange', function (eventLayer) {
                console.log(eventLayer)
                for (const geo of GEOS) {
                    console.log(geo.geoName);
                    if (eventLayer.name === geo.geoName) {
                        //layerGroups[geo.geoName].addTo(map)
                        for (const control of controlGroups[geo.geoName]) {
                            control.addTo(map);
                        }
                    }
                    else {
                        //map.removeLayer(layerGroups[geo.geoName])
                        for (const control of controlGroups[geo.geoName]) {
                            map.removeControl(control);
                        }
                    }
                }
            });

        },
    });

    return <div ref={containerRef} style={{ height: "100%", width: "100%" }} />;
}

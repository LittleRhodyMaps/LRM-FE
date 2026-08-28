import L from "leaflet";

export interface ChoroplethLayerOptions<P> {
  /** Property key whose value drives the fill color via `scale`. */
  valueField: keyof P & string;
  scale: (value: number) => string;
  styleOverrides?: Partial<L.PathOptions>;
  onFeatureHover?: (props: P) => void;
  onFeatureReset?: () => void;
}

/**
 * Fetches a GeoJSON file and renders it as a hover-highlightable choropleth
 * layer: fill color per feature from `scale(properties[valueField])`, with
 * highlight-on-hover and safety nets for missed mouseout events (fast
 * pointer movement between polygons, or the cursor leaving the map
 * container entirely).
 */
export async function addChoroplethLayer<P>(
  map: L.Map,
  geojsonUrl: string,
  { valueField, scale, styleOverrides, onFeatureHover, onFeatureReset }: ChoroplethLayerOptions<P>,
  isCancelled: () => boolean,
  layerGroup: L.LayerGroup | undefined = undefined
): Promise<L.GeoJSON | null> {
  const response = await fetch(geojsonUrl);
  const data = await response.json();

  if (isCancelled()) return null;

  let highlighted: L.Layer | null = null;

  function style(feature?: GeoJSON.Feature): L.PathOptions {
    const value = (feature?.properties as P)[valueField] as unknown as number;
    return {
      fillColor: scale(value),
      weight: 2,
      opacity: 1,
      color: "black",
      fillOpacity: 0.7,
      ...styleOverrides,
    };
  }

  function highlightFeature(e: L.LeafletMouseEvent) {
    const layer = e.target as L.Path & { feature: GeoJSON.Feature };

    if (highlighted && highlighted !== layer) {
      geojson.resetStyle(highlighted as L.Path);
    }
    highlighted = layer;

    layer.setStyle({ weight: 5, color: "#666", dashArray: "", fillOpacity: 0.7 });
    layer.bringToFront();
    onFeatureHover?.(layer.feature.properties as P);
  }

  function resetHighlight(e: L.LeafletMouseEvent) {
    geojson.resetStyle(e.target as L.Path);
    if (highlighted === e.target) highlighted = null;
    onFeatureReset?.();
  }

  const geojson = L.geoJSON(data, {
    style,
    onEachFeature: (_feature, layer) => {
      layer.on({ mouseover: highlightFeature, mouseout: resetHighlight });
    },
  })

  layerGroup?.addLayer(geojson)

  map.on("mouseout", () => {
    if (highlighted) {
      geojson.resetStyle(highlighted as L.Path);
      highlighted = null;
      onFeatureReset?.();
    }
  });



  return geojson;
}

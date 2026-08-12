import {
  setLegendPosition,
  setLegendWidth,
  setWhiteBackground,
  deferFitBounds,
} from "./lib.mjs";

export default function patch(html) {
  html = setLegendPosition(html, "bottomleft");
  html = setLegendWidth(html, 200);
  html = setWhiteBackground(html);
  html = deferFitBounds(html);
  return html;
}

import L from "leaflet";

export interface InfoControlOptions<P> {
  /** Renders the panel's inner HTML. Called with no properties on hover-out. */
  render: (props?: P) => string;
  position?: L.ControlPosition;
}

type InfoControl<P> = L.Control & { update: (props?: P) => void };

/**
 * A hover-info panel: an L.Control that shows `render(props)` for the
 * feature currently under the pointer, and `render(undefined)` otherwise.
 */
// @types/leaflet only types L.control's namespaced factories (zoom, scale,
// etc), not the plain `L.control(options)` form used to build a custom
// control — hence the cast.
const controlFactory = L.control as unknown as (options?: { position?: L.ControlPosition }) => L.Control;

export function createInfoControl<P>({ render, position = "topright" }: InfoControlOptions<P>): InfoControl<P> {
  const control = controlFactory({ position }) as InfoControl<P> & { _div?: HTMLDivElement };

  control.onAdd = function () {
    this._div = L.DomUtil.create("div", "info");
    this.update();
    return this._div;
  };

  control.update = function (props?: P) {
    if (this._div) this._div.innerHTML = render(props);
  };

  return control;
}

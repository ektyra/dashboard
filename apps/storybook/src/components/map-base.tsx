import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { ReactNode } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import type { MapContainerProps } from "react-leaflet";
import { useDocumentTheme } from "../lib/use-document-theme";

/**
 * Do not import this file from a page directly: Leaflet needs the browser, so
 * load it with `lazy()` inside a `MapFrame`. See the map demos.
 */

export type TileStyle = "themed" | "plain";

/** A drop-shaped pin in the brand color (styled in styles.css). */
export const pinIcon = (active = false) =>
  L.divIcon({
    className: active ? "map-pin is-active" : "map-pin",
    html: "<span></span>",
    iconSize: [28, 36],
    iconAnchor: [14, 34],
    popupAnchor: [0, -30],
  });

type ThemedMapProps = Omit<MapContainerProps, "children" | "className"> & {
  /**
   * `themed` darkens the map in dark mode. `plain` always shows the standard
   * OpenStreetMap look.
   */
  tiles?: TileStyle;
  children?: ReactNode;
};

/**
 * A map on OpenStreetMap tiles, which need no account. In dark mode the tiles are
 * darkened with a CSS filter (see `.map-dark` in styles.css). The tiles are fetched
 * by the visitor's browser straight from OpenStreetMap, which is fine for an admin
 * tool. For a public site with heavy traffic, use a tile provider you have an
 * account with (MapTiler, Stadia, Mapbox) and follow OpenStreetMap's tile usage policy.
 */
export function ThemedMap({ tiles = "themed", children, ...props }: ThemedMapProps) {
  const resolvedTheme = useDocumentTheme();
  const dark = tiles === "themed" && resolvedTheme === "dark";

  return (
    <MapContainer className={dark ? "map-dark size-full" : "size-full"} {...props}>
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={19}
      />
      {children}
    </MapContainer>
  );
}

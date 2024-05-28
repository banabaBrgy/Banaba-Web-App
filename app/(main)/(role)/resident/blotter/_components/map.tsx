import React, { useEffect, useState } from "react";
import {
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { FullscreenControl } from "react-leaflet-fullscreen";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import "react-leaflet-fullscreen/styles.css";
/* import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css"; */

delete (L.Icon as any).Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export function Map() {
  const [position, setPosition] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setPosition({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  return (
    <div className="mt-4">
      {position.lat && position.lng && (
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={15}
          scrollWheelZoom={false}
          markerZoomAnimation={true}
          className="min-h-[65dvh]"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            minZoom={0}
            maxZoom={20}
            url="https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}{r}.png"
          />

          <LayersControl position="topright">
            <LayersControl.BaseLayer name="Google Map">
              <LayerGroup>
                <TileLayer
                  url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                  maxZoom={20}
                  subdomains={["mt0", "mt1", "mt2", "mt3"]}
                />
              </LayerGroup>
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Satellite">
              <LayerGroup>
                <TileLayer
                  url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                  maxZoom={20}
                  subdomains={["mt0", "mt1", "mt2", "mt3"]}
                />
              </LayerGroup>
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer checked name="Hybrid">
              <LayerGroup>
                <TileLayer
                  url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
                  subdomains={["mt0", "mt1", "mt2", "mt3"]}
                  maxZoom={20}
                />
              </LayerGroup>
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="OpenStreetMap">
              <LayerGroup>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </LayerGroup>
            </LayersControl.BaseLayer>

            <LayersControl.Overlay checked name="Marker">
              <LayerGroup>
                <Marker position={position}>
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>
              </LayerGroup>
            </LayersControl.Overlay>
          </LayersControl>

          {/*   <RoutingMachine /> */}
          <FullscreenControl forceSeparateButton position="topright" />
          <LocationMarker />
          <GeoSearch />
        </MapContainer>
      )}
    </div>
  );
}

/* function RoutingMachine() {
  const map = useMap();

  const ctrl = (L as any).Routing.control({
    waypoints: [L.latLng(57.74, 11.94), L.latLng(57.6792, 11.949)],
    router: (L as any).Routing.graphHopper(
      "afef6608-00ef-4a5a-8e0f-9447ba376f0c"
    ),
  });

  useEffect(() => {
    map.addControl(ctrl);

    return () => {
      map.removeControl(ctrl);
    };
  }, []);

  return null;
} */

function LocationMarker() {
  const [position, setPosition] = useState({ lat: 0, lng: 0 });

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.locate();
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        <p>LAT: {position.lat}</p>
        <p>LNG: {position.lng}</p>
      </Popup>
    </Marker>
  );
}

function GeoSearch() {
  const map = useMap();
  const provider = new OpenStreetMapProvider();

  useEffect(() => {
    //@ts-ignore
    const searchControl = new GeoSearchControl({
      notFoundMessage: "Sorry, that address could not be found.",
      provider: provider,
      autoComplete: true,
      autoClose: true,
      keepResult: true,
      retainZoomLevel: true,
    });

    map.addControl(searchControl);

    return () => {
      map.removeControl(searchControl);
    };
  });

  return null;
}

import React, { useRef } from "react";
import { MapContainer, Rectangle, CircleMarker, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const makeTextIcon = (text, color = "black") =>
  L.divIcon({
    className: "room-label",
    html: `<div style="
      color: ${color};
      font-weight: bold;
      font-size: 14px;
      text-align: center;
      white-space: nowrap;
    ">${text}</div>`,
    iconSize: [120, 24],
    iconAnchor: [60, 12],
  });

function Map() {
  const mapRef = useRef(null);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        crs={L.CRS.Simple}
        bounds={[
          [0, 0],
          [100, 160],
        ]}
        center={[120, 50]}
        zoom={3}
        style={{ height: "100%", width: "100%" }}
        whenReady={(map) => {
          mapRef.current = map.target;
        }}
      >
        {/* ENTRÉE */}
        <Rectangle
          bounds={[
            [99.94, 45],
            [95, 55],
          ]}
          pathOptions={{
            fillColor: "black",
            fillOpacity: 1,
            color: "black",
          }}
        />

        <Marker position={[97, 50]} icon={makeTextIcon("entrée", "white")} />

        {/* LES POINTS ROUGE */}

        <CircleMarker
          center={[95, 50]}
          radius={5}
          pathOptions={{
            color: "red",
            fillColor: "red",
            fillOpacity: 1,
          }}
        />

        <CircleMarker
          center={[105, 59.8]}
          radius={5}
          pathOptions={{
            color: "red",
            fillColor: "red",
            fillOpacity: 1,
          }}
        />

        <CircleMarker
          center={[105, 30]}
          radius={5}
          pathOptions={{
            color: "red",
            fillColor: "red",
            fillOpacity: 1,
          }}
        />

        {/* COULOIR VERTICAL */}

        <Rectangle
          bounds={[
            [100, 45],
            [160, 55],
          ]}
          pathOptions={{
            fillColor: "#bdbdbd",
            fillOpacity: 1,
            color: "#bdbdbd",
          }}
        />

        <Rectangle
          bounds={[
            [110, 77.2],
            [130, 85],
          ]}
          pathOptions={{
            fillColor: "#bdbdbd",
            fillOpacity: 1,
            color: "#bdbdbd",
          }}
        />

        <Rectangle
          bounds={[
            [100, 10],
            [110, 50],
          ]}
          pathOptions={{
            fillColor: "#bdbdbd",
            fillOpacity: 1,
            color: "#bdbdbd",
          }}
        />

        <Rectangle
          bounds={[
            [100, 55],
            [110, 60],
          ]}
          pathOptions={{
            fillColor: "#bdbdbd",
            fillOpacity: 1,
            color: "#bdbdbd",
          }}
        />

        <Rectangle
          bounds={[
            [120, 55],
            [110, 85],
          ]}
          pathOptions={{
            fillColor: "#bdbdbd",
            fillOpacity: 1,
            color: "#bdbdbd",
          }}
        />

        <Rectangle
          bounds={[
            [130, 45],
            [120, 0],
          ]}
          pathOptions={{
            fillColor: "#bdbdbd",
            fillOpacity: 1,
            color: "#bdbdbd",
          }}
        />
        {/* ===================== */}
        {/* SALLE : SCOLARITÉ */}
        {/* ===================== */}
        <Rectangle
          bounds={[
            [110, 0],
            [100, 30],
          ]}
          pathOptions={{
            fillColor: "#000",
            fillOpacity: 1,
            color: "#000",
          }}
        />

        <Rectangle
          bounds={[
            [120, 0],
            [110, 20],
          ]}
          pathOptions={{
            fillColor: "#645b5b",
            fillOpacity: 1,
            color: "#645b5b",
          }}
        />

        <Rectangle
          bounds={[
            [100, 60],
            [110, 70],
          ]}
          pathOptions={{
            fillColor: "#000",
            fillOpacity: 1,
            color: "#000",
          }}
        />

        <Rectangle
          bounds={[
            [120, 55],
            [140, 70],
          ]}
          pathOptions={{
            fillColor: "#000000",
            fillOpacity: 1,
            color: "#000000",
          }}
        />
        <Rectangle
          bounds={[
            [125, 70],
            [130, 77],
          ]}
          pathOptions={{
            fillColor: "#000000",
            fillOpacity: 1,
            color: "#000000",
          }}
        />

        <Rectangle
          bounds={[
            [120, 55],
            [140, 70],
          ]}
          pathOptions={{
            fillColor: "#000000",
            fillOpacity: 1,
            color: "#000000",
          }}
        />
        <Rectangle
          bounds={[
            [140, 55],
            [150, 70],
          ]}
          pathOptions={{
            fillColor: "#268c4b",
            fillOpacity: 1,
            color: "#268c4b",
          }}
        />
        <Rectangle
          bounds={[
            [150, 45],
            [160, 70],
          ]}
          pathOptions={{
            fillColor: "#1c3170",
            fillOpacity: 1,
            color: "#1c3170",
          }}
        />
        <Rectangle
          bounds={[
            [140, 35],
            [160, 45],
          ]}
          pathOptions={{
            fillColor: "#268c4b",
            fillOpacity: 1,
            color: "#268c4b",
          }}
        />

        <Rectangle
          bounds={[
            [135, 35],
            [140, 45],
          ]}
          pathOptions={{
            fillColor: "#ba9abf",
            fillOpacity: 1,
            color: "#ba9abf",
          }}
        />

        <Rectangle
          bounds={[
            [130, 35],
            [135, 45],
          ]}
          pathOptions={{
            fillColor: "#c13bd6",
            fillOpacity: 1,
            color: "#c13bd6",
          }}
        />

        <Rectangle
          bounds={[
            [100, 70],
            [110, 77.2],
          ]}
          pathOptions={{
            fillColor: "#df0808",
            fillOpacity: 1,
            color: "#df0808",
          }}
        />

        <Rectangle
          bounds={[
            [120, 70],
            [125, 77],
          ]}
          pathOptions={{
            fillColor: "#df0808",
            fillOpacity: 1,
            color: "#df0808",
          }}
        />

        <Rectangle
          bounds={[
            [100, 77.2],
            [110, 85],
          ]}
          pathOptions={{
            fillColor: "#419b58",
            fillOpacity: 1,
            color: "#419b58",
          }}
        />

        <Rectangle
          bounds={[
            [100, 100],
            [130, 85],
          ]}
          pathOptions={{
            fillColor: "#1c3170",
            fillOpacity: 1,
            color: "#1c3170",
          }}
        />

        <Marker
          position={[105, 15]}
          icon={makeTextIcon("Scolarité", "white")}
        />
        <Marker
          position={[106, 65]}
          icon={makeTextIcon("Bureau <br/> d'accueil", "white")}
        />
        <Marker position={[105, 73.5]} icon={makeTextIcon("B1", "white")} />
        <Marker position={[105, 81]} icon={makeTextIcon("B2", "white")} />
        <Marker position={[115, 92.5]} icon={makeTextIcon("TD5", "white")} />
        <Marker position={[122.5, 73]} icon={makeTextIcon("BDE", "white")} />
        <Marker position={[145, 62.5]} icon={makeTextIcon("B3", "white")} />
        <Marker position={[155, 57]} icon={makeTextIcon("TD3", "white")} />
        <Marker position={[150, 40]} icon={makeTextIcon("B4", "white")} />
        <Marker
          position={[137.5, 40]}
          icon={makeTextIcon("WC Staff", "white")}
        />
        <Marker position={[132.5, 40]} icon={makeTextIcon("WC F", "white")} />
        <Marker
          position={[115, 10]}
          icon={makeTextIcon("Direction", "white")}
        />
        <Marker position={[115, 32]} icon={makeTextIcon("Escalier", "black")} />
        <Marker
          position={[130, 62.5]}
          icon={makeTextIcon("Salle des profs", "white")}
        />
      </MapContainer>
    </div>
  );
}

export default Map;

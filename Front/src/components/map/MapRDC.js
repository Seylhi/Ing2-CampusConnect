import { MapContainer, Rectangle, CircleMarker, Marker } from "react-leaflet";
import L from "leaflet";
import { useRef } from "react";

/* ===== Icône texte (blanc forcé) ===== */
const makeTextIcon = (text, color = "white") =>
  L.divIcon({
    html: `
      <div style="
        font-size:12px;
        color:${color} !important;
        font-weight:bold;
        text-align:center;
        white-space:nowrap;
      ">
        ${text}
      </div>
    `,
    className: "",
  });

/* ===== Style commun sans bordure ===== */
const fineBorder = {
  fillOpacity: 1,
  stroke: true,
  weight: 0.5,
  color: "#222",
};

function MapRDC() {
  const mapRef = useRef(null);

  return (
    <div style={{ height: "100%", width: "100%" }}>
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
        {/* ===================== */}
        {/* ENTRÉE */}
        {/* ===================== */}
        <Rectangle
          bounds={[
            [99.94, 45],
            [95, 55],
          ]}
          pathOptions={{ fillColor: "black", ...fineBorder }}
        />
        <Marker position={[97, 48]} icon={makeTextIcon("Entrée")} />

        {/* ===================== */}
        {/* CAPTEURS */}
        {/* ===================== */}
        <CircleMarker
          center={[95, 50]}
          radius={5}
          pathOptions={{ color: "red", fillColor: "red", fillOpacity: 1 }}
        />
        <CircleMarker
          center={[105, 59.8]}
          radius={5}
          pathOptions={{ color: "red", fillColor: "red", fillOpacity: 1 }}
        />
        <CircleMarker
          center={[105, 30]}
          radius={5}
          pathOptions={{ color: "red", fillColor: "red", fillOpacity: 1 }}
        />

        {/* ===================== */}
        {/* COULOIRS */}
        {/* ===================== */}
        <Rectangle
          bounds={[
            [100, 45],
            [160, 55],
          ]}
          pathOptions={{ fillColor: "#bdbdbd", ...fineBorder }}
        />
        <Rectangle
          bounds={[
            [110, 77],
            [130, 85],
          ]}
          pathOptions={{ fillColor: "#bdbdbd", ...fineBorder }}
        />
        <Rectangle
          bounds={[
            [100, 10],
            [110, 45],
          ]}
          pathOptions={{ fillColor: "#bdbdbd", ...fineBorder }}
        />
        <Rectangle
          bounds={[
            [100, 55],
            [110, 60],
          ]}
          pathOptions={{ fillColor: "#bdbdbd", ...fineBorder }}
        />
        <Rectangle
          bounds={[
            [120, 55],
            [110, 85],
          ]}
          pathOptions={{ fillColor: "#bdbdbd", ...fineBorder }}
        />
        <Rectangle
          bounds={[
            [130, 45],
            [120, 0],
          ]}
          pathOptions={{ fillColor: "#bdbdbd", ...fineBorder }}
        />

        {/* ===================== */}
        {/* SALLE : SCOLARITÉ */}
        {/* ===================== */}
        <Rectangle
          bounds={[
            [110, 0],
            [100, 30],
          ]}
          pathOptions={{ fillColor: "#000", ...fineBorder }}
        />
        <Marker position={[105, 15]} icon={makeTextIcon("Scolarité")} />

        {/* ===================== */}
        {/* SALLE : DIRECTION */}
        {/* ===================== */}
        <Rectangle
          bounds={[
            [120, 0],
            [110, 20],
          ]}
          pathOptions={{ fillColor: "#645b5b", ...fineBorder }}
        />
        <Marker position={[115, 10]} icon={makeTextIcon("Direction")} />

        {/* ===================== */}
        {/* SALLE : BUREAU D’ACCUEIL */}
        {/* ===================== */}
        <Rectangle
          bounds={[
            [100, 60],
            [110, 70],
          ]}
          pathOptions={{ fillColor: "#000", ...fineBorder }}
        />
        <Marker position={[105, 61]} icon={makeTextIcon("Bureau d'acc")} />

        {/* ===================== */}
        {/* SALLE : SALLE DES PROFS */}
        {/* ===================== */}
        <Rectangle
          bounds={[
            [120, 55],
            [140, 70],
          ]}
          pathOptions={{ fillColor: "#000", ...fineBorder }}
        />
        <Marker position={[128, 60]} icon={makeTextIcon("Salle des profs")} />
        <Rectangle
          bounds={[
            [125, 70],
            [130, 77],
          ]}
          pathOptions={{ fillColor: "#000", ...fineBorder }}
        />
        {/* ===================== */}
        {/* SALLE : BDE */}
        {/* ===================== */}
        <Rectangle
          bounds={[
            [120, 70],
            [125, 77],
          ]}
          pathOptions={{ fillColor: "#645b5b", ...fineBorder }}
        />
        <Marker position={[122.5, 73]} icon={makeTextIcon("BDE")} />

        {/* ===================== */}
        {/* SALLE : B1 */}
        {/* ===================== */}
        <Rectangle
          bounds={[
            [100, 70],
            [110, 77.2],
          ]}
          pathOptions={{ fillColor: "#df0808", ...fineBorder }}
        />
        <Marker position={[105, 73.5]} icon={makeTextIcon("B1")} />

        {/* ===================== */}
        {/* SALLE : B2 */}
        {/* ===================== */}
        <Rectangle
          bounds={[
            [100, 77.2],
            [110, 85],
          ]}
          pathOptions={{ fillColor: "#419b58", ...fineBorder }}
        />
        <Marker position={[105, 81]} icon={makeTextIcon("B2")} />

        {/* ===================== */}
        {/* SALLE : TD5 */}
        {/* ===================== */}
        <Rectangle
          bounds={[
            [100, 100],
            [130, 85],
          ]}
          pathOptions={{ fillColor: "#1c3170", ...fineBorder }}
        />
        <Marker position={[115, 92.5]} icon={makeTextIcon("TD5")} />

        {/* ===================== */}
        {/* SALLE : B3 */}
        {/* ===================== */}
        <Rectangle
          bounds={[
            [140, 55],
            [150, 70],
          ]}
          pathOptions={{ fillColor: "#268c4b", ...fineBorder }}
        />
        <Marker position={[145, 62.5]} icon={makeTextIcon("B3")} />

        {/* ===================== */}
        {/* SALLE : TD3 */}
        {/* ===================== */}
        <Rectangle
          bounds={[
            [150, 45],
            [160, 70],
          ]}
          pathOptions={{ fillColor: "#1c3170", ...fineBorder }}
        />
        <Marker position={[155, 57]} icon={makeTextIcon("TD3")} />

        {/* ===================== */}
        {/* SALLE : B4 */}
        {/* ===================== */}
        <Rectangle
          bounds={[
            [140, 35],
            [160, 45],
          ]}
          pathOptions={{ fillColor: "#268c4b", ...fineBorder }}
        />
        <Marker position={[150, 40]} icon={makeTextIcon("B4")} />

        {/* ===================== */}
        {/* SALLE : WC STAFF */}
        {/* ===================== */}
        <Rectangle
          bounds={[
            [135, 35],
            [140, 45],
          ]}
          pathOptions={{ fillColor: "#ba9abf", ...fineBorder }}
        />
        <Marker position={[137.5, 38]} icon={makeTextIcon("WC Staff")} />

        {/* ===================== */}
        {/* SALLE : WC FEMMES */}
        {/* ===================== */}
        <Rectangle
          bounds={[
            [130, 35],
            [135, 45],
          ]}
          pathOptions={{ fillColor: "#c13bd6", ...fineBorder }}
        />
        <Marker position={[132.5, 39]} icon={makeTextIcon("WC F")} />

        {/* ===================== */}
        {/* ESCALIER */}
        {/* ===================== */}
        <Marker position={[115, 32]} icon={makeTextIcon("Escalier", "black")} />
      </MapContainer>
    </div>
  );
}

export default MapRDC;

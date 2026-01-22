import { MapContainer, Rectangle, Marker } from "react-leaflet";
import L from "leaflet";
import { useRef, useState } from "react";

/* ===== Icône texte ===== */
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

/* ===== Styles ===== */
const salleStyle = {
  fillOpacity: 1,
  stroke: true,
  weight: 0.5,
  color: "#222",
};

const couloirStyle = {
  fillOpacity: 1,
  stroke: false,
};

function MapEtage1() {
  const mapRef = useRef(null);
  const [salleSelectionnee, setSalleSelectionnee] = useState(null);

  /* ===== CLIC SALLE ===== */
  const handleSalleClick = async (idSalle) => {
    try {
      const res = await fetch(`http://localhost:8080/salles/${idSalle}`);
      const data = await res.json();
      setSalleSelectionnee(data);
    } catch (e) {
      console.error("Erreur récupération salle", e);
    }
  };

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <MapContainer
        crs={L.CRS.Simple}
        bounds={[
          [0, 0],
          [100, 160],
        ]}
        center={[120, 50]}
        zoom={3}
        style={{ height: "100%", width: "100%" }}
        whenReady={(map) => (mapRef.current = map.target)}
      >
        {/* ===================== */}
        {/* COULOIRS */}
        {/* ===================== */}
        <Rectangle
          bounds={[
            [100, 45],
            [160, 55],
          ]}
          pathOptions={{ fillColor: "#bdbdbd", ...couloirStyle }}
        />
        <Rectangle
          bounds={[
            [110, 77.2],
            [130, 85],
          ]}
          pathOptions={{ fillColor: "#bdbdbd", ...couloirStyle }}
        />
        <Rectangle
          bounds={[
            [100, 10],
            [110, 50],
          ]}
          pathOptions={{ fillColor: "#bdbdbd", ...couloirStyle }}
        />
        <Rectangle
          bounds={[
            [100, 55],
            [130, 60],
          ]}
          pathOptions={{ fillColor: "#bdbdbd", ...couloirStyle }}
        />
        <Rectangle
          bounds={[
            [130, 55],
            [115, 85],
          ]}
          pathOptions={{ fillColor: "#bdbdbd", ...couloirStyle }}
        />
        <Rectangle
          bounds={[
            [130, 45],
            [120, 0],
          ]}
          pathOptions={{ fillColor: "#bdbdbd", ...couloirStyle }}
        />

        {/* ===================== */}
        {/* SALLES INFO */}
        {/* ===================== */}

        <Rectangle
          bounds={[
            [100, 100],
            [115, 75],
          ]}
          pathOptions={{ fillColor: "#1c3170", ...salleStyle }}
          eventHandlers={{ click: () => handleSalleClick(7) }}
        />
        <Marker position={[107.5, 87.5]} icon={makeTextIcon("INFO 01")} />

        <Rectangle
          bounds={[
            [115, 100],
            [130, 75],
          ]}
          pathOptions={{ fillColor: "#1c3170", ...salleStyle }}
          eventHandlers={{ click: () => handleSalleClick(8) }}
        />
        <Marker position={[122.5, 87.5]} icon={makeTextIcon("INFO 02")} />

        <Rectangle
          bounds={[
            [150, 35],
            [160, 55],
          ]}
          pathOptions={{ fillColor: "#1c3170", ...salleStyle }}
          eventHandlers={{ click: () => handleSalleClick(9) }}
        />
        <Marker position={[155, 45]} icon={makeTextIcon("INFO 03")} />

        <Rectangle
          bounds={[
            [115, 0],
            [100, 20],
          ]}
          pathOptions={{ fillColor: "#2d6f43", ...salleStyle }}
          eventHandlers={{ click: () => handleSalleClick(10) }}
        />
        <Marker position={[107.5, 7.5]} icon={makeTextIcon("INFO 04")} />

        <Rectangle
          bounds={[
            [130, 0],
            [115, 20],
          ]}
          pathOptions={{ fillColor: "#4229bd", ...salleStyle }}
          eventHandlers={{ click: () => handleSalleClick(11) }}
        />
        <Marker position={[122.5, 7.5]} icon={makeTextIcon("INFO 05")} />

        <Rectangle
          bounds={[
            [140, 55],
            [160, 70],
          ]}
          pathOptions={{ fillColor: "#268c4b", ...salleStyle }}
          eventHandlers={{ click: () => handleSalleClick(17) }}
        />
        <Marker position={[150, 62.5]} icon={makeTextIcon("INFO 06")} />

        {/* ===================== */}
        {/* SALLES TD */}
        {/* ===================== */}

        <Rectangle
          bounds={[
            [150, 45],
            [160, 70],
          ]}
          pathOptions={{ fillColor: "#1c3170", ...salleStyle }}
          eventHandlers={{ click: () => handleSalleClick(14) }}
        />
        <Marker position={[155, 57]} icon={makeTextIcon("TD 03")} />

        <Rectangle
          bounds={[
            [100, 100],
            [130, 85],
          ]}
          pathOptions={{ fillColor: "#1c3170", ...salleStyle }}
          eventHandlers={{ click: () => handleSalleClick(16) }}
        />
        <Marker position={[115, 92.5]} icon={makeTextIcon("TD 05")} />

        <Rectangle
          bounds={[
            [100, 75],
            [115, 55],
          ]}
          pathOptions={{ fillColor: "#cb571d", ...salleStyle }}
          eventHandlers={{ click: () => handleSalleClick(18) }}
        />
        <Marker position={[107.5, 65]} icon={makeTextIcon("TD 06")} />

        <Rectangle
          bounds={[
            [130, 55],
            [140, 70],
          ]}
          pathOptions={{ fillColor: "#b35c1d", ...salleStyle }}
          eventHandlers={{ click: () => handleSalleClick(19) }}
        />
        <Marker position={[135, 62.5]} icon={makeTextIcon("TD 07")} />

        <Marker position={[115, 32]} icon={makeTextIcon("Escalier")} />
      </MapContainer>

      {/* ===================== */}
      {/* INFOS SALLE */}
      {/* ===================== */}
      {salleSelectionnee && (
        <div
          style={{
            position: "absolute",
            right: 20,
            top: 80,
            background: "#fff",
            padding: "15px",
            borderRadius: "8px",
            width: "240px",
            boxShadow: "0 0 10px rgba(0,0,0,0.25)",
            zIndex: 1000,
          }}
        >
          <h4>{salleSelectionnee.nom_salle}</h4>
          <p>
            <b>Capacité :</b> {salleSelectionnee.capacite}
          </p>
          <p>
            <b>Surface :</b> {salleSelectionnee.surface_m2} m²
          </p>
          <p>
            <b>Orientation :</b> {salleSelectionnee.orientation}
          </p>
          <p>
            <b>Température :</b> {salleSelectionnee.temperature} °C
          </p>
          <p>
            <b>Humidité :</b> {salleSelectionnee.humidite} %
          </p>
        </div>
      )}
    </div>
  );
}

export default MapEtage1;

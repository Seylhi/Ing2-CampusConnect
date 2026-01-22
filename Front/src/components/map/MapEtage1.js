import { MapContainer, Rectangle, Marker, Pane } from "react-leaflet";
import L from "leaflet";
import { useRef, useState } from "react";
import axios from "axios";
import { LOCAL_HOST_SALLE } from "../../constants/back";

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

/* ===== Bordure normale ===== */
const fineBorder = {
  fillOpacity: 1,
  stroke: true,
  weight: 0.5,
  color: "#222",
};

/* ===== Bordure salle sélectionnée ===== */
const selectedStyle = {
  ...fineBorder,
  color: "#ff0000",
  weight: 5,
};

function MapEtage1() {
  const mapRef = useRef(null);
  const [salleSelectionnee, setSalleSelectionnee] = useState(null);
  const [selectedSalleId, setSelectedSalleId] = useState(null);

  const handleSalleClick = (idSalle) => {
    setSelectedSalleId(idSalle);
    axios
      .get(`${LOCAL_HOST_SALLE}${idSalle}`)
      .then((response) => {
        setSalleSelectionnee(response.data);
      })
      .catch((error) => {
        console.error("Erreur chargement salle :", error);
      });
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
        {/* ===== PANES ===== */}
        <Pane name="couloirs" style={{ zIndex: 400 }} />
        <Pane name="salles" style={{ zIndex: 500 }} />
        <Pane name="labels" style={{ zIndex: 600 }} />

        {/* ===== COULOIRS (NON CLIQUABLES) ===== */}
        {[
          [
            [100, 45],
            [160, 55],
          ],
          [
            [110, 77.2],
            [130, 85],
          ],
          [
            [100, 10],
            [110, 50],
          ],
          [
            [100, 55],
            [130, 60],
          ],
          [
            [130, 55],
            [115, 85],
          ],
          [
            [130, 45],
            [120, 0],
          ],
        ].map((b, i) => (
          <Rectangle
            key={`c-${i}`}
            pane="couloirs"
            interactive={false}
            bounds={b}
            pathOptions={{ fillColor: "#bdbdbd", ...fineBorder }}
          />
        ))}

        {/* ===== SALLES CLIQUABLES ===== */}
        {[
          {
            id: 9,
            label: "INFO 03",
            color: "#1c3170",
            bounds: [
              [150, 35],
              [160, 55],
            ],
            pos: [155, 42],
          },
          {
            id: 11,
            label: "INFO 05",
            color: "#4229bd",
            bounds: [
              [130, 0],
              [115, 20],
            ],
            pos: [122.5, 7.5],
          },
          {
            id: 10,
            label: "INFO 04",
            color: "#2d6f43",
            bounds: [
              [115, 0],
              [100, 20],
            ],
            pos: [107.5, 7.5],
          },
          {
            id: 18,
            label: "INFO 06",
            color: "#268c4b",
            bounds: [
              [140, 55],
              [160, 70],
            ],
            pos: [150, 61],
          },
          {
            id: 20,
            label: "TD 07",
            color: "#b35c1d",
            bounds: [
              [130, 55],
              [140, 70],
            ],
            pos: [135, 62.5],
          },
          {
            id: 7,
            label: "INFO 01",
            color: "#1c3170",
            bounds: [
              [100, 100],
              [115, 75],
            ],
            pos: [107.5, 87.5],
          },
          {
            id: 8,
            label: "INFO 02",
            color: "#1c3170",
            bounds: [
              [115, 100],
              [130, 75],
            ],
            pos: [122.5, 87.5],
          },
          {
            id: 19,
            label: "TD6",
            color: "#cb571d",
            bounds: [
              [100, 75],
              [115, 55],
            ],
            pos: [107.5, 65],
          },
        ].map((salle) => (
          <div key={salle.id}>
            <Rectangle
              pane="salles"
              bounds={salle.bounds}
              pathOptions={{
                fillColor: salle.color,
                ...(selectedSalleId === salle.id ? selectedStyle : fineBorder),
              }}
              eventHandlers={{ click: () => handleSalleClick(salle.id) }}
            />
            <Marker
              pane="labels"
              position={salle.pos}
              icon={makeTextIcon(salle.label)}
            />
          </div>
        ))}

        {/* ===== NON CLIQUABLES ===== */}
        {[
          {
            label: "B6",
            bounds: [
              [100, 20],
              [110, 55],
            ],
            pos: [105, 37],
          },
          {
            label: "B5",
            bounds: [
              [140, 35],
              [150, 45],
            ],
            pos: [145, 40],
          },
          {
            label: "WC Staff",
            bounds: [
              [135, 35],
              [140, 45],
            ],
            pos: [137.5, 38],
          },
          {
            label: "WC F",
            bounds: [
              [130, 35],
              [135, 45],
            ],
            pos: [132.5, 39],
          },
        ].map((s, i) => (
          <div key={`nc-${i}`}>
            <Rectangle
              pane="salles"
              interactive={false}
              bounds={s.bounds}
              pathOptions={{ fillColor: "#888", ...fineBorder }}
            />
            <Marker
              pane="labels"
              position={s.pos}
              icon={makeTextIcon(s.label)}
            />
          </div>
        ))}

        <Marker
          pane="labels"
          position={[115, 32]}
          icon={makeTextIcon("Escalier", "black")}
        />
      </MapContainer>

      {/* ===== PANNEAU INFOS ===== */}
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
          <h4>{salleSelectionnee.nomSalle}</h4>
          <p>
            <b>Capacité :</b> {salleSelectionnee.capacite}
          </p>
          <p>
            <b>TP :</b> {salleSelectionnee.estSalleTp ? "Oui" : "Non"}
          </p>
          <p>
            <b>Surface :</b> {salleSelectionnee.surfaceM2} m²
          </p>
          <p>
            <b>Fenêtres :</b> {salleSelectionnee.nbFenetres}
          </p>
          <p>
            <b>Orientation :</b> {salleSelectionnee.orientation}
          </p>
          <p>
            <b>Chauffage :</b> {salleSelectionnee.chauffage ? "Oui" : "Non"}
          </p>
        </div>
      )}
    </div>
  );
}

export default MapEtage1;

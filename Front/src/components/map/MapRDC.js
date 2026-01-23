import {
  MapContainer,
  Rectangle,
  CircleMarker,
  Marker,
  Pane,
} from "react-leaflet";
import L from "leaflet";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { LOCAL_HOST_SALLE } from "../../constants/back";

/* ===== Icône texte ===== */
const makeTextIcon = (text, color = "white") =>
  L.divIcon({
    html: `
      <div style="
        font-size:12px;
        color:${color};
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
const fineBorder = {
  fillOpacity: 1,
  stroke: true,
  weight: 0.5,
  color: "#222",
};

const selectedStyle = {
  ...fineBorder,
  color: "#ff0000",
  weight: 5,
};

function MapRDC() {
  const mapRef = useRef(null);

  /* ===== STATES ===== */
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [minCapacite, setMinCapacite] = useState("");
  const [filtreTP, setFiltreTP] = useState(false);
  const [filtreChauffage, setFiltreChauffage] = useState(false);

  const [selectedSalleId, setSelectedSalleId] = useState(null);
  const [salleSelectionnee, setSalleSelectionnee] = useState(null);
  const [sallesDB, setSallesDB] = useState([]);

  /* ===== LOAD SALLES FROM DB ===== */
  useEffect(() => {
    axios
      .get(`${LOCAL_HOST_SALLE}all`)
      .then((res) => setSallesDB(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSalleClick = (idSalle) => {
    setSelectedSalleId(idSalle);
    axios
      .get(`${LOCAL_HOST_SALLE}${idSalle}`)
      .then((res) => setSalleSelectionnee(res.data))
      .catch(() => setSalleSelectionnee(null));
  };

  /* ===== GÉOMÉTRIE RDC (INCHANGÉE) ===== */
  const salles = [
    {
      id: 1,
      label: "Scolarité",
      color: "#000",
      bounds: [
        [110, 0],
        [100, 30],
      ],
      pos: [105, 15],
    },
    {
      id: 2,
      label: "Direction",
      color: "#645b5b",
      bounds: [
        [120, 0],
        [110, 20],
      ],
      pos: [115, 10],
    },
    {
      id: 3,
      label: "Bureau d'accueil",
      color: "#000",
      bounds: [
        [100, 60],
        [110, 70],
      ],
      pos: [105, 61],
    },
    {
      id: 4,
      label: "Salle des profs",
      color: "#000",
      bounds: [
        [120, 55],
        [140, 70],
      ],
      pos: [128, 60],
    },
    {
      id: 5,
      label: "BDE",
      color: "#645b5b",
      bounds: [
        [120, 70],
        [125, 77],
      ],
      pos: [122.5, 73],
    },
    {
      id: 6,
      label: "B1",
      color: "#df0808",
      bounds: [
        [100, 70],
        [110, 77.2],
      ],
      pos: [105, 73.5],
    },
    {
      id: 7,
      label: "B2",
      color: "#419b58",
      bounds: [
        [100, 77.2],
        [110, 85],
      ],
      pos: [105, 81],
    },
    {
      id: 16,
      label: "TD5",
      color: "#1c3170",
      bounds: [
        [100, 100],
        [130, 85],
      ],
      pos: [115, 92.5],
    },
    {
      id: 9,
      label: "B3",
      color: "#268c4b",
      bounds: [
        [140, 55],
        [150, 70],
      ],
      pos: [145, 62.5],
    },
    {
      id: 14,
      label: "TD3",
      color: "#1c3170",
      bounds: [
        [150, 45],
        [160, 70],
      ],
      pos: [155, 57],
    },
    {
      id: 11,
      label: "B4",
      color: "#268c4b",
      bounds: [
        [140, 35],
        [160, 45],
      ],
      pos: [150, 40],
    },
  ];

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      {/* ===== BARRE RECHERCHE + FILTRES ===== */}
      <div style={{ padding: 10, background: "#f5f5f5" }}>
        <input
          type="text"
          placeholder="Rechercher une salle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 6 }}
        />
        <button onClick={() => setShowFilters(!showFilters)}>Filtrer</button>

        {showFilters && (
          <div style={{ marginTop: 10 }}>
            <input
              type="number"
              placeholder="Capacité minimale"
              value={minCapacite}
              onChange={(e) => setMinCapacite(e.target.value)}
            />
            <label>
              <input
                type="checkbox"
                checked={filtreTP}
                onChange={(e) => setFiltreTP(e.target.checked)}
              />{" "}
              TP
            </label>
            <label>
              <input
                type="checkbox"
                checked={filtreChauffage}
                onChange={(e) => setFiltreChauffage(e.target.checked)}
              />{" "}
              Chauffage
            </label>
          </div>
        )}
      </div>

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
        <Pane name="couloirs" style={{ zIndex: 400 }} />
        <Pane name="salles" style={{ zIndex: 500 }} />
        <Pane name="labels" style={{ zIndex: 600 }} />

        {/* ===== COULOIRS ===== */}
        {[
          [
            [100, 45],
            [160, 55],
          ],
          [
            [110, 77],
            [130, 85],
          ],
          [
            [100, 10],
            [110, 45],
          ],
          [
            [100, 55],
            [110, 60],
          ],
          [
            [120, 55],
            [110, 85],
          ],
          [
            [130, 45],
            [120, 0],
          ],
        ].map((b, i) => (
          <Rectangle
            key={i}
            pane="couloirs"
            interactive={false}
            bounds={b}
            pathOptions={{ fillColor: "#bdbdbd", ...fineBorder }}
          />
        ))}

        {/* ===== SALLES ===== */}
        {salles.map((s) => (
          <div key={s.id}>
            <Rectangle
              pane="salles"
              bounds={s.bounds}
              pathOptions={{
                fillColor: s.color,
                ...(selectedSalleId === s.id ? selectedStyle : fineBorder),
              }}
              eventHandlers={{ click: () => handleSalleClick(s.id) }}
            />
            <Marker
              pane="labels"
              position={s.pos}
              icon={makeTextIcon(s.label)}
            />
          </div>
        ))}

        {/* ===== WC + ESCALIER ===== */}
        <Rectangle
          pane="salles"
          interactive={false}
          bounds={[
            [135, 35],
            [140, 45],
          ]}
          pathOptions={{ fillColor: "#ba9abf", ...fineBorder }}
        />
        <Marker
          pane="labels"
          position={[137.5, 38]}
          icon={makeTextIcon("WC Staff")}
        />

        <Rectangle
          pane="salles"
          interactive={false}
          bounds={[
            [130, 35],
            [135, 45],
          ]}
          pathOptions={{ fillColor: "#c13bd6", ...fineBorder }}
        />
        <Marker
          pane="labels"
          position={[132.5, 39]}
          icon={makeTextIcon("WC F")}
        />

        <Marker
          pane="labels"
          position={[115, 32]}
          icon={makeTextIcon("Escalier", "black")}
        />
      </MapContainer>

      {/* ===== INFOS ===== */}
      {salleSelectionnee && (
        <div
          style={{
            position: "absolute",
            right: 20,
            top: 80,
            background: "#fff",
            padding: 15,
            borderRadius: 8,
            width: 240,
            boxShadow: "0 0 10px rgba(0,0,0,0.25)",
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
            <b>Chauffage :</b> {salleSelectionnee.chauffage ? "Oui" : "Non"}
          </p>
        </div>
      )}
    </div>
  );
}

export default MapRDC;

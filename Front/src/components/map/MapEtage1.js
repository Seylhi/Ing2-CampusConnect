import { MapContainer, Rectangle, Marker, Pane } from "react-leaflet";
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

const highlightStyle = {
  ...fineBorder,
  color: "#ff9800",
  weight: 4,
};

function MapEtage1() {
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

  /* ===== LOAD SALLES DB ===== */
  useEffect(() => {
    axios
      .get(`${LOCAL_HOST_SALLE}all`)
      .then((res) => setSallesDB(res.data))
      .catch((err) => console.error(err));
  }, []);

  const getSalleDB = (id) => sallesDB.find((s) => s.idSalle === id);

  /* ===== HIGHLIGHT LOGIC ===== */
  const isHighlighted = (idSalle) => {
    const s = getSalleDB(idSalle);
    if (!s) return false;

    const matchSearch =
      search && s.nomSalle.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      (minCapacite && s.capacite >= Number(minCapacite)) ||
      (filtreTP && s.estSalleTp) ||
      (filtreChauffage && s.chauffage);

    return matchSearch || matchFilter;
  };

  const handleSalleClick = (idSalle) => {
    setSelectedSalleId(idSalle);
    axios
      .get(`${LOCAL_HOST_SALLE}${idSalle}`)
      .then((res) => setSalleSelectionnee(res.data))
      .catch(() => setSalleSelectionnee(null));
  };

  /* ===== GÉOMÉTRIE ÉTAGE 1 (INCHANGÉE) ===== */
  const salles = [
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
      >
        <Pane name="couloirs" style={{ zIndex: 400 }} />
        <Pane name="salles" style={{ zIndex: 500 }} />
        <Pane name="labels" style={{ zIndex: 600 }} />

        {/* ===== COULOIRS (INCHANGÉS) ===== */}
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
                ...(s.id === selectedSalleId
                  ? selectedStyle
                  : isHighlighted(s.id)
                    ? highlightStyle
                    : fineBorder),
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

        {/* ===== B5 / B6 / WC / ESCALIER (INCHANGÉS) ===== */}
        {[
          {
            label: "B6",
            bounds: [
              [100, 20],
              [110, 55],
            ],
            pos: [105, 37],
            color: "#268c4b",
          },
          {
            label: "B5",
            bounds: [
              [140, 35],
              [150, 45],
            ],
            pos: [145, 40],
            color: "#268c4b",
          },
          {
            label: "WC Staff",
            bounds: [
              [135, 35],
              [140, 45],
            ],
            pos: [137.5, 38],
            color: "#ba9abf",
          },
          {
            label: "WC F",
            bounds: [
              [130, 35],
              [135, 45],
            ],
            pos: [132.5, 39],
            color: "#c13bd6",
          },
        ].map((s, i) => (
          <div key={i}>
            <Rectangle
              pane="salles"
              interactive={false}
              bounds={s.bounds}
              pathOptions={{ fillColor: s.color, ...fineBorder }}
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

      {/* ===== INFOS SALLE ===== */}
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

export default MapEtage1;

import { useState } from "react";
import MapRDC from "./map/MapRDC";
import MapEtage1 from "./map/MapEtage1";

function Map() {
  const [etage, setEtage] = useState("RDC");

  const changerEtage = () => {
    setEtage(etage === "RDC" ? "ETAGE1" : "RDC");
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      {/* Bouton changer d'étage */}
      <button
        onClick={changerEtage}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1000,
          padding: "8px 12px",
          cursor: "pointer",
        }}
      >
        {etage === "RDC" ? "1er étage" : "RDC"}
      </button>

      {/* Affichage de l'étage */}
      {etage === "RDC" && <MapRDC />}
      {etage === "ETAGE1" && <MapEtage1 />}
    </div>
  );
}

export default Map;

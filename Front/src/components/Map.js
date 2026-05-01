import { useState } from "react";
import MapRDC from "./map/MapRDC";
import MapEtage1 from "./map/MapEtage1";
import { ROLES, hasRole } from "../utils/auth";

function Map() {
  const [etage, setEtage] = useState("RDC");

  const canSeeCapteurInfos = hasRole([ROLES.ADMIN, ROLES.AGENT_SECURITE]);

  const changerEtage = () => {
    setEtage(etage === "RDC" ? "ETAGE1" : "RDC");
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
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

      {etage === "RDC" && (
        <MapRDC canSeeCapteurInfos={canSeeCapteurInfos} /> // ici j'ai mi ca pour contrôler l'affichage des infos des capteurs en fonction du role de l'utilisateur
      )}

      {etage === "ETAGE1" && (
        <MapEtage1 canSeeCapteurInfos={canSeeCapteurInfos} /> // la meme chose ici pour le 1er étage
      )}
    </div>
  );
}

export default Map;

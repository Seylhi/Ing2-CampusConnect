import React, { useEffect, useState, useRef } from "react";
import {
  GET_MAP_STATS,
  INCREMENT_MAP_CONSULTATION,
} from "../../constants/back";

function MapStats({ canSeeCapteurInfos }) {
  const [stats, setStats] = useState(null);
  const hasIncremented = useRef(false);

  useEffect(() => {
    if (!hasIncremented.current) {
      hasIncremented.current = true;

      fetch(INCREMENT_MAP_CONSULTATION, {
        method: "POST",
      });
    }

    const fetchStats = () => {
      fetch(GET_MAP_STATS)
        .then((res) => res.json())
        .then((data) => {
          console.log("Stats reçues :", data);
          setStats(data);
        })
        .catch((err) => console.error("Erreur stats :", err));
    };

    fetchStats();

    const interval = setInterval(fetchStats, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!stats) return <div>Chargement des statistiques ...</div>;

  return (
    <div
      style={{
        background: "#f0f0f0",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "15px",
      }}
    >
      <h3>Statistiques globales</h3>

      <p>Total salles : {stats.totalSalles}</p>
      <p>Salles occupées : {stats.sallesOccupees}</p>
      <p>Taux occupation : {stats.tauxOccupation?.toFixed(1)} %</p>

      {canSeeCapteurInfos && (
        <>
          <p>Température moyenne : {stats.temperatureMoyenne?.toFixed(1)} °C</p>
          <p>Humidité moyenne : {stats.humiditeMoyenne?.toFixed(1)} %</p>
        </>
      )}

      <p>Consultations map : {stats.consultationsMap}</p>
    </div>
  );
}

export default MapStats;

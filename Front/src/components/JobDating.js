import React, { useState } from "react";
import axios from "axios";
import { GET_SALLE_OPTIMALE_JOBDATING } from "../constants/back";

export default function JobDating() {
  const [nbPersonnes, setNbPersonnes] = useState(25);
  const [resultat, setResultat] = useState(null);

  const loadMeilleureSalle = (nb) => {
    axios.get(GET_SALLE_OPTIMALE_JOBDATING + nb)
      .then((res) => {
        setResultat(res.data);
      })
      .catch((err) => {
        alert("Erreur lors du chargement : " + err);
      });
  };

  const showDetails = (res) => {
    alert(
      `=== DETAIL DU SCORE ===\n\n` +
      `--- Donnees physiques ---\n` +
      `Formule utilisee : C = Cext + (N * G * 1 000 000) / (ACH * V)\n` +
      `Constantes utilisees :\n` +
      ` - Cext (Air exterieur) = 400 ppm\n` +
      ` - G (Emission par pers.) = 0.018 m3/h\n` +
      ` - ACH (Renouvellement air) = 3.0\n` +
      ` - V (Volume) = Surface x 3 metres\n\n` +
      `--- Points par critere ---\n` +
      `Temperature : ${res.scoreTemperature ?? "N/A"} pts / 20\n` +
      `Humidite : ${res.scoreHumidite ?? "N/A"} pts / 20\n` +
      `Qualite de l'air (CO2) : ${res.scoreCo2 ?? "N/A"} pts / 60\n\n` +
      `--- Regles d'attribution des points ---\n` +
      `Temperature :\n` +
      ` > 20 a 23 C = 20 pts\n` +
      ` > 18 a 20 C ou 23 a 26 C = 10 pts\n` +
      ` > Autre = 0 pts\n\n` +
      `Humidite :\n` +
      ` > 40 a 60% = 20 pts\n` +
      ` > 30 a 40% ou 60 a 70% = 10 pts\n` +
      ` > Autre = 0 pts\n\n` +
      `CO2 :\n` +
      ` > Moins de 800 ppm = 60 pts\n` +
      ` > Moins de 1000 ppm = 40 pts\n` +
      ` > Moins de 1500 ppm = 15 pts\n` +
      ` > 1500 ppm et plus = 0 pts`
    );
  };

  return (
    <div className="container text-center">
      <h4 className="my-4">Salle Optimale de Job Dating</h4>
      
      <div style={{ marginBottom: "20px" }}>
        <label>Nombre de personnes : </label>
        <input 
          type="number" 
          value={nbPersonnes} 
          onChange={(e) => setNbPersonnes(e.target.value)}
          style={{ marginRight: "10px", marginLeft: "10px" }}
        />
        <button onClick={() => loadMeilleureSalle(nbPersonnes)}>
          Calculer la meilleure salle
        </button>
      </div>

      <table style={{ borderCollapse: "collapse", margin: "0 auto" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "5px" }}>Salle</th>
            <th style={{ border: "1px solid black", padding: "5px" }}>Capacite</th>
            <th style={{ border: "1px solid black", padding: "5px" }}>Temperature</th>
            <th style={{ border: "1px solid black", padding: "5px" }}>Humidite</th>
            <th style={{ border: "1px solid black", padding: "5px" }}>CO2</th>
            <th style={{ border: "1px solid black", padding: "5px" }}>Score</th>
            <th style={{ border: "1px solid black", padding: "5px" }}>Status</th>
            <th style={{ border: "1px solid black", padding: "5px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {resultat && resultat.salle ? (
            <tr style={{ border: "1px solid black" }}>
              <td style={{ border: "1px solid black", padding: "5px" }}>{resultat.salle.nomSalle}</td>
              <td style={{ border: "1px solid black", padding: "5px" }}>{resultat.salle.capacite}</td>
              <td style={{ border: "1px solid black", padding: "5px" }}>
                {resultat.salle.temperature != null ? resultat.salle.temperature : "20 (defaut)"} C
              </td>
              <td style={{ border: "1px solid black", padding: "5px" }}>
                {resultat.salle.humidite != null ? resultat.salle.humidite : "50 (defaut)"} %
              </td>
              <td style={{ border: "1px solid black", padding: "5px" }}>
                {resultat.co2Estime ? Math.round(resultat.co2Estime) : "N/A"} ppm
              </td>
              <td style={{
                border: "1px solid black",
                padding: "5px",
                fontWeight: resultat.score >= 80 ? "bold" : "normal",
                color: resultat.score >= 80 ? "green" : "black"
              }}>
                {resultat.score}%
              </td>
              <td style={{ border: "1px solid black", padding: "5px" }}>{resultat.status}</td>
              <td style={{ border: "1px solid black", padding: "5px" }}>
                <button onClick={() => showDetails(resultat)}>Voir details</button>
              </td>
            </tr>
          ) : (
            <tr style={{ border: "1px solid black" }}>
              <td colSpan="8" style={{ color: "#888", border: "1px solid black", padding: "5px" }}>
                {resultat ? "Aucune salle assez grande pour ce nombre de personnes." : "Entrez un nombre et lancez le calcul."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
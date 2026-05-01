import React, { useState } from "react";
import axios from "axios";
import { GET_SALLE_OPTIMALE_JOBDATING } from "../constants/back";

export default function JobDating() {
  const [nbPersonnes, setNbPersonnes] = useState(25);
  const [heure, setHeure] = useState(10);
  const [resultats, setResultats] = useState([]);

  const loadMeilleureSalle = () => {
    axios.get(GET_SALLE_OPTIMALE_JOBDATING + nbPersonnes + "/" + heure)
      .then((res) => {
        setResultats(Array.isArray(res.data) ? res.data : [res.data]);
      })
      .catch((err) => {
        alert("Erreur lors du chargement : " + err);
      });
  };

  const ouvrirLogs = (res) => {
  const facteurAffluence = nbPersonnes > 0 ? (res.nbPersonnesPresentes / nbPersonnes).toFixed(2) : 0;
    
    // fenetre d'alerte pour les logs ainsi que pour les évolutions horaires qui remplacent le simple détail
    alert(
      `=== DETAIL DES CALCULS - Salle : ${res.salle.nomSalle} ===\n\n` +
      `--- Formules et Constantes ---\n` +
      `Formule CO2 : C = Cext + (N * G * 1 000 000) / (ACH * V)\n` +
      `Formule Bruit : Niveau Sonore = 60 dB + 10 * log10(N)\n` +
      `Constantes : Cext = 400 ppm, G = 0.018 m3/h, V = Surface x 3m\n` +
      `Ventilation (ACH) : Comprise entre 2.0 et 4.0\n\n` +
      `--- Criteres et Scores ---\n` +
      `Affluence (${heure}h) : Prevus=${nbPersonnes} | Facteur=${facteurAffluence} | Presents=${res.nbPersonnesPresentes}\n` +
      `Densite : Capacite=${res.salle.capacite} | Remplissage=${(res.tauxRemplissage * 100).toFixed(1)}% -> ${res.scoreDensite} / 15 pts\n` +
      `Temperature : ${res.salle.temperature != null ? res.salle.temperature : "20 (defaut)"} C -> ${res.scoreTemperature} / 15 pts\n` +
      `Humidite : ${res.salle.humidite != null ? res.salle.humidite : "50 (defaut)"} % -> ${res.scoreHumidite} / 10 pts\n` +
      `Qualite Air (CO2) : ACH=${res.achUtilise.toFixed(2)} | CO2 estime=${res.co2Estime.toFixed(2)} ppm -> ${res.scoreCo2} / 50 pts\n` +
      `Bruit: ${res.niveauSonoreDb.toFixed(2)} dB -> ${res.scoreBruit} / 10 pts\n\n` +
      `=== SCORE FINAL : ${res.score} / 100 (${res.status}) ===`
    );
  };

  const ouvrirEvolution = (res) => {
    // la iste des heures de l'episen qu'on va simuler
    const heures = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    const reponsesEvo = {};
    
    let terminees = 0;
    // on vérifie qu'on a traité toutes les heures avant d'afficher le résultat final
    const verifierFin = () => {
      if (terminees === heures.length) {
        let texte = `=== EVOLUTION HORAIRE - Salle : ${res.salle.nomSalle} ===\n`;
        texte += `Donnees calculees pour ${nbPersonnes} personnes prevues.\n\n`;

        // on boucle pour lire les infos dans l'ordre chronologique des heures
        for (let k = 0; k < heures.length; k++) {
          const rSalle = reponsesEvo[heures[k]];
          if (rSalle != null) {
            texte += `- ${heures[k]}h : ${rSalle.nbPersonnesPresentes} presents | ${Math.round(rSalle.co2Estime)} ppm | ${rSalle.niveauSonoreDb.toFixed(1)} dB | Score: ${rSalle.score} (${rSalle.status})\n`;
          }
        }
        alert(texte);
      }
    };
    // on boucle pour parcourir toutes les heures de notre tableau
    for (let i = 0; i < heures.length; i++) {
      const h = heures[i];
      // si l'heure est la même que l'heure renseignée on réutilise directement
      // les données déjà calculées afin d'éviter les diff dues à des var qui changent comme l'ach et qui impactent le co2
      if (h === parseInt(heure)) { 
        reponsesEvo[h] = res;
        terminees++; 
        verifierFin();
      } else {
        axios.get(GET_SALLE_OPTIMALE_JOBDATING + nbPersonnes + "/" + h)
          .then((reponse) => {
            let trouve = null;

            // on isole la salle sur laquelle on a cliqué parmi celles renvoyées
            for (let j = 0; j < reponse.data.length; j++) {
              if (reponse.data[j].salle.idSalle === res.salle.idSalle) trouve = reponse.data[j];
            }
            reponsesEvo[h] = trouve;
            terminees++; verifierFin();
          })
          .catch((err) => {
            reponsesEvo[h] = null;
            terminees++; verifierFin();
          });
      }
    }
  };

  return (
    <div className="container text-center">
      <h4 className="my-4">Salle Optimale de Job Dating</h4>
      
      <div style={{ marginBottom: "20px" }}>
        <label>Nombre de personnes : </label>
        <input 
          type="number" 
          placeholder="Nombre de personnes"
          value={nbPersonnes} 
          onChange={(e) => setNbPersonnes(e.target.value)}
          style={{ marginRight: "10px", marginLeft: "10px", width: "70px" }}
        />
        
        <label>Heure : </label>
        <input 
          type="number" 
          value={heure} 
          onChange={(e) => setHeure(e.target.value)}
          min="8" max="18"
          style={{ marginRight: "10px", marginLeft: "10px", width: "60px" }}
        />

        <button onClick={() => loadMeilleureSalle()}>
          Calculer la meilleure salle
        </button>
      </div>

      <table style={{ borderCollapse: "collapse", margin: "0 auto" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "5px" }}>Salle</th>
            <th style={{ border: "1px solid black", padding: "5px" }}>Capacite</th>
            <th style={{ border: "1px solid black", padding: "5px" }}>Presents</th>
            <th style={{ border: "1px solid black", padding: "5px" }}>Densite</th>
            <th style={{ border: "1px solid black", padding: "5px" }}>Temperature</th>
            <th style={{ border: "1px solid black", padding: "5px" }}>Humidite</th>
            <th style={{ border: "1px solid black", padding: "5px" }}>Bruit</th>
            <th style={{ border: "1px solid black", padding: "5px" }}>CO2</th>
            <th style={{ border: "1px solid black", padding: "5px" }}>Score</th>
            <th style={{ border: "1px solid black", padding: "5px" }}>Status</th>
            <th style={{ border: "1px solid black", padding: "5px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {resultats.length > 0 ? (
            resultats.map((res, index) => (
              <tr key={index} style={{ border: "1px solid black" }}>
                <td style={{ border: "1px solid black", padding: "5px" }}>{res.salle.nomSalle}</td>
                <td style={{ border: "1px solid black", padding: "5px" }}>{res.salle.capacite}</td>
                <td style={{ border: "1px solid black", padding: "5px" }}>{res.nbPersonnesPresentes}</td>
                <td style={{ border: "1px solid black", padding: "5px" }}>{(res.tauxRemplissage * 100).toFixed(1)} %</td>
                
                <td style={{ border: "1px solid black", padding: "5px" }}>
                  {res.salle.temperature != null ? res.salle.temperature : "20 (defaut)"} C
                </td>
                <td style={{ border: "1px solid black", padding: "5px" }}>
                  {res.salle.humidite != null ? res.salle.humidite : "50 (defaut)"} %
                </td>
                
                <td style={{ border: "1px solid black", padding: "5px" }}>{res.niveauSonoreDb.toFixed(1)} dB</td>
                <td style={{ border: "1px solid black", padding: "5px" }}>
                  {res.co2Estime ? Math.round(res.co2Estime) : "N/A"} ppm
                </td>
                <td style={{
                  border: "1px solid black",
                  padding: "5px",
                  fontWeight: res.score >= 80 ? "bold" : "normal",
                  color: res.score >= 80 ? "green" : (res.score < 50 ? "red" : "black")
                }}>
                  {res.score}
                </td>
                <td style={{ border: "1px solid black", padding: "5px" }}>{res.status}</td>
                <td style={{ border: "1px solid black", padding: "5px" }}>
                  <button onClick={() => ouvrirLogs(res)} style={{ marginRight: "5px" }}>Voir logs</button>
                  <button onClick={() => ouvrirEvolution(res)}>Voir evolution</button>
                </td>
              </tr>
            ))
          ) : (
            <tr style={{ border: "1px solid black" }}>
              <td colSpan="11" style={{ color: "#888", border: "1px solid black", padding: "5px" }}>
                Entrez un nombre et une heure, puis lancez le calcul.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import axios from "axios";
import { GET_OFFRES } from "../constants/back";

export default function Offres() {
  const [offres, setOffres] = useState([]);
  const [studentId, setStudentId] = useState(1);

  // Récupère les offres pour un étudiant donné
  const loadOffres = (id) => {
    axios.get(GET_OFFRES + id)
      .then((res) => {
        setOffres(res.data); // On stocke les offres dans le state
      })
      .catch((err) => {
        alert("Erreur lors du chargement : " + err);
      });
  };

  // Charger les offres au démarrage
  useEffect(() => {
    loadOffres(studentId);
  }, []);

  // Affiche les détails d'une offre dans une fenêtre alert
  const showDetails = (offre) => {
    const d = offre.details;
    alert(
      `=== DÉTAIL DU SCORE ===\n` +
      `Score total : ${offre.score.toFixed(2)}/100\n` +
      `Status : ${offre.status}\n\n` +
      `--- Points par critère ---\n` +
      `Filière : ${d.Filière} pts\n` +
      `Niveau : ${d.Niveau} pts\n` +
      `Durée : ${d.Durée} pts\n` +
      `Distance : ${d.Distance} pts (${offre.distanceKm.toFixed(2)} km)\n` +
      `Compétences : ${d.Compétences.toFixed(2)} pts`
    );
  };

  return (
    <div className="container text-center">
      <h4 className="my-4">Matching des Offres</h4>
      <div style={{ marginBottom: "20px" }}>
        <label>ID Étudiant : </label>
        <input 
          type="number" 
          value={studentId} 
          onChange={(e) => setStudentId(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={() => loadOffres(studentId)}>
          Calculer le Matching
        </button>
      </div>
      <table style={{ borderCollapse: "collapse", margin: "0 auto" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "5px" }}>Entreprise</th>
            <th style={{ border: "1px solid black", padding: "5px" }}>Titre</th>
            <th style={{ border: "1px solid black", padding: "5px" }}>Score</th>
            <th style={{ border: "1px solid black", padding: "5px" }}>Status</th>
            <th style={{ border: "1px solid black", padding: "5px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {offres.length > 0 ? (
            offres.map((offre, index) => (
              <tr key={index} style={{ border: "1px solid black" }}>
                <td style={{ border: "1px solid black", padding: "5px" }}>{offre.offre.entreprise}</td>
                <td style={{ border: "1px solid black", padding: "5px" }}>{offre.offre.titre}</td>
                <td style={{
                  border: "1px solid black",
                  padding: "5px",
                  fontWeight: offre.score >= 80 ? "bold" : "normal",
                  color: offre.score >= 80 ? "green" : "black"
                }}>
                  {Math.round(offre.score)}%
                </td>
                <td style={{ border: "1px solid black", padding: "5px" }}>{offre.status}</td>
                <td style={{ border: "1px solid black", padding: "5px" }}>
                  <button onClick={() => showDetails(offre)}>Voir détails</button>
                </td>
              </tr>
            ))
          ) : (
            <tr style={{ border: "1px solid black" }}>
              <td colSpan="5" style={{ color: "#888", border: "1px solid black", padding: "5px" }}>
                Aucune offre trouvée pour cet ID.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

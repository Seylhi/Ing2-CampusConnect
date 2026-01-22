import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Salle.css";
import { GET_SALLES, LOCAL_HOST_SALLE } from "../constants/back";

export default function Salle() {
  const [salles, setSalles] = useState([]);
  const [scoreResults, setScoreResults] = useState({});

  // Charger les salles
  const loadSalles = async () => {
    axios
      .get(GET_SALLES)    // c'est via le GET qu'on va pouvoir récuperer les salles
      .then((response) => {
        setSalles(response.data);
        loadScores(response.data);
      })
      .catch((error) => {
        alert("Erreur lors du chargement des salles : " + error);
      });
  };

  // Charger les scores énergétiques
  const loadScores = (sallesData) => {
    sallesData.forEach((salle) => {
      axios
        .get(`${LOCAL_HOST_SALLE}score/${salle.idSalle}`)
        .then((res) => {
          setScoreResults((prev) => ({
            ...prev,
            [salle.idSalle]: res.data,
          }));
        })
        .catch((err) => {
          console.error("Erreur chargement score:", err);
          setScoreResults((prev) => ({
            ...prev,
            [salle.idSalle]: null,
          }));
        });
    });
  };

  useEffect(() => {
    loadSalles();
  }, []);

  if (salles.length === 0)    // au début, j'ai essayé avec isEmpty() mais non gérer dans JS
    return <div className="container text-center">No salles</div>;

  // Fonction pour retourner la lettre selon le score
  const getEnergyLetter = (score) => {
    if (score >= 85) return "A";
    if (score >= 70) return "B";
    if (score >= 50) return "C";
    if (score >= 30) return "D";
    return "E";
  };

  // Tableau avec les salles et leurs scores
  return (
    <div className="container text-center">
      <h4 className="mx-2">Liste des salles de l'école</h4>
      <div className="row">
        <table className="table table-sm table-bordered table-hover">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nom</th>
              <th>Capacité</th>
              <th>TP</th>
              <th>Surface</th>
              <th>Fenêtres</th>
              <th>Orientation</th>
              <th>Chauffage</th>
              <th>Score énergétique</th>
            </tr>
          </thead>

          <tbody>
            {salles.map((salle, index) => {
              const result = scoreResults[salle.idSalle];
              const d = result?.details || {};
              const letter =
                result?.score != null ? getEnergyLetter(result.score) : "";

              return (
                <tr key={index}>
                  <td>{salle.idSalle}</td>
                  <td>{salle.nomSalle}</td>
                  <td>{salle.capacite}</td>
                  <td>{salle.estSalleTp ? "Oui" : "Non"}</td>
                  <td>{salle.surfaceM2} m²</td>
                  <td>{salle.nbFenetres}</td>
                  <td>{salle.orientation}</td>
                  <td>{salle.chauffage ? "Oui" : "Non"}</td>

                  <td>
                    {result?.score != null
                      ? `${result.score.toFixed(2)} (${letter})`
                      : "Chargement..."}

                    {result && (
                      <button
                        className="btn btn-sm btn-warning ms-2" // permet de mettre le bouton en jaune
                        onClick={() => {
                          alert(
                            `Score final : ${result.score != null ? result.score.toFixed(2) : "N/A"} / 100 (${letter})
Interprétation : ${result.score != null
                              ? result.score >= 75
                                ? "Salle très économe en énergie"
                                : result.score >= 50
                                  ? "Consommation modérée"
                                  : result.score >= 25
                                    ? "Salle énergivore"
                                    : "Salle très énergivore"
                              : "N/A"
                            }

Données brutes
Surface : ${d.surface != null ? d.surface : "N/A"} m²
Fenêtres : ${d.fenetres != null ? d.fenetres : "N/A"}
Orientation (coef) : ${d.orientationCoef != null ? d.orientationCoef : "N/A"}
Chauffage : ${d.chauffage === 1 ? "Oui" : d.chauffage === 0 ? "Non" : "N/A"}

Normalisation
SurfaceNorm = ${d.surfaceNorm != null ? d.surfaceNorm.toFixed(2) : "N/A"}
FenêtresNorm = ${d.fenetresNorm != null ? d.fenetresNorm.toFixed(2) : "N/A"}

Pondération
(1 - SurfaceNorm) × 0.40 = ${d.contribSurface != null ? d.contribSurface.toFixed(3) : "N/A"}
FenêtresNorm × 0.30 = ${d.contribFen != null ? d.contribFen.toFixed(3) : "N/A"}
OrientationCoef × 0.20 = ${d.contribOrient != null ? d.contribOrient.toFixed(3) : "N/A"}
(1 - Chauffage) × 0.10 = ${d.contribChauffage != null ? d.contribChauffage.toFixed(3) : "N/A"}

Formule finale :
Score = (Σ contributions) × 100

Calcul effectué le : ${result.calculationTime
                              ? new Date(
                                result.calculationTime,
                              ).toLocaleString()
                              : "N/A"
                            }`,
                          );
                        }}
                      // Ci-dessus, on a détaillé rapidement le calcul en affichant une alerte
                      >
                        Détails
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="text-center mt-4">
          <button
            className="btn btn-primary"
            onClick={() => window.open("/docs/norms.pdf")}
          >
            Documentation - normalisation et du calcul de score
          </button>
        </div>
      </div>
    </div>
  );
}

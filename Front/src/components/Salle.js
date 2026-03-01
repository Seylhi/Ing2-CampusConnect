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

  // Fonction pour retourner la lettre selon le score énergétique
  const getEnergyLetter = (score) => {
    if (score >= 85) return "A";
    if (score >= 70) return "B";
    if (score >= 50) return "C";
    if (score >= 30) return "D";
    return "E";
  };

  // Fonction pour retourner la lettre selon le score de confort
  const getComfortLetter = (score) => {
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
              <th>Score confort</th>
            </tr>
          </thead>

          <tbody>
            {salles.map((salle, index) => {
              const result = scoreResults[salle.idSalle];
              const dE = result?.detailsEnergie || {};  // on renomme notre varaible "d"
              // pour acceuillir confort également
              const dC = result?.detailsConfort || {};

              const energyLetter =
                result?.scoreEnergie != null ? getEnergyLetter(result.scoreEnergie) : "";

              const confortLetter =
                result?.scoreConfort != null ? getComfortLetter(result.scoreConfort) : "";

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
                    {result?.scoreEnergie != null
                      ? `${result.scoreEnergie.toFixed(0)} (${energyLetter})`
                      : "Chargement..."}

                    {result && (
                      <button
                        className="btn btn-sm btn-warning ms-2" // permet de mettre le bouton en jaune
                        onClick={() => {
                          alert(
                            `Score final : ${result.scoreEnergie != null ? result.scoreEnergie.toFixed(0) : "N/A"} / 100 (${energyLetter})
Interprétation : ${result.scoreEnergie != null
                              ? result.scoreEnergie >= 75
                                ? "Salle très économe en énergie"
                                : result.scoreEnergie >= 50
                                  ? "Consommation modérée"
                                  : result.scoreEnergie >= 25
                                    ? "Salle énergivore"
                                    : "Salle très énergivore"
                              : "N/A"
                            }

Données brutes
Surface : ${dE.surface != null ? dE.surface : "N/A"} m²
Fenêtres : ${dE.fenetres != null ? dE.fenetres : "N/A"}
Orientation (coef) : ${dE.orientationCoef != null ? dE.orientationCoef : "N/A"}
Chauffage : ${dE.chauffage === 1 ? "Oui" : dE.chauffage === 0 ? "Non" : "N/A"}

Normalisation
SurfaceNorm = ${dE.surfaceNorm != null ? dE.surfaceNorm.toFixed(0) : "N/A"}
FenêtresNorm = ${dE.fenetresNorm != null ? dE.fenetresNorm.toFixed(0) : "N/A"}

Pondération
(1 - SurfaceNorm) × 0.40 = ${dE.contribSurface != null ? dE.contribSurface.toFixed(3) : "N/A"}
FenêtresNorm × 0.30 = ${dE.contribFen != null ? dE.contribFen.toFixed(3) : "N/A"}
OrientationCoef × 0.20 = ${dE.contribOrient != null ? dE.contribOrient.toFixed(3) : "N/A"}
(1 - Chauffage) × 0.10 = ${dE.contribChauffage != null ? dE.contribChauffage.toFixed(3) : "N/A"}

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

                  <td>
                    {result?.scoreConfort != null
                      ? `${result.scoreConfort.toFixed(0)} (${confortLetter})`
                      : "Chargement..."}

                    {result && (
                      <button
                        className="btn btn-sm btn-warning ms-2" // permet de mettre le bouton en jaune
                        onClick={() => {
                          alert(
                            `Score confort : ${result.scoreConfort.toFixed(0)} / 100
Interprétation : ${confortLetter}

Données brutes
Température : ${salle.temperature ?? "N/A"} °C
Humidité : ${salle.humidite ?? "N/A"} %
Capacité : ${salle.capacite ?? "N/A"} personnes
Surface : ${salle.surfaceM2 ?? "N/A"} m²
Fenêtres : ${salle.nbFenetres ?? "N/A"}
Orientation : ${salle.orientation ?? "N/A"}
Type salle TP : ${salle.estSalleTp ? "Oui" : "Non"}

Pondération
Température = ${dC.scoreTemperature ?? "N/A"} / 30
Humidité = ${dC.scoreHumidite ?? "N/A"} / 20
Densité = ${dC.scoreDensite ?? "N/A"} / 20
Luminosité = ${dC.scoreLuminosite ?? "N/A"} / 15
Type salle = ${dC.scoreTypeSalle ?? "N/A"} / 15

Formule finale :
Score confort = Somme des contributions`
                          );

                        }}
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

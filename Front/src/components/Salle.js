import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Salle.css";
import { GET_SALLES, LOCAL_HOST_SALLE } from "../constants/back";

export default function Salle() {
  const [salles, setSalles] = useState([]);
  const [scoreResults, setScoreResults] = useState({});
  // Implémentation de nos nouvelles constantes afin de gérer l'attribution des salles
  const [nbPersonnes, setNbPersonnes] = useState();
  const [tp, setTp] = useState(false);
  const [calculResults, setCalculResults] = useState([]);

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
          console.error("Erreur chargement du score énergétique :", err);
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

  // Fonction pour retourner la lettre selon le score global, même principe 
  // que pour les autres scores
  const getGlobalLetter = (score) => {
    if (score >= 85) return "A";
    if (score >= 70) return "B";
    if (score >= 50) return "C";
    if (score >= 30) return "D";
    return "E";
  };

  // Permets de mettre en place notre attribution de salle à venir
  const calcSalles = async () => {
    axios
      .get(`${LOCAL_HOST_SALLE}forms?nbPersonnes=${nbPersonnes}&tp=${tp}`)
      .then((res) => {
        setCalculResults(res.data);
        loadScores(res.data);
        // on se base sur la méthode précédente, 
        // pour avoir les mêmes datas
      })
      .catch((err) => {
        alert("Erreur lors du calcul d'attribution : " + err);
      });
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
              <th>Température</th>
              <th>Humidité</th>
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
                  <td>{salle.capacite} personnes</td>
                  <td>{salle.estSalleTp ? "Oui" : "Non"}</td>
                  <td>{salle.surfaceM2} m²</td>
                  <td>{salle.nbFenetres}</td>
                  <td>{salle.orientation}</td>
                  <td>{salle.chauffage ? "Oui" : "Non"}</td>
                  <td>{result?.temperature} °C</td>
                  <td>{result?.humidite} %</td>

                  <td>
                    {result?.scoreEnergie != null
                      ? `${result.scoreEnergie.toFixed(0)} (${energyLetter})`
                      : "Chargement..."}

                    {result && (
                      <button
                        className="btn btn-sm btn-warning ms-2" // permet de mettre le bouton en jaune
                        onClick={() => {
                          alert(
                            `Score énergétique : ${result.scoreEnergie != null ? result.scoreEnergie.toFixed(0) : "N/A"} / 100 (${energyLetter})
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
Coefficient météo : ${result.coefMeteo ?? "N/A"}

Normalisation & Pondération
Surface normalisée : ${dE.surfaceNorm != null ? dE.surfaceNorm.toFixed(2) : "N/A"}
Fenêtres normalisées : ${dE.fenetresNorm != null ? dE.fenetresNorm.toFixed(2) : "N/A"}
Contribution Surface : (1 - SurfaceNorm (${dE.surfaceNorm.toFixed(2)})) × 0.30 = ${dE.contribSurface != null ? dE.contribSurface.toFixed(2) : "N/A"}
Contribution Fenêtres : FenêtresNorm (${dE.fenetresNorm.toFixed(2)}) × 0.25 × CoefMétéo = ${dE.contribFen != null ? dE.contribFen.toFixed(2) : "N/A"}
Contribution Orientation : OrientationCoef (${dE.orientationCoef.toFixed(2)}) × 0.20 × CoefMétéo (${result.coefMeteo.toFixed(2)})= ${dE.contribOrient != null ? dE.contribOrient.toFixed(2) : "N/A"}
Contribution Chauffage : (1 - Chauffage (${dE.chauffage.toFixed(2)})) × 0.25 × CoefTemp = ${dE.contribChauffage != null ? dE.contribChauffage.toFixed(2) : "N/A"}

Formule finale :
Score final après vacances = Score énergétique brut (${result.scoreEnergie.toFixed(2)}) × CoefVacances (${result.coefVacances.toFixed(2)})

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
Interprétation : ${result.scoreConfort != null
                              ? result.scoreConfort >= 75
                                ? "Salle très confortable"
                                : result.scoreConfort >= 50
                                  ? "Salle assez confortable"
                                  : result.scoreConfort >= 25
                                    ? "Salle peu confortable"
                                    : "Salle non confortable"
                              : "N/A"
                            }

Données brutes
Température : ${result.temperature ?? "N/A"} °C
Humidité : ${result.humidite ?? "N/A"} %
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
Score confort = Somme des contributions

Calcul effectué le : ${result.calculationTime
                              ? new Date(
                                result.calculationTime,
                              ).toLocaleString()
                              : "N/A"
                            }`,
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

        <div className="mb-3">
          <h5>Calcul de salle - en fonction de l'occupation prévue</h5>

          <input
            type="number"
            placeholder="Nombre de personnes" // Valeur dans notre case pour renseigner la valeur à enregistrer 
            value={nbPersonnes}
            onChange={(e) => setNbPersonnes(e.target.value)}
          />

          <label className="ms-2">
            Salle de TP
            <input
              className="ms-2" // permet de mettre une marge et rendre la box plus visible
              type="checkbox"
              checked={tp}
              onChange={(e) => setTp(e.target.checked)}
            />
          </label>

          <button className="btn btn-secondary ms-2" onClick={calcSalles}>
            Calculer
          </button>
        </div>

        <button
          // Ce bouton remet tous les paramètres dans leur format initial
          className="btn btn-outline-secondary"
          onClick={() => {
            setCalculResults([]);
            setNbPersonnes("");
            setTp(false);
          }}
        >
          Réinitialiser
        </button>
        {calculResults.length > 0 && (
          // on affiche le tableau si on a des éléments sont présents dans notre result
          <div className="mt-4">
            <h5>Résultat du calcul global en fonction de l'occupation </h5>

            <table className="table table-sm table-bordered">
              <thead>
                <tr>
                  <th>Salle</th>
                  <th>Score énergétique</th>
                  <th>Score confort</th>
                  <th>Score global</th>
                </tr>
              </thead>

              <tbody>
                {calculResults
                  .sort((a, b) => {
                    // basée sur une méthode Array que j'ai trouvé sur un forum qui permet d'étudier deux éléments qui 
                    // se suivent dans une liste. Si la soustraction de A et B est positive alors, décroissant !
                    const A = (scoreResults[a.idSalle]?.scoreEnergie) + (scoreResults[a.idSalle]?.scoreConfort);
                    const B = (scoreResults[b.idSalle]?.scoreEnergie) + (scoreResults[b.idSalle]?.scoreConfort);
                    return B - A;
                  })

                  .map((salle) => {
                    const result = scoreResults[salle.idSalle];
                    const energyScore = result?.scoreEnergie;
                    const confortScore = result?.scoreConfort;
                    const globalScore = (result.scoreEnergie + result.scoreConfort) / 2;
                    const energyLetter = getEnergyLetter(energyScore);
                    const confortLetter = getComfortLetter(confortScore);
                    const globalLetter = getGlobalLetter(globalScore);

                    return (
                      <tr key={salle.idSalle}>
                        <td>{salle.nomSalle}</td>
                        <td>{energyScore ? `${energyScore.toFixed(0)} (${energyLetter})` : "N/A"}</td>
                        <td>{confortScore ? `${confortScore.toFixed(0)} (${confortLetter})` : "N/A"}</td>
                        <td>{globalScore ? `${globalScore.toFixed(0)} (${globalLetter})` : "N/A"}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
        <button
          className="btn btn-secondary mt-4 mb-4"
          // on a rajouté une marge en bas pour rendre le bouton 
          // plus visible, avant il était collé au bas de la page ...
          onClick={() => window.open("/docs/norms.pdf")}
        >
          Documentation - normalisation et du calcul de score
        </button>
      </div>
    </div>
  );
}

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
  // Constantes pour la fenetre de log au lieu de faire des alertes
  const [logWindow, setLogWindow] = useState(null);


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

  // On cree notre fenetre qui acceuillera nos logs
  useEffect(() => {
    if (!logWindow) return;
    const interval = setInterval(() => {
      axios.get(`${LOCAL_HOST_SALLE}logs`).then((res) => {
        if (!logWindow.closed) {
          logWindow.document.body.innerHTML = res.data.join("<br/>");
        }
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [logWindow]);

  const ouvrirLogs = () => {
    const win = window.open("", "logsWindow", "width=700,height=500");
    setLogWindow(win);
  };

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
              <th>Score CO²</th>
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

                    {/* Retrait des alerts et des boutons afin de, clarifier notre tableau qui était tout plein de boutons, et également mettre tous les logs dans une nouvelle fenetre 
                    --> demandé par M. Brenner*/}

                  </td>

                  <td>
                    {result?.scoreConfort != null
                      ? `${result.scoreConfort.toFixed(0)} (${confortLetter})`
                      : "Chargement..."}
                  </td>

                  <td>
                    {result?.scoreCO2 != null ? `${result.scoreCO2} / 100` : "N/A"}
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mb-5">
          <button className="btn btn-warning" onClick={ouvrirLogs}>
            Voir les détails de calcul
          </button>
        </div>

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
                  <th>Capacité</th>
                  <th>TD</th>
                  <th>Score énergétique</th>
                  <th>Score confort</th>
                  <th>Score CO²</th>
                  <th>Score global</th>
                </tr>
              </thead>

              <tbody>
                {calculResults
                  .sort((a, b) => {
                    // basée sur une méthode Array que j'ai trouvé sur un forum qui permet d'étudier deux éléments qui 
                    // se suivent dans une liste. Si la soustraction de A et B est positive alors, décroissant !
                    const A = (scoreResults[a.idSalle]?.scoreEnergie) + (scoreResults[a.idSalle]?.scoreConfort) + (scoreResults[a.idSalle]?.scoreCO2);
                    const B = (scoreResults[b.idSalle]?.scoreEnergie) + (scoreResults[b.idSalle]?.scoreConfort) + (scoreResults[b.idSalle]?.scoreCO2);
                    return B - A;
                  })

                  .map((salle) => {
                    const result = scoreResults[salle.idSalle];
                    const energyScore = result?.scoreEnergie;
                    const confortScore = result?.scoreConfort;
                    const CO2Score = result?.scoreCO2;
                    const globalScore = (result.scoreEnergie + result.scoreConfort + result.scoreCO2) / 3;
                    const energyLetter = getEnergyLetter(energyScore);
                    const confortLetter = getComfortLetter(confortScore);
                    const globalLetter = getGlobalLetter(globalScore);

                    return (
                      <tr key={salle.idSalle}>
                        <td>{salle.nomSalle}</td>
                        <td>{salle.capacite} personnes</td>
                        <td>{salle.estSalleTp ? "Oui" : "Non"}</td>
                        {/* Le != permet de dire que cette valeur ne peut etre nulle ou non defini et force 
                        donc l'affichage, même du 0*/}
                        <td>{energyScore != null ? `${energyScore.toFixed(0)} (${energyLetter})` : "N/A"}</td>
                        <td>{confortScore != null ? `${confortScore.toFixed(0)} (${confortLetter})` : "N/A"}</td>
                        <td>{CO2Score != null ? `${CO2Score.toFixed(0)} / 100` : "N/A"}</td>
                        <td>{globalScore != null ? `${globalScore.toFixed(0)} (${globalLetter})` : "N/A"}</td>
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

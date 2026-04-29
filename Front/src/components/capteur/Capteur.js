import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Capteur.css";

import { GET_CAPTEURS, LOCAL_HOST_CAPTEUR, LOCAL_HOST } from "../../constants/back";

import ListeCapteur from "./ListeCapteur";
import ScoreDetails from "./ScoreDetails";
import Alertes from "./Alertes";
import Monitoring from "./Monitoring";
import Historique from "./Historique";

export default function Capteur() {

  const [capteurs, setCapteurs] = useState([]);
  const [resultatsScores, setResultatsScores] = useState({});
  const [capteurSelectionne, setCapteurSelectionne] = useState(null);
  const [scoreSelectionne, setScoreSelectionne] = useState(null);
  const [donneesAlertes, setDonneesAlertes] = useState([]);
  const [capteurHistorique, setCapteurHistorique] = useState(null);

 const activerChauffage = async (idSalle) => {
  try {
    await axios.post(`${LOCAL_HOST}/capteur/salle/${idSalle}/chauffage/on`);

    const nouveauxCapteurs = capteurs.map((c) => {
      if (c.idSalle === idSalle) {
        c.chauffageOn = true;  
      }
      return c;
    });

    setCapteurs(nouveauxCapteurs);

  } catch (error) {
    console.log("Erreur lors de l'activation du chauffage");
  }
};

  const chargerCapteurs = async () => {
    try {
      const reponse = await axios.get(GET_CAPTEURS);
      const donnees = reponse.data;
      setCapteurs(donnees);

      const salles = [];
      for (let i = 0; i < donnees.length; i++) {
        const idSalle = donnees[i].idSalle;

        if (!salles.includes(idSalle)) {
          salles.push(idSalle);
        }
      }
      const nouveauxResultats = {};
      for (let i = 0; i < salles.length; i++) {
        const idSalle = salles[i];
        let score;

        try {
          const reponseScore = await axios.get(
            LOCAL_HOST + "/salle/scoreCapteur/" + idSalle
          );
          score = reponseScore.data;
        } catch (erreur) {
          score = { status: "Erreur" };
        }

        nouveauxResultats[idSalle] = score;
      }

      setResultatsScores(nouveauxResultats);

    } catch (erreur) {
      console.error("Erreur lors du chargement des capteurs :", erreur);
    }
  };

  const confirmerSuppressionCapteur = async (id) => {
    if (window.confirm("Es-tu sûr ?")) {
      await axios.delete(LOCAL_HOST_CAPTEUR + id);
      chargerCapteurs();
    }
  };

  const chargerAlertes = async (idCapteur) => {
    const reponse = await axios.get(`${LOCAL_HOST}/alerte/capteur/${idCapteur}`);
    setDonneesAlertes(reponse.data);
  };

  useEffect(() => {
    chargerCapteurs();
  }, []);

  if (capteurs.length === 0)
    return <div className="container text-center mt-4">Aucun capteur trouvé</div>;

  const capteursParSalle = capteurs.reduce((accumulateur, capteur) => {
    if (!accumulateur[capteur.idSalle]) accumulateur[capteur.idSalle] = [];
    accumulateur[capteur.idSalle].push(capteur);
    return accumulateur;
  }, {});

  return (
    <div className="container mt-4">
      <Monitoring resultatsScore={resultatsScores} />

      <h4 className="mt-4 mb-3 text-center">Liste des capteurs</h4>

      <table className="table table-sm table-bordered table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>Id Salle</th>
            <th>Humidité</th>
            <th>Température</th>
            <th>Présence</th>
            <th>Date mesure</th>
            <th>Fenêtre</th>
            <th>Porte</th>
            <th>Chauffage</th>
            <th>Status Salle</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody className="table-group-divider">
          {Object.entries(capteursParSalle).map(([idSalle, capteursSalle]) => (
            <React.Fragment key={idSalle}>
              <tr className="table-secondary">
                <td colSpan="11" className="fw-bold text-center">
                  Salle {idSalle}
                </td>
              </tr>

              {capteursSalle.map(capteur => (
                <ListeCapteur
                  key={capteur.id}
                  capteur={capteur}
                  resultat={resultatsScores[capteur.idSalle]}
                  onSupprimer={confirmerSuppressionCapteur}
                  onActiverChauffage={activerChauffage}
                  onAfficherDetails={(c, r) => {
                    setCapteurSelectionne(c);
                    setScoreSelectionne(r);
                  }}
                  onAfficherAlertes={chargerAlertes}
                  onAfficherHistorique={(c) => setCapteurHistorique(c)}
                />
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <ScoreDetails
        capteur={capteurSelectionne}
        resultat={scoreSelectionne}
        fermer={() => setScoreSelectionne(null)}
      />

      <Alertes
        alertes={donneesAlertes}
        fermer={() => setDonneesAlertes([])}
      />
      <Historique
        capteur={capteurHistorique}
        fermer={() => setCapteurHistorique(null)}
      />
    </div>
  );
}
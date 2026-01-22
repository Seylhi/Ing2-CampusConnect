import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Capteur.css";
import {
  GET_CAPTEURS,
  LOCAL_HOST_CAPTEUR,
  UPDATE_CAPTEURS,
  LOCAL_HOST,
} from "../constants/back";

export default function Capteur() {
  const [capteurs, setCapteurs] = useState([]);
  const [scoreResults, setScoreResults] = useState({}); 
  const [alertes, setAlertes] = useState([]);


  // Charger tous les capteurs
  const setCapteurData = async () => {
    axios
      .get(GET_CAPTEURS)
      .then((response) => {
        setCapteurs(response.data);
        loadScores(response.data);
      })
      .catch((error) => {
        alert("Error occurred while loading data: " + error);
      });
  };

  const loadScores = (capteursData) => {
    const salles = [...new Set(capteursData.map((c) => c.idSalle))];
    salles.forEach((idSalle) => {
      axios
        .get(`${LOCAL_HOST}/salle/scoreCapteur/${idSalle}`)
        .then((res) => {
          setScoreResults((prev) => ({ ...prev, [idSalle]: res.data }));
        })
        .catch((err) => {
          console.error("Erreur lors du chargement du score:", err);
          setScoreResults((prev) => ({ ...prev, [idSalle]: {status: "Erreur"} }));
        });
    });
  };

  const confirmRemoveCapteur = (id) => {
    if (window.confirm("Es-tu sur?")) removeCapteur(id);
  };

  const removeCapteur = async (id) => {
    axios
      .delete(LOCAL_HOST_CAPTEUR + id)
      .then(() => setCapteurData())
      .catch((error) => alert("Error occurred in removeCapteur: " + error));
  };

  // Changer la date localement
  const handleChangeDate = (idCapteur, newDate) => {
    setCapteurs((prevData) =>
      prevData.map((row) =>
        row.id === idCapteur ? { ...row, dateMesure: newDate } : row
      )
    );
  };

  // Mettre à jour la date sur le serveur
  const updateDate = async (capteur) => {
    axios
      .post(UPDATE_CAPTEURS, capteur)
      .then(() => setCapteurData())
      .catch((error) => alert("Error occurred in updateDate: " + error));
  };
//alerte
  const loadAlertes = (idCapteur) => {
  axios
    .get(`${LOCAL_HOST}/alerte/capteur/${idCapteur}`)
    .then((res) => {
      if (res.data.length === 0) {
        alert("Aucune alerte active pour ce capteur ");
        return;
      }

      const message = res.data
        .map(
          (a) =>
            `• [${a.type}] ${a.message}\n  (${new Date(a.dateAlerte).toLocaleString()})`
        )
        .join("\n\n");

      alert(
        `ALERTES ACTIVES (Capteur ${idCapteur})\n\n${message}`
      );
    })
    .catch((err) => {
      alert("Erreur lors du chargement des alertes");
      console.error(err);
    });
};


  useEffect(() => {
    setCapteurData();
  }, []);

  if (capteurs.length === 0)
    return <div className="container text-center">No capteurs</div>;

  return (
    <div className="container text-center">
      <h4 className="mx-2">Liste des capteurs</h4>
      <div className="row">
        <table className="table table-sm table-bordered table-hover">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Id Salle</th>
              <th scope="col">Température</th>
              <th scope="col">Humidité</th>
              <th scope="col">Présence</th>
              <th scope="col">Date mesure</th>
              <th scope="col">Fenêtre ouverte</th>
              <th scope="col">Porte ouverte</th>
              <th scope="col">Chauffage</th>
              <th scope="col">Status Salle</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {capteurs.map((capteur, index) => {
              const result = scoreResults[capteur.idSalle];
              return (
                <tr key={index}>
                  <th scope="row">{capteur.id}</th>
                  <td>{capteur.idSalle}</td>
                  <td>{capteur.temperature}</td>
                  <td>{capteur.humidite}</td>
                  <td>{capteur.presence ? "Oui" : "Non"}</td>
                  <td>
                    <div className="input-group mb-3">
                      <input
                        type="date"
                        className="form-control"
                        aria-describedby="button-addon2"
                        value={capteur.dateMesure?.substring(0, 10)}
                        onChange={(e) =>
                          handleChangeDate(capteur.id, e.target.value)
                        }
                      />
                      <button
                        className="btn btn-outline-primary"
                        type="button"
                        id="button-addon2"
                        onClick={() => updateDate(capteur)}
                      >
                        Save
                      </button>
                    </div>
                  </td>
                  <td>{capteur.fenetreOuverte ? "Oui" : "Non"}</td>
                  <td>{capteur.porteOuverte ? "Oui" : "Non"}</td>
                  <td>{capteur.chauffageOn ? "Oui" : "Non"}</td>
                  <td>
                    {result?.status || "Chargement..."}
                    {result && (
                      <button
                        className="btn btn-sm btn-outline-info ms-2"
                        onClick={() => {
                          const d = result.details;

                          // Valeurs réelles et calculs
                          const valeurTemp = capteur.temperature;
                          const idealTemp = 21;
                          const toleranceTemp = 10;
                          const scoreTemp = Math.max(0, Math.min(1, 1 - Math.abs(valeurTemp - idealTemp) / toleranceTemp));

                          const valeurHum = capteur.humidite;
                          const idealHum = 45;
                          const toleranceHum = 50;
                          const scoreHum = Math.max(0, Math.min(1, 1 - Math.abs(valeurHum - idealHum) / toleranceHum));

                          alert(
                            `===== DÉTAIL DU CALCUL =====\n` +
                            `Score total: ${result.score.toFixed(2)}\n` +
                            `Status: ${result.status}\n\n` +
                            `--- Calcul par critère ---\n` +
                            `Température: ${d.temperature.toFixed(2)} → pondéré 50%\n` +
                            `  (valeur réelle: ${valeurTemp}°C)\n` +
                            `  formule: 1 - (|${valeurTemp} - ${idealTemp}| / ${toleranceTemp}) = ${scoreTemp.toFixed(2)}\n` +
                            `  21°C = température idéale, 10 = tolérance max pour que le score tombe à 0\n` +
                            `Humidité: ${d.humidite.toFixed(2)} → pondéré 30%\n` +
                            `  (valeur réelle: ${valeurHum}%)\n` +
                            `  formule: 1 - (|${valeurHum} - ${idealHum}| / ${toleranceHum}) = ${scoreHum.toFixed(2)}\n` +
                            `  45% = humidité idéale, 50 = tolérance max pour que le score tombe à 0\n` +
                            `Chauffage: ${d.chauffage.toFixed(2)} → pondéré 20%\n\n` +
                            `--- Formule du score ---\n` +
                            `scoreCapteur = scoreTemp*0.5 + scoreHum*0.3 + scoreChauffage*0.2\n` +
                            `scoreSalle = moyenne(scoreCapteur pour tous les capteurs)\n\n` +
                            `--- Interprétation du status ---\n` +
                            `Score >= 0.85 → Très bonne\n` +
                            `Score >= 0.7 → Bonne\n` +
                            `Score >= 0.5 → Moyenne\n` +
                            `Score < 0.5 → Mauvaise\n\n` +
                            `=> Cette salle est "${result.status}" car son score total est ${result.score.toFixed(2)}`
                          );
                        }}
                      >
                        Voir détails
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => confirmRemoveCapteur(capteur.id)}
                    >
                      Delete
                    </button>
                    <button
  type="button"
  className="btn btn-outline-warning btn-sm me-2"
  onClick={() => loadAlertes(capteur.id)}
>
  Alertes
</button>
<td>
</td>



                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

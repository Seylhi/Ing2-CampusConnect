import React from "react";

export default function ListeCapteur({ capteur, resultat, onSupprimer, onAfficherAlertes, onActiverChauffage, onAfficherHistorique }) {

  const seuil_temperature = 19;
  const temperatureSousSeuil = capteur.temperature !== null && capteur.temperature < seuil_temperature;
  const capteurDefaillant = 
  (capteur.temperature !== null && (capteur.temperature > 28 || capteur.temperature < 19))
  || (capteur.humidite !== null && (capteur.humidite > 80 || capteur.humidite < 10))
  || (capteur.presence !== null && capteur.presence > 80);

  let styleTemperature = { color: "black", fontWeight: "normal" };

if (temperatureSousSeuil) {
  styleTemperature.color = "red";
  styleTemperature.fontWeight = "bold";
}

  const afficherDetails = () => {
    if (!resultat) return;

    const detail = resultat.details;

    const valeurTemp = capteur.temperature;
    const idealTemp = 21;
    const toleranceTemp = 10;
    const scoreTemp = Math.max(0, Math.min(1, 1 - Math.abs(valeurTemp - idealTemp) / toleranceTemp));

    const valeurHum = capteur.humidite;
    const idealHum = 45;
    const toleranceHum = 50;
    const scoreHum = Math.max(0, Math.min(1, 1 - Math.abs(valeurHum - idealHum) / toleranceHum));

    const scoreChauffage = detail.chauffage;

    let intervalle = "";
    if (resultat.score >= 0.85) intervalle = "Très bonne (>=0.85)";
    else if (resultat.score >= 0.7) intervalle = "Bonne (0.7 - 0.84)";
    else if (resultat.score >= 0.5) intervalle = "Moyenne (0.5 - 0.69)";
    else intervalle = "Mauvaise (<0.5)";

    alert(
      `                                       DÉTAIL DU CALCUL                           \n` +
      `Score total: ${resultat.score.toFixed(2)}\n` +
      `Status actuel: ${intervalle}\n\n` +
      `                                     Calcul par critère                           \n` +
      `Température: ${detail.temperature.toFixed(2)} => pondéré 50%\n` +
      `  (valeur réelle: ${valeurTemp}°C)\n` +
      `  formule: 1 - (|${valeurTemp} - ${idealTemp}| / ${toleranceTemp}) = ${scoreTemp.toFixed(2)}\n` +
      `Humidité: ${detail.humidite.toFixed(2)} => pondéré 30%\n` +
      `  (valeur réelle: ${valeurHum}%)\n` +
      `  formule: 1 - (|${valeurHum} - ${idealHum}| / ${toleranceHum}) = ${scoreHum.toFixed(2)}\n` +
      `Chauffage: ${detail.chauffage.toFixed(2)} => pondéré 20%\n\n` +
      `                                     Formule du score:                           \n` +
      `scoreCapteur = scoreTemp*0.5 + scoreHum*0.3 + scoreChauffage*0.2\n` +
      `scoreSalle = moyenne(scoreCapteur pour tous les capteurs)\n\n` +
      `Intervalle de score:\n` +
      `  Très bonne >= 0.85\n` +
      `  Bonne      0.7 - 0.84\n` +
      `  Moyenne    0.5 - 0.69\n` +
      `  Mauvaise   < 0.5\n\n` +
      `=> Cette salle est "${intervalle}" car son score total est ${resultat.score.toFixed(2)}`
    );
  };
  return (
    <tr>
      <th>{capteur.id}</th>
      <td>{capteur.idSalle}</td>
      <td>{capteur.humidite}</td>
      <td style={styleTemperature}>{capteur.temperature}</td>
      <td>{capteur.presence}</td>
      <td>{capteur.dateMesure?.substring(0, 10)}</td>
      <td>{capteur.fenetreOuverte ? "Oui" : "Non"}</td>
      <td>{capteur.porteOuverte ? "Oui" : "Non"}</td>
      <td>{capteur.chauffageOn ? "Oui" : "Non"}</td>

      <td>
        {(() => {
          let etatAffiche = "Chargement...";
          if (resultat && resultat.status) {
            etatAffiche = resultat.status;
          }
          return (
            <>
              {etatAffiche}
              {resultat && (
                <button
                  className="btn btn-sm btn-outline-info ms-2"
                  onClick={afficherDetails}
                >
                  Voir détails
                </button>
              )}
            </>
          );
        })()}
      </td>

      <td>
        <button className="btn btn-sm btn-outline-danger me-2" onClick={() => onSupprimer(capteur.id)}>
          Supprimer
        </button>
        <button className="btn btn-sm btn-outline-warning" onClick={() => onAfficherAlertes(capteur.id)}>
          Alertes
        </button>
        <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => onAfficherHistorique(capteur)}>
          Historique
        </button>

      {temperatureSousSeuil && !capteur.chauffageOn && (
  <button
    className="btn btn-sm btn-danger me-2" onClick={() => onActiverChauffage(capteur.idSalle)}>
    Activer chauffage
  </button>
)}
{capteurDefaillant && <b 
style={{ color: "red" }}>Capteur détectant une donnée anormal</b>
}
      </td>
    </tr>
  );
}
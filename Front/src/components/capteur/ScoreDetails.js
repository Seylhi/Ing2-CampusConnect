import React from "react";

export default function ScoreDetails({ capteur, resultat, fermer }) {
  if (!resultat) return null;

  const detailsScore = resultat.details;

  return (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Détails du score - Capteur {capteur.id}</h5>
            <button type="button" className="btn-close" onClick={fermer}></button>
          </div>

          <div className="modal-body">
            <p><strong>Score total :</strong> {resultat.score.toFixed(2)}</p>
            <p><strong>Status :</strong> {resultat.status}</p>
            <hr />
            <p><strong>Température :</strong> {detailsScore.temperature.toFixed(2)}</p>
            <p><strong>Humidité :</strong> {detailsScore.humidite.toFixed(2)}</p>
            <p><strong>Chauffage :</strong> {detailsScore.chauffage.toFixed(2)}</p>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={fermer}>Fermer</button>
          </div>

        </div>
      </div>
    </div>
  );
}
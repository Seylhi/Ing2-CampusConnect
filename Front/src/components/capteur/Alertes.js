import React from "react";

export default function Alertes({ alertes, fermer }) {

  if (!alertes || alertes.length === 0) return null;

  return (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Alertes actives</h5>
            <button
              type="button"
              className="btn-close"
              onClick={fermer}
            ></button>
          </div>

          <div className="modal-body">
            {alertes.map((alerte, indice) => (
              <div key={indice} className="mb-3">
                <strong>{alerte.type}</strong>
                <p>{alerte.message}</p>
                <small className="text-muted">
                  {new Date(alerte.dateAlerte).toLocaleString()}
                </small>
                <hr />
              </div>
            ))}
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={fermer}
            >
              Fermer
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
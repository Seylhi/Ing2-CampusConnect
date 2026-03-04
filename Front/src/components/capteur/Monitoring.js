import React from "react";

export default function Monitoring({ resultatsScore }) {
  const salles = Object.keys(resultatsScore);

  if (salles.length === 0) {
    return <div className="text-center mb-4">Aucune salle à surveiller</div>;
  }

  return (
    <div className="mb-4">
      <h4 className="text-center">Monitoring des salles</h4>

      <table className="table table-bordered text-center">
        <thead>
          <tr>
            <th>Salle</th>
            <th>Score</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {salles.map((idSalle) => {
            const resultat = resultatsScore[idSalle];

            let texteScore = "-";
            let texteStatus = "Chargement...";

            if (resultat) {
              if (resultat.score !== undefined && resultat.score !== null) {
                texteScore = resultat.score.toFixed(2);
              }
              if (resultat.status) {
                texteStatus = resultat.status;
              }
            }

            return (
              <tr key={idSalle}>
                <td>{idSalle}</td>
                <td>{texteScore}</td>
                <td>{texteStatus}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
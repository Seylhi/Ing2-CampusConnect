import React, { useEffect, useState } from "react";
import axios from "axios";
import { LOCAL_HOST } from "../../constants/back";

export default function Historique({ capteur, fermer }) {

  const [listeMesures, setListeMesures] = useState([]);
  const [enChargement, setEnChargement] = useState(true);

  useEffect(() => {
  if (!capteur) return;

  async function chargerHistorique() {
    try {
      setEnChargement(true);

      const reponse = await axios.get(`${LOCAL_HOST}/capteur/${capteur.id}/historique`);

      setListeMesures(reponse.data);

    } catch (err) {
      console.error("Erreur :", err);
    } finally {
      setEnChargement(false);
    }
  }

  chargerHistorique();

}, [capteur]);

  if (!capteur) return null;

const aDesMesures = listeMesures.length > 0;

let valeurMin = 0;
let valeurMax = 0;
let moyenne = 0;

if (aDesMesures) {
  const valeurs = listeMesures.map(m => m.valeur);

  valeurMin = Math.min(...valeurs);
  valeurMax = Math.max(...valeurs);

  let somme = 0;
  valeurs.forEach(v => {
    somme += v;
  });

  moyenne = somme / valeurs.length;
}
  function formaterHeure(date) {
  if (!date) return "";
  return new Date(date).toLocaleTimeString("fr-FR");
}

  return (
    <div className="modal d-block">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">
              Historique température des capteurs {capteur.id}
            </h5>
            <button className="btn-close" onClick={fermer}></button>
          </div>

          <div className="modal-body">

            {enChargement && <p>Chargement...</p>}

            {!enChargement && !aDesMesures && (
              <p className="text-muted text-center">
                Aucune mesure trouvée
              </p>
            )}

            {!enChargement && aDesMesures && (
              <>
                <table className="table table-sm table-bordered">
                  <thead>
                    <tr>
                      <th>id</th>
                      <th>Heure</th>
                      <th>Type</th>
                      <th>Valeur</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listeMesures.map((mesure, index) => {

                      const estAnormal = mesure.valeur < 19 || mesure.valeur > 28;

                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{formaterHeure(mesure.dateMesure)}</td>
                          <td>{mesure.type}</td>
                          <td>
                            <span style={{
                              color: estAnormal ? "red" : "black",
                              fontWeight: estAnormal ? "bold" : "normal"
                            }}>
                              {mesure.valeur} degré
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="mt-3">
                  <strong>Résumé :</strong>
                  <p>
                    Nombre : {listeMesures.length} , 
                    Min : {valeurMin} degré ,
                    Max : {valeurMax} degré ,
                    Moyenne arrondit : {moyenne.toFixed(0)} degré
                  </p>
                </div>
              </>
            )}

          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={fermer}>
              Fermer
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
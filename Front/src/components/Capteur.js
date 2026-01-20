import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Capteur.css";
import {
  GET_CAPTEURS,
  LOCAL_HOST_CAPTEUR,
  UPDATE_CAPTEURS,
} from "../constants/back";

export default function Capteur() {
  const [capteurs, setCapteurs] = useState([]);

  // Charger tous les capteurs
  const setCapteurData = async () => {
    axios
      .get(GET_CAPTEURS)
      .then((response) => {
        setCapteurs(response.data);
      })
      .catch((error) => {
        alert("Error occurred while loading data: " + error);
      });
  };

  // Supprimer un capteur avec confirmation
  const confirmRemoveCapteur = (id) => {
    if (window.confirm("Are you sure?")) {
      removeCapteur(id);
    }
  };

  const removeCapteur = async (id) => {
    axios
      .delete(LOCAL_HOST_CAPTEUR + id)
      .then(() => {
        setCapteurData();
      })
      .catch((error) => {
        alert("Error occurred in removeCapteur: " + error);
      });
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
      .then(() => {
        setCapteurData();
      })
      .catch((error) => {
        alert("Error occurred in updateDate: " + error);
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
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {capteurs.map((capteur, index) => (
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
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => confirmRemoveCapteur(capteur.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

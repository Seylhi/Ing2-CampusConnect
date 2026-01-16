import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Salle.css";
import { GET_SALLES } from "../constants/back";

export default function Salle() {
  const [salles, setSalles] = useState([]);

  const loadSalles = async () => {
    axios
      .get(GET_SALLES)
      .then((response) => setSalles(response.data))
      .catch((error) => {
        alert("Error occurred while loading salles: " + error);
      });
  };

  useEffect(() => {
    loadSalles();
  }, []);

  if (salles.length === 0) return <div className="container text-center">No salles</div>;

  return (
    <div className="container text-center">
      <h4 className="mx-2">Liste des salles</h4>
      <div className="row">
        <table className="table table-sm table-bordered table-hover">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nom</th>
              <th>Capacité</th>
              <th>TP</th>
              <th>Surface (m²)</th>
              <th>Fenêtres</th>
              <th>Orientation</th>
              <th>Chauffage</th>
            </tr>
          </thead>
          <tbody>
            {salles.map((salle, index) => (
              <tr key={index}>
                <td>{salle.idSalle}</td>
                <td>{salle.nomSalle}</td>
                <td>{salle.capacite}</td>
                <td>{salle.estSalleTp ? "Oui" : "Non"}</td>
                <td>{salle.surfaceM2}</td>
                <td>{salle.nbFenetres}</td>
                <td>{salle.orientation}</td>
                <td>{salle.chauffage ? "Oui" : "Non"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

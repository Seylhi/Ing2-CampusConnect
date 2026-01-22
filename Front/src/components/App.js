import React from "react";
import logo from "../assets/CC_logo_gauche_bg.png";
import "../styles/App.css";

export default function App() {
  return (
    <div className="App">
      <img src={logo} alt="logo" />
      <h1>CampusConnect</h1>
      <p>Votre portail pour la gestion des évènements étudiants</p>
    </div>
  );
}

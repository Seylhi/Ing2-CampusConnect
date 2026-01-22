import React from "react";
import { Link } from "react-router-dom";
import logoEpisen from "../assets/logo_episen.png";
import "../styles/Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a
          href="https://episen.u-pec.fr/"   // on introduit le lien cible
        >
          <img src={logoEpisen} alt="Site EPISEN" className="navbar-logo" />
        </a>
      </div>

      <div className="navbar-links"> 
        <Link to="/">Accueil</Link>   
        <Link to="/salle">Salles</Link>
        <Link to="/capteur">Capteurs</Link>
        <Link to="/map">Carte</Link>
      </div>
    </nav>
  );
}
// Les liens sont gérés par le routeur (comme pour le proto)
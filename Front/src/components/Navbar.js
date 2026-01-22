import React from "react";
import { Link } from "react-router-dom";
import logoEpisen from "../assets/logo_episen.png";
import "../styles/Navbar.css";

export default function Navbar() {
  return (
    <ul className="nav justify-content-center my-3">
      <li className="nav-item">
        <Link className="nav-link" to="/">
          Home
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/sample">
          Sample
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/salle">
          Salle
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/capteur">
          Capteur
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/map">
          Map
        </Link>
      </li>
    </ul>
  );
}
// Les liens sont gérés par le routeur (comme pour le proto)
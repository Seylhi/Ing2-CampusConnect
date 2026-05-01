import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logoEpisen from "../assets/logo_episen.png";
import "../styles/Navbar.css";
import {
  ROLES,
  getUser,
  hasRole,
  logout,
  isAuthenticated,
} from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
    window.location.reload();
  };

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a
          href="https://episen.u-pec.fr/" // on introduit le lien cible
        >
          <img src={logoEpisen} alt="Site EPISEN" className="navbar-logo" />
        </a>
      </div>

      <div className="navbar-links">
        <Link to="/">Accueil</Link>

        {hasRole([ROLES.ADMIN, ROLES.AGENT_SECURITE, ROLES.ETUDIANT]) && (
          <Link to="/salle">Salles</Link>
        )}

        {hasRole([ROLES.ADMIN, ROLES.AGENT_SECURITE]) && (
          <Link to="/capteur">Capteurs</Link>
        )}

        {hasRole([ROLES.ADMIN, ROLES.AGENT_SECURITE, ROLES.ETUDIANT]) && (
          <Link to="/map">Carte</Link>
        )}

        {hasRole([ROLES.ADMIN, ROLES.ETUDIANT]) && (
          <Link to="/offres">Offres</Link>
        )}

        {hasRole([ROLES.ADMIN, ROLES.ETUDIANT]) && (
          <Link to="/jobdating">Job Dating</Link>
        )}

        <span style={{ color: "white", marginLeft: "15px" }}>
          {user?.prenom} - {user?.role}
        </span>

        <button
          onClick={handleLogout}
          style={{
            marginLeft: "15px",
            padding: "8px 12px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
}
// Les liens sont gérés par le routeur (comme pour le proto)

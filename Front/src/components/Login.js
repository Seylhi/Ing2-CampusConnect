import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUser } from "../utils/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErreur("");

    try {
      const response = await fetch("http://localhost:8080/utilisateur/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          mot_de_passe: motDePasse,
        }),
      });

      if (!response.ok) {
        setErreur("Email ou mot de passe incorrect");
        return;
      }

      const data = await response.json();

      setUser(data);

      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Erreur connexion :", error);
      setErreur("Erreur lors de la connexion au serveur");
    }
  };

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "80px auto",
        padding: "30px",
        borderRadius: "12px",
        background: "#f7f7f7",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "25px" }}>Connexion</h2>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "15px" }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            placeholder="admin@campusconnect.fr"
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Mot de passe</label>
          <input
            type="password"
            value={motDePasse}
            placeholder="admin123"
            onChange={(e) => setMotDePasse(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
            required
          />
        </div>

        {erreur && (
          <p style={{ color: "red", marginBottom: "15px" }}>{erreur}</p>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "6px",
            background: "#2c3e50",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Se connecter
        </button>
      </form>

      <div style={{ marginTop: "25px", fontSize: "14px" }}>
        <p>
          <b>Admin :</b> admin@campusconnect.fr / admin123
        </p>
        <p>
          <b>Agent :</b> agent@campusconnect.fr / agent123
        </p>
        <p>
          <b>Étudiant :</b> etudiant@campusconnect.fr / etudiant123
        </p>
      </div>
    </div>
  );
}

// ici pour simplifier j'ai ajouute une section avec les identifiants pour tester rapidement

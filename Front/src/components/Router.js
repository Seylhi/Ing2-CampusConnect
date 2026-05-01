import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from "./App";
import Salle from "./Salle";
import Capteur from "./capteur/Capteur";
import Navbar from "./Navbar";
import Map from "./Map";
import Offres from "./Offres";
import JobDating from "./JobDating";
import NotFound from "./NotFound";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";

import { ROLES } from "../utils/auth";

export default function Router() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />

        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute
                allowedRoles={[
                  ROLES.ADMIN,
                  ROLES.AGENT_SECURITE,
                  ROLES.ETUDIANT,
                ]}
              >
                <App />
              </ProtectedRoute>
            }
          />

          <Route
            path="/salle"
            element={
              <ProtectedRoute
                allowedRoles={[
                  ROLES.ADMIN,
                  ROLES.AGENT_SECURITE,
                  ROLES.ETUDIANT,
                ]}
              >
                <Salle />
              </ProtectedRoute>
            }
          />

          <Route
            path="/capteur"
            element={
              <ProtectedRoute
                allowedRoles={[ROLES.ADMIN, ROLES.AGENT_SECURITE]}
              >
                <Capteur />
              </ProtectedRoute>
            }
          />

          <Route
            path="/map"
            element={
              <ProtectedRoute
                allowedRoles={[
                  ROLES.ADMIN,
                  ROLES.AGENT_SECURITE,
                  ROLES.ETUDIANT,
                ]}
              >
                <Map />
              </ProtectedRoute>
            }
          />

          <Route
            path="/offres"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.ETUDIANT]}>
                <Offres />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobdating"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.ETUDIANT]}>
                <JobDating />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

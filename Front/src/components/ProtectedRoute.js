import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, hasRole } from "../utils/auth";

export default function ProtectedRoute({ allowedRoles, children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(allowedRoles)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

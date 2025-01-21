import React from "react";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token"); // Verifica si existe un token en el almacenamiento local.

  if (!token) {
    // Redirige al login si no hay token.
    return <Navigate to="/login" replace />;
  }

  return children; // Si el token existe, permite el acceso.
}

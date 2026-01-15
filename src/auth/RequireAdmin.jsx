import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function RequireAdmin({ children }) {
  const { loading, user, isAdmin } = useAuth();

  if (loading) return null; // vagy spinner
  if (!user) return <Navigate to="/admin-login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}

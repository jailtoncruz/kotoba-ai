import React from "react";
import { Navigate } from "react-router-dom";

const LoginGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("authToken");

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default LoginGuard;
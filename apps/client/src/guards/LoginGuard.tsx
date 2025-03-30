import { Navigate, Outlet } from "react-router-dom";

export function LoginGuard() {
  const isAuthenticated = !!localStorage.getItem("authToken");
  return isAuthenticated ? <Navigate to="/home" replace /> : <Outlet />;
}

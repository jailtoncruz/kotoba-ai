import { Navigate, Outlet } from "react-router-dom";

export function AuthGuard() {
  const isAuthenticated = !!localStorage.getItem("authToken");
  return !isAuthenticated ? <Navigate to="/sign-in" replace /> : <Outlet />;
}

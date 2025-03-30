import { Navigate, Outlet } from "react-router-dom";

function LoginGuard() {
  const isAuthenticated = !!localStorage.getItem("authToken");
  return isAuthenticated ? <Navigate to="/home" replace /> : <Outlet />;
};

export default LoginGuard;
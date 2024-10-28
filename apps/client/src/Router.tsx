import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Home } from "./pages/home/Home";
import { Login } from "./pages/login/Login";
import AuthGuard from "./core/guards/AuthGuard";
import LoginGuard from "./core/guards/LoginGuard";
import { Practice } from "./pages/home/practice/Practice";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={
            <LoginGuard>
              <Login />
            </LoginGuard>
          }
        />
        <Route
          path="/home"
          element={
            <AuthGuard>
              <Home />
            </AuthGuard>
          }
        />
        <Route
          path="/home/practice"
          element={
            <AuthGuard>
              <Practice />
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
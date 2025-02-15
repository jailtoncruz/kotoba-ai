import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { SignInRoutes } from "./pages/sign-in/sign-in.routes";
import { Home } from "./pages/home";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/sign-in" replace />} />
        <Route path="/sign-in/*" element={<SignInRoutes />} />
        <Route path="/home/*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

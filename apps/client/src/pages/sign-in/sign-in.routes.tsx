import { Route, Routes } from "react-router-dom";
import { Login } from "./login/Login";
import { SignUp } from "./sign-up";
import LoginGuard from "../../core/guards/LoginGuard";

export function SignInRoutes() {
  return (
    <LoginGuard>
      <Routes>
        <Route path="" element={<Login />} />
        <Route path="sign-up" element={<SignUp />} />
      </Routes>
    </LoginGuard>
  );
}

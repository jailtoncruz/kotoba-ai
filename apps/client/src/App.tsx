import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginGuard from "./guards/LoginGuard";
import { Home } from "./pages/home";
import { SignIn } from "./pages/sign-in";

const queryClient = new QueryClient();

function App() {
  return (
    <div className="flex h-screen flex-col max-h-screen bg-background">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route element={<LoginGuard />}>
              <Route path="/sign-in/*" element={<SignIn />} />
            </Route>
          </Routes>
          <Routes>
            <Route path="/" element={<Navigate to="/sign-in" replace />} />
            <Route path="/home/*" element={<Home />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </QueryClientProvider>
    </div>
  );
}

export default App;

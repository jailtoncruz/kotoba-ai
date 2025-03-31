import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SignIn } from "./pages/sign-in";
import { AuthGuard, LoginGuard } from "./guards";
import { HomeLayout } from "@layouts/home-layout";

const queryClient = new QueryClient();

function App() {
  return (
    <div className="flex h-screen flex-col max-h-screen bg-background">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/sign-in" replace />} />
            <Route element={<LoginGuard />}>
              <Route path="/sign-in/*" element={<SignIn />} />
            </Route>
            <Route element={<AuthGuard />}>
              <Route path="/home/*" element={<HomeLayout />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </QueryClientProvider>
    </div>
  );
}

export default App;
